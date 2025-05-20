using Best1Mall_Front_End.Service.Redis;
using Microsoft.AspNetCore.Http.Features;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddResponseCaching(); // Cho phép sử dụng Response Caching
builder.Services.AddMemoryCache(); // Đăng ký Memory Cache
builder.Services.AddSingleton<RedisConn>();

// Increase UploadSize to 100MB
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 1024 * 1024 * 100; 
});
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase; // Use null for PascalCase
    });

var app = builder.Build();
// GỌI CONNECT Ở ĐÂY 👇
var redisService = app.Services.GetRequiredService<RedisConn>();
redisService.Connect(); // 👈 Gọi sớm khi app khởi động

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/NotFound");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
//Support Controller
app.MapControllerRoute(
    name: "Support",
    pattern: "/cham-soc-khach-hang",
    defaults: new { controller = "Support", action = "Index" });
app.MapControllerRoute(
    name: "Policy",
    pattern: "/chinh-sach/{policy}",
    defaults: new { controller = "Support", action = "Index" });
app.MapControllerRoute(
    name: "Policy",
    pattern: "/questions/{policy}",
    defaults: new { controller = "Support", action = "Index" });
app.MapControllerRoute(
    name: "Comment",
    pattern: "/dong-gop-y-kien",
    defaults: new { controller = "Support", action = "feedback" });
//app.MapControllerRoute(
//    name: "tin-tuc",
//    pattern: "/tin-tuc",
//    defaults: new { controller = "News", action = "Index" });
app.MapControllerRoute(
    name: "newsCategory",
    pattern: "/{category}",
    defaults: new { controller = "News", action = "Index" });
app.MapControllerRoute(
    name: "newsDetail",
    pattern: "tin-tuc/{slug}-{id}",
    defaults: new { controller = "News", action = "NewsDetails" });
app.MapControllerRoute(
    name: "san-pham",
    pattern: "/san-pham/{title}--{product_code}",
    defaults: new { controller = "Product", action = "Detail" });
app.MapControllerRoute(
    name: "thanh-toan",
    pattern: "/order/payment/{id}",
    defaults: new { controller = "Order", action = "Payment" });
app.MapControllerRoute(
    name: "thanh-toan",
    pattern: "/order/detail/{id}",
    defaults: new { controller = "Order", action = "Detail" });
app.MapControllerRoute(
    name: "san-pham-new",
    pattern: "/product/detailnew/{title}--{product_code}",
    defaults: new { controller = "Product", action = "DetailNew" });
app.MapControllerRoute(
    name: "tim-kiem",
    pattern: "/tim-kiem/{keyword}",
    defaults: new { controller = "Product", action = "SearchListing" });
app.MapControllerRoute(
    name: "doi-mat-khau",
    pattern: "/account/change-password",
    defaults: new { controller = "Client", action = "ChangePassword" });
app.MapControllerRoute(
    name: "error",
    pattern: "/error",
    defaults: new { controller = "Home", action = "NotFound" });
app.Run();
