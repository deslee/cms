using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Content.Data;
using Content.Data.Models;
using Content.GraphQL.Constants;
using Content.GraphQL.Models.Input;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Content.GraphQL.Services
{
    public interface IUserService
    {
        Task<User> GetUserByEmail(string email);
        Task<User> AddUserAsync(User user);
        Task<User> Login(LoginInput loginInput);
        Task<User> RegisterUser(RegisterInput registerInput);
        Task<string> CreateJwtToken(User source);
        Task<IEnumerable<Claim>> GetClaimsForUser(User user);
    }

    public class UserService : IUserService
    {
        private readonly DataContext dataContext;
        private readonly IMapper mapper;
        private readonly AppSettings appSettings;

        public UserService(DataContext dataContext, IMapper mapper, AppSettings appSettings)
        {
            this.dataContext = dataContext;
            this.mapper = mapper;
            this.appSettings = appSettings;
        }

        public async Task<User> AddUserAsync(User user)
        {
            dataContext.Add(user);
            await dataContext.SaveChangesAsync();
            return user;
        }

        public async Task<User> GetUserByEmail(string email)
        {
            return await dataContext.Users.FirstOrDefaultAsync(u => u.Email == email.ToLower());
        }

        public async Task<User> Login(LoginInput loginInput)
        {
            var user = await GetUserByEmail(loginInput.Email.ToLower());

            var validPassword = await ValidatePassword(loginInput.Password, user.Password, user.Salt);

            if (validPassword)
            {
                return user;
            }
            else
            {
                return null;
            }
        }

        public async Task<User> RegisterUser(RegisterInput registerInput)
        {
            registerInput.Email = registerInput.Email.Trim().ToLower();

            var existsAlready = await dataContext.Users.AnyAsync(u => u.Email == registerInput.Email);
            if (existsAlready) {
                throw new Exception("User already exists");
            }

            // generate a 128-bit salt using a secure PRNG
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }
            registerInput.Password = await GetHash(registerInput.Password, salt);

            var user = mapper.Map<User>(registerInput);
            user.Salt = Convert.ToBase64String(salt);

            return await AddUserAsync(user);
        }

        private async Task<bool> ValidatePassword(string password, string hashedPassword, string salt)
        {
            return hashedPassword == await GetHash(password, Convert.FromBase64String(salt));
        }

        private static Task<string> GetHash(string password, byte[] salt)
        {
            return Task.Run(() => Convert.ToBase64String(KeyDerivation.Pbkdf2(
                        password: password,
                        salt: salt,
                        prf: KeyDerivationPrf.HMACSHA1,
                        iterationCount: 10000,
                        numBytesRequested: 256 / 8
                    )));
        }

        public async Task<string> CreateJwtToken(User user)
        {
            var token = await Task.Run(() =>
                    {
                        var tokenHandler = new JwtSecurityTokenHandler();
                        var key = Encoding.ASCII.GetBytes(appSettings.Secret);
                        var tokenDescriptor = new SecurityTokenDescriptor
                        {
                            Subject = new ClaimsIdentity(new[] {
                            new Claim(ClaimTypes.Email, user.Email.ToString())
                        }),
                            Expires = DateTime.UtcNow.AddDays(7),
                            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                        };
                        var jwtToken = tokenHandler.CreateToken(tokenDescriptor);
                        return tokenHandler.WriteToken(jwtToken);
                    });
            return token;
        }

        public Task<IEnumerable<Claim>> GetClaimsForUser(User user)
        {
            var claims = new List<Claim>();
            if (user.Email == "desmondclee@gmail.com") {
                claims.Add(new Claim(ClaimTypes.Role, Roles.Admin));
            }
            return Task.FromResult(claims.AsEnumerable());
        }
    }
}