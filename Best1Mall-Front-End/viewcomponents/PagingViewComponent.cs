using Best1Mall_Front_End.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace WEB.CMS.ViewComponents
{
    public class PagingViewComponent : ViewComponent
    {
       
        public PagingViewComponent()
        {
           
        }

        public async Task<IViewComponentResult> InvokeAsync(PagingFeViewModel request)
        {
            return View(request);
        }

       
    }
}
