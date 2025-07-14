namespace PSP_LR_ALL.Models
{
    public class Cart
    {
        public int Id { get; set; } = 1;

        public ICollection<CartPart> CartParts { get; set; } = new List<CartPart>();


    }
}
