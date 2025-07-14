using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace PSP_LR_ALL.Models
{
    public class CarPart
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Manufacturer { get; set; }

        public int CatKey { get; set; }

        [ForeignKey(nameof(CatKey))]
        public Category? Category { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public string Number { get; set; }
        public string Image { get; set; }
        public string Compatibility { get; set; }
        public int Price { get; set; }

        public bool Favourites { get; set; } = false;

    }
}