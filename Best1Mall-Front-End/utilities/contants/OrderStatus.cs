namespace Best1Mall_Front_End.Utilities.contants
{
    public static class OrderStatus
    {
        public static int CREATED_ORDER = 0;
        public static int PAID = 6;
        public static int PROCESSING = 1;
        public static int DELIVERY = 2;
        public static int FINISHED_DELIVERY = 5;
        public static int FINISHED = 3;
        public static int CANCELED = 4;
    }
    public enum OrderStatusConstants
    {
         NEW = 0,
         PROCESS = 1,
         ON_DELIVERY = 2,
         DONE = 3,
         CANCELED = 4,
         DELIVERED = 5,
    }
}
