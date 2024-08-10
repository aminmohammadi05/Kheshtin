
var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy(MyAllowSpecificOrigins,
                          policy =>
                          {
                              policy.AllowAnyOrigin()
                                     .AllowAnyHeader()
                                     .AllowAnyMethod();
                          });
});
// Add services to the container.
//builder.Services.AddRazorPages();
builder.Services.AddOrchardCms();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    //app.UsePathBase("/orchard");
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    //app.UseHsts();
}
app.UseCors(MyAllowSpecificOrigins);
//app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseOrchardCore();
//app.UseRouting();

//app.UseAuthorization();

//app.MapRazorPages();

app.Run();

