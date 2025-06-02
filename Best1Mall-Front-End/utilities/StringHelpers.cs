using Best1Mall_Front_End.Models.Products;
using System.Text;

namespace Best1Mall_Front_End.Utilities
{
    public static class StringHelpers
    {
        public static string CorrectImage(string image,string static_domain)
        {
            if (string.IsNullOrEmpty(image))
            {
                return string.Empty;
            }

            if (!image.Contains(static_domain) &&
                !image.Contains("data:image") &&
                !image.Contains("http") &&
                !image.Contains("base64,"))
            {
                image = static_domain + image;
            }

            return image;
        }
        public static string RenderVariationDetail(List<ProductAttributeMongoDbModel> attribute, List<ProductAttributeMongoDbModelItem> attributeDetail,
            List<ProductDetailVariationAttributesMongoDbModel> variation_detail)
        {
            if (attribute == null || attributeDetail == null || attribute.Count == 0 || attributeDetail.Count == 0)
            {
                return "";
            }

            StringBuilder variationValueBuilder = new StringBuilder();
            if (variation_detail != null&& variation_detail.Count>0)
            {
                foreach (var variationItem in variation_detail)
                {
                    var selected_attribute = attribute.FirstOrDefault(attr => attr._id == variationItem.id);
                    var selected_attributeDetail = attributeDetail.FirstOrDefault(detail => detail.name == variationItem.name);
                    if (selected_attribute != null && selected_attributeDetail != null)
                    {
                        variationValueBuilder.Append($"{selected_attribute.name}:{selected_attributeDetail.name}");
                        if (variation_detail.IndexOf(variationItem) < (variation_detail.Count - 1))
                        {
                            variationValueBuilder.Append(", ");
                        }
                    }
                }
            }
            

            return variationValueBuilder.ToString();
        }
    }
}
