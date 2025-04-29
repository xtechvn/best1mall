using Microsoft.AspNetCore.Mvc;

namespace WEB.CMS.ViewComponents
{
    public class SearchViewComponent : ViewComponent
    {
       
        public SearchViewComponent()
        {
           
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            return View();
        }

       
    }
}
