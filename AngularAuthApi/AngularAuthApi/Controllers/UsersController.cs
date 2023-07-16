using AngularAuthApi.Data;
using AngularAuthApi.Helpers;
using AngularAuthApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.RegularExpressions;

namespace AngularAuthApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User model)
        {
            if (model == null) { return BadRequest(error: "User Is Null"); }

            var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == model.UserName && x.Password == model.Password);
            if (user == null)
            {
                return NotFound(new
                {
                    Message = "User Not Found"
                });
            }
            if (!PasswordHasher.VerifyPassword(model.Password, user.Password))
            {
                return BadRequest(new
                {
                    Message = "Incorrect Password"
                });
            }
            return Ok(new
            {
                Message = "Login Successfuly"
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User model)
        {
            if (model == null)
            {
                return BadRequest(new
                {
                    Message = "User Is Null"
                });
            }

            var sb = CheckPassword(model.Password);
            if (!string.IsNullOrEmpty(sb))
            {
                return BadRequest(new { Message = sb });
            }

            model.Password = PasswordHasher.HashPassword(model.Password);
            if (await UserNameIsExist(model.UserName))
            {
                return BadRequest(new { Message = "UserName Is Alerady Exist" });
            }
            if (await EmailNameIsExist(model.Email))
            {
                return BadRequest(new { Message = "Email Is Already Exist" });
            }


            await _context.Users.AddAsync(model);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                Message = "Registered Successfuly"
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
                sb.Append("Password Should Be Alphanumeric" + Environment.NewLine);
            }
            if (Regex.IsMatch(password, "[<,>,@,!,#,$,%,^,&,*,(,),_,+,\\[,\\],{,},?,:,;,|,\\,.,~,',`,-,=]"))
            {
                sb.Append("Password Should Contain A Special Char");
            }

            return sb.ToString();
        }
    }
}
