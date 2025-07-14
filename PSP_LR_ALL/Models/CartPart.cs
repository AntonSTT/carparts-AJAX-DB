using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PSP_LR_ALL.Models
{
    public class CartPart
    {
        public int Id { get; set; }

        public int CartId { get; set; } = 1;

        [ForeignKey(nameof(CartId))]
        public Cart cart { get; set; }

        public int CarPartID { get; set; }

        [ForeignKey(nameof(CarPartID))]
        public CarPart carPart { get; set;  }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; } = 1;
    }
}
