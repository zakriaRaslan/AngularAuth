using AngularAuthApi.Data;
using AngularAuthApi.Helpers;
using AngularAuthApi.Models;
using AngularAuthApi.Models.Dto;
using AngularAuthApi.Utility_Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using EmailModel = AngularAuthApi.Models.EmailModel;

namespace AngularAuthApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;
        public UsersController(AppDbContext context, IConfiguration config, IEmailService emailService)
        {
            _context = context;
            _config = config;
            _emailService = emailService;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User model)
        {
            if (model == null) { return BadRequest(error: "User Is Null"); }

            var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == model.UserName);
            if (user == null)
            {
                return NotFound(new
                {
                    message = "User Not Found"
                });
            }
            if (!PasswordHasher.VerifyPassword(model.Password, user.Password))
            {
                return BadRequest(new
                {
                    message = "Incorrect Password"
                });
            }
            user.Token = CreateJwtToken(user);
            var newAccessToken = user.Token;
            var newRefreshToken = CreateRefreshToken();
            user.RefreshToken = newRefreshToken;
            user.Token = newAccessToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(5);
            _context.Update(user);
            await _context.SaveChangesAsync();
            return Ok(new TokenApiDto()
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                Message = "Login Successfully"
            });

        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest(new
                {
                    message = "User Is Null"
                });
            }

            var passwordTest = CheckPassword(user.Password);

            if (!string.IsNullOrEmpty(passwordTest))
            {
                return BadRequest(new { message = passwordTest });
            }

            user.Password = PasswordHasher.HashPassword(user.Password);

            if (await UserNameIsExist(user.UserName))
            {
                return BadRequest(new { message = "UserName Is Alerady Exist" });
            }
            if (await EmailNameIsExist(user.Email))
            {
                return BadRequest(new { message = "Email Is Already Exist" });
            }

            user.Role = "User";
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                message = "Registered Successfuly"
            });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(TokenApiDto tokenapiDto)
        {
            if (tokenapiDto == null)
            {
                return BadRequest("Invalid Client Request");
            }
            string accesstoken = tokenapiDto.AccessToken;
            string refreshToken = tokenapiDto.RefreshToken;
            var principal = GetPrincipalFromExpiredToken(accesstoken);
            var userName = principal.Identity.Name;
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == userName);
            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            {
                return BadRequest("Invalid Request");
            }
            var newAccessToken = CreateJwtToken(user);
            var newRefreshToken = CreateRefreshToken();
            user.RefreshToken = newRefreshToken;
            // user.Token = newAccessToken;
            await _context.SaveChangesAsync();
            return Ok(new TokenApiDto()
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            });
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var result = await _context.Users.ToListAsync();
            return Ok(result);
        }

        [HttpPost("send-reset-email/{email}")]
        public async Task<IActionResult> SendEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
            if (user == null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "Email Does'nt Exist"
                });
            }
            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var emailToken = Convert.ToBase64String(tokenBytes);
            user.ResetPasswordToken = emailToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddMinutes(15);
            string from = _config["EmailSettings:From"];
            var emailModel = new EmailModel(email, "Reset Password!", EmailBody.EmailStringBody(email, emailToken));
            _emailService.SendEmail(emailModel);
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(new
            {
                statusCode = 200,
                Message = "Email Sent"
            });
        }
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPassword)
        {
            var newToken = resetPassword.EmailToken.Replace(" ", "+");
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == resetPassword.Email);
            if (user == null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "Email Does'nt Exist"
                });
            }
            var tokenCode = user.ResetPasswordToken;
            DateTime EmailTokenExpiry = user.RefreshTokenExpiryTime;
            if (tokenCode != resetPassword.EmailToken || EmailTokenExpiry < DateTime.Now)
            {
                return BadRequest(new
                {
                    statusCode = 400,
                    Message = "Invalid Reset Link"
                });
            }
            user.Password = PasswordHasher.HashPassword(resetPassword.NewPassword);
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(new
            {
                statusCode = 200,
                Message = "Password Reset Successfuly"
            });
        }
        private async Task<bool> UserNameIsExist(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username);
        }
        private async Task<bool> EmailNameIsExist(string Email)
        {
            return await _context.Users.AnyAsync(x => x.Email == Email);
        }
        private string CheckPassword(string password)
        {
            StringBuilder sb = new StringBuilder();


            if (password.Length < 8) { sb.Append("Password Should Be At Least 8 Character" + Environment.NewLine); }
            if (!(Regex.IsMatch(password, "[a-z]") && (Regex.IsMatch(password, "[A-Z]") && (Regex.IsMatch(password, "[1-9]")))))
            {
                sb.Append("Password Should Be Include A Small & Capital Char & Numbers " + Environment.NewLine);
            }
            if (Regex.IsMatch(password, "\"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$\""))
            {
                sb.Append("Password Should Contain A Special Char");
            }

            return sb.ToString();
        }

        private string CreateJwtToken(User user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("veryverySercrit.....");
            var identity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.Name,$"{user.UserName}"),
            });

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.UtcNow.AddSeconds(20),
                SigningCredentials = credentials,
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }

        private string CreateRefreshToken()
        {
            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var refreshToken = Convert.ToBase64String(tokenBytes);
            var tokenInUser = _context.Users.Any(x => x.RefreshToken == refreshToken);
            if (tokenInUser)
            {
                return CreateRefreshToken();
            }
            return refreshToken;
        }

        private ClaimsPrincipal GetPrincipalFromExpiredToken(string expiredToken)
        {
            var key = Encoding.UTF8.GetBytes("veryverySercrit.....");
            var tokenValidationParameters = new TokenValidationParameters()
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuerSigningKey = true,
                ValidateLifetime = false,
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;
            var principal = tokenHandler.ValidateToken(expiredToken, tokenValidationParameters, out securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("This Token Is Invalid");
            }
            return principal;
        }
    }
}
