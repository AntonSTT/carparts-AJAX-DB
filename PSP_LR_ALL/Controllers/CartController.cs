using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using PSP_LR_ALL.Models;

namespace PSP_LR_ALL.Controllers
{
    public class CartController : Controller
    {
        private readonly PSPDbContext _context;

        public CartController(PSPDbContext context)
        {
            _context = context;
        }
        public async Task<IActionResult> All()
        {
            var cart = await _context.Carts.Include(c => c.CartParts).ThenInclude(c => c.carPart)
                .FirstOrDefaultAsync(c => c.Id == 1);

            return View(cart);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] int carPartId)
        {
            var carpart = await _context.CarParts.FindAsync(carPartId);
            Console.WriteLine(carPartId);
            var cart = await _context.Carts.Include(c => c.CartParts).FirstOrDefaultAsync(c => c.Id == 1);
            if (carpart != null)
            {
                cart.CartParts.Add(new CartPart
                {
                    CarPartID = carPartId,
                    Quantity = 1

                });
                await _context.SaveChangesAsync();
                return Json(new { success = true });
            }
            
            

            return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> Remove([FromBody]int carPartId)
        {
            var cart = await _context.Carts.Include(c => c.CartParts)
                .FirstOrDefaultAsync(c => c.Id == 1);

            var cartPart = cart.CartParts.FirstOrDefault(c => c.CarPartID == carPartId);

            if (cartPart != null)
            {
                _context.CartParts.Remove(cartPart);
                await _context.SaveChangesAsync();

                return Json(new { success = true });
            }

            return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> UpdateQuantity([FromForm] int carPartId,[FromForm] int quantity)
        {
            var cart = await _context.Carts.Include(c => c.CartParts)
                .FirstOrDefaultAsync(c => c.Id == 1);
            var cartPart = cart.CartParts.FirstOrDefault(cp => cp.CarPartID == carPartId);
            Console.WriteLine(carPartId);
            Console.WriteLine(quantity);
            if (cartPart != null)
            {
                cartPart.Quantity = quantity;
                await _context.SaveChangesAsync();
                return Json(new { success = true, newQuantity = cartPart.Quantity });
            }

            return Json(new { success = false });

        }


    }
}
