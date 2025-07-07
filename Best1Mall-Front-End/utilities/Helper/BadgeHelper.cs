namespace Best1Mall_Front_End.Utilities.Helper
{
    public static class BadgeHelper
    {
        public static string GetBadgeImageByType(int? badgeType)
        {
            if (!badgeType.HasValue) return "";

            switch (badgeType.Value)
            {
                case 117: return "/assets/images/tag-sieusale.png"; // SupperSale
                case 130: return "/assets/images/tag-banchay.png"; // Sale
                case 114: return "/assets/images/tag-hottrend.png"; // Bestchoice
                case 112: return "/assets/images/tag-noibat.png"; // Featuredproduct
                default: return ""; // Không hợp lệ => không render ảnh
            }
        }
    }
}
