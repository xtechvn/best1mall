using Best1Mall_Front_End.ViewModels;
using Best1Mall_Front_End.ViewModels.Paginated;
using Microsoft.AspNetCore.Mvc;

namespace WEB.CMS.ViewComponents
{
    public class PaginationViewComponent : ViewComponent
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="total_items">Tổng toàn bộ bản ghi</param>
        /// <param name="page">index page</param>
        /// <param name="page_size">Số tin trên 1 page</param>
        /// <returns></returns>
        public async Task<IViewComponentResult?> InvokeAsync(int total_items, int total_page, int page_size, string view, int page)
        {
			try
			{                
                // Calculate total number of pages
               // var totalPages = (int)Math.Ceiling((double)total_items / page_size);

                var view_model = new PaginationNewsViewModel
                {
					CurrentPage = page,
					TotalPages = total_page
                };
				return View(view, view_model);
			}
			catch (Exception ex)
			{

				throw;
			}
        }
    }
}
