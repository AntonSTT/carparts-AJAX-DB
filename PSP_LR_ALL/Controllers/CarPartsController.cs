using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using PSP_LR_ALL.Models;

namespace PSP_LR_ALL.Controllers
{   
    public class CarPartsController : Controller
    {
        private int pagesize = 7;
        private readonly PSPDbContext _context;
        

        public CarPartsController(PSPDbContext context)
        {
            _context = context;
        }

        // GET: CarParts
        public async Task<IActionResult> Catalog(int? categoryId)
        {
            IQueryable<CarPart> carparts = _context.CarParts.Include(c => c.Category)
                                              .OrderByDescending(c => c.Id);
                                              

            ViewBag.Category = new SelectList(_context.Categories, "Id", "Name");

            if (categoryId.HasValue)
            {
                carparts = carparts.Where(c => c.CatKey == categoryId.Value);
                ViewBag.SelectedCategory = categoryId.Value;
            }
            carparts = carparts.Take(pagesize);

            return View(await carparts.ToListAsync());
        }

        public async Task<IActionResult> Product(int? id)
        {
            if (id is null)
            {
                return NotFound();
            }

            var part = await _context.CarParts.Include(c => c.Category).FirstOrDefaultAsync(c => c.Id == id);

            if (part == null)
            {
                return NotFound();
            }

            var cart = await _context.CartParts.FirstOrDefaultAsync(cp => cp.CarPartID == id);

            ViewBag.IsInCart = (cart != null);
            if (ViewBag.IsInCart)
            {
                ViewBag.Quant = cart?.Quantity;
            }
            

            return View(part);
        }

        public async Task<IActionResult> AddItem()
        {
            ViewBag.Categories = new SelectList(_context.Categories, "Id", "Name");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddItem([Bind("Name,Manufacturer,CatKey,Type,Number,Image,Compatibility,Price,Description")] CarPart carPart)
        {
            try
            {
                foreach (var key in ModelState.Keys)
                {
                    var errors = ModelState[key].Errors;
                    if (errors.Count > 0)
                    {
                        Console.WriteLine($"Key: {key}, Error: {errors[0].ErrorMessage}");
                    }
                }
                if (ModelState.IsValid)
                {
                    var category = await _context.Categories.FindAsync(carPart.CatKey);
                    carPart.Category = category;
                    _context.CarParts.Add(carPart);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Catalog));
                }
            }
            catch (Exception ex) {
                Console.WriteLine(ex.Message);

            }


            ViewBag.Categories = new SelectList(_context.Categories, "Id", "Name");
            return View(carPart);
        }

        [HttpGet]
        public async Task<JsonResult> GetSuggestions(string query)
        {
            var products = await _context.CarParts
            .Where(p => p.Name.Contains(query)).Take(5).Select(p => new { p.Name, p.Id }).OrderBy(p => p.Name.IndexOf(query)).ToListAsync();
            Console.WriteLine($"{products.Count} products");
            Console.WriteLine(products);
            Console.WriteLine(query);
            return Json(products);

        }

        [HttpGet]
        public async Task<IActionResult> FilterCarParts(int[] categories, string searchquery, int? minprice, int? maxprice, int page = 1)
        {
            IQueryable<CarPart> query = _context.CarParts.Include(c => c.Category);
            Console.WriteLine(searchquery);
            if (categories.Length != 0 && categories != null)
            {
                query = query.Where(c => categories.Contains(c.CatKey));
            }

            if (minprice.HasValue)
            {
                query = query.Where(c=> c.Price >= minprice.Value);
            }else if (!(minprice.HasValue))
            {
                query = query.Where(c => c.Price >= 0);
                minprice = 0;
            }
            



            if (maxprice.HasValue && maxprice > minprice)
            {
                query = query.Where(c => c.Price <= maxprice.Value);
            }

            if (!string.IsNullOrEmpty(searchquery))
            {
                query = query.Where(p => p.Name.Contains(searchquery)).OrderBy(p => p.Name.IndexOf(searchquery));
            }
            else
            {
                query = query.OrderByDescending(p => p.Id);
            }

            var total = await query.CountAsync();



            var filteredParts = await query.Skip((page-1)*pagesize).Take(pagesize)
                .ToListAsync();
            Response.Headers.Add("X-Has-Next", (page * pagesize < total).ToString());
            ViewBag.CurrentPage = page;

            return PartialView("_CarPartsListPartial", filteredParts);
        }




        

        
    }
}
