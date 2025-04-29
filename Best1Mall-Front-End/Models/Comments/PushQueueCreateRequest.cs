namespace HuloToys_Front_End.Models.Comments
{
    public class PushQueueCreateRequest
    {
        public long AccountClientId { get; set; }
        public string Content { get; set; }
        public string Email { get; set; }
        public int Type_Queue { get; set; }
    }
}
