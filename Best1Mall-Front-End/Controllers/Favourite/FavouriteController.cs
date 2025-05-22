using Best1Mall_Front_End.Controllers.Client.Business;
using Best1Mall_Front_End.Controllers.Favourite.Business;
using Best1Mall_Front_End.Models.Cart;
using Microsoft.AspNetCore.Mvc;
using Models.APIRequest;

namespace Best1Mall_Front_End.Controllers.Favourite
{
    public class FavouriteController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly FavouriteService _favouriteServices;

        public FavouriteController(IConfiguration configuration)
        {

            _configuration = configuration;
            _favouriteServices = new FavouriteService(configuration);

        }
        public IActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> AddToFavourite(FavouriteRequestModel request)
        {
            var result = await _favouriteServices.AddToFavourite(request);

            return Ok(new
            {
                is_success = result != null,
                data = result
            });
        }
        public async Task<IActionResult> Delete(FavouriteRequestModel request)
        {
            var result = await _favouriteServices.Delete(request);

            return Ok(new
            {
                is_success = result > -1,
                data = result
            });
        }
        public async Task<IActionResult> GetList(FavouriteGeneralRequestModel request)
        {
            var result = await _favouriteServices.GetList(request);

            return Ok(new
            {
                is_success = result != null,
                data = result?.items,
                total = result?.total ?? 0
            });
        }
       
    }
}
