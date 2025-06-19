using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.IO;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc.ViewEngines; // ✅ Bắt buộc để nhận diện IView


namespace Best1Mall_Front_End.Utilities
{
    public static class ControllerExtensions
    {
        public static async Task<string> RenderViewComponentToStringAsync(this Controller controller, string componentName, object arguments)
        {
            var serviceProvider = controller.HttpContext.RequestServices;

            var viewComponentHelper = serviceProvider.GetRequiredService<IViewComponentHelper>() as IViewComponentHelper;
            var tempDataProvider = serviceProvider.GetRequiredService<ITempDataProvider>();
            var htmlHelperOptions = serviceProvider.GetRequiredService<HtmlHelperOptions>();

            using var writer = new StringWriter();

            var viewContext = new ViewContext(
                controller.ControllerContext,
                new DummyView(), // View giả để pass context
                controller.ViewData,
                controller.TempData,
                writer,
                htmlHelperOptions
            );

            if (viewComponentHelper is IViewContextAware contextable)
            {
                contextable.Contextualize(viewContext);
            }

            var result = await viewComponentHelper.InvokeAsync(componentName, arguments);
            result.WriteTo(writer, HtmlEncoder.Default);
            return writer.ToString();
        }

        private class DummyView : IView
        {
            public string Path => "DummyView";

            public Task RenderAsync(ViewContext context)
            {
                return Task.CompletedTask;
            }
        }

        public static async Task<string> RenderViewAsync<TModel>(this Controller controller, string viewName, TModel model, bool partial = false)
        {
            controller.ViewData.Model = model;

            using var writer = new StringWriter();
            var viewEngine = controller.HttpContext.RequestServices.GetService<ICompositeViewEngine>();
            var viewResult = partial
                ? viewEngine.FindView(controller.ControllerContext, viewName, false)
                : viewEngine.GetView(null, viewName, false);

            if (viewResult.View == null)
            {
                throw new ArgumentNullException($"View '{viewName}' not found.");
            }

            var viewContext = new ViewContext(
                controller.ControllerContext,
                viewResult.View,
                controller.ViewData,
                controller.TempData,
                writer,
                new HtmlHelperOptions()
            );

            await viewResult.View.RenderAsync(viewContext);
            return writer.GetStringBuilder().ToString();
        }
    }
}
