namespace AngularAuthApi.Models.Dto
{
    public class TokenApiDto
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public string? Message { get; set; }
    }
}
