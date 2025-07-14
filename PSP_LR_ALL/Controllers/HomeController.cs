using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using PSP_LR_ALL.Models;

namespace PSP_LR_ALL.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        /*public IActionResult Catalog()
        {
            return View();
        }*/

        public IActionResult Company()
        {
            return View();
        }
        public IActionResult AddItem()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
