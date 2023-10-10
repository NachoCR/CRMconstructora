using BackendCRMconstructora.Contexts;
using BackendCRMconstructora.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BackendCRMconstructora.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {

        private readonly ConstructoraContext _context;
        private readonly IConfiguration _configuration;

        public LoginController (ConstructoraContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u =>
                    (u.Identification == model.Identifier || u.Email == model.Identifier) &&
                    u.Password == model.Password);

                if (user == null)
                {
                    return Unauthorized("Credenciales inválidas");
                }

                var roleName = await GetRoleName(user.RoleId);
                var identifierName = await GetIdentifierName(user.IdentifierId);

                var token = GenerateJwtToken(user, roleName, identifierName);

                var tokenData = new Token
                {
                    access_token = token,
                    token_type = "Bearer",
                    expires_in = 3600,
                    exp = DateTimeOffset.UtcNow.AddHours(1).ToUnixTimeSeconds(),
                    refresh_token = ""
                };
                var userData = new UserData
                {
                    Id = 1,
                    Name = "Administrador",
                    Email = "user1@example.com",
                    Avatar = "avatar.jpg",
                    Roles = new List<string> { "ADMIN" },
                    Permissions = new List<string> { "canAdd", "canDelete", "canEdit", "canRead" }
                };


                return Ok(new { tokenData = tokenData, userData = userData});
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        //public async Task<IActionResult> Login([FromBody] LoginRequest model)
        //{
        //    try
        //    {
        //        var user = await _context.User.FirstOrDefaultAsync(u =>
        //            (u.Identification == model.Identifier || u.Email == model.Identifier) &&
        //            u.Password == model.Password);

        //        if (user == null)
        //        {
        //            return Unauthorized("Credenciales inválidas");
        //        }

        //        var roleName = await GetRoleName(user.Role_ID);
        //        var identifierName = await GetIdentifierName(user.IdentifierID);

        //        var token = GenerateJwtToken(user, roleName, identifierName);

        //        return Ok(new { access_token = token, RoleName = roleName, IdentifierName = identifierName });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Error interno del servidor: {ex.Message}");
        //    }
        //}

        private async Task<string> GetRoleName(int roleId)
        {
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleId == roleId);
            return role != null ? role.RoleName : "";
        }

        private async Task<string> GetIdentifierName(int identifierId)
        {
            var identifier = await _context.Identifiers.FirstOrDefaultAsync(i => i.IdentifierId == identifierId);
            return identifier != null ? identifier.IdentifierName : "";
        }

        private string GenerateJwtToken(User user, string roleName, string identifierName)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("Role", roleName),
            new Claim("Identifier", identifierName),
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
