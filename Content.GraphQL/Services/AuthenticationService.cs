using System;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using AutoMapper;
using Content.Data.Models;
using Content.GraphQL.Models.Input;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;

namespace Content.GraphQL.Services
{
    public interface IAuthenticationService
    {
        Task<User> GetUser(HttpContext httpContext);
        Task<User> Login(LoginInput loginInput);
        Task<User> RegisterUser(RegisterInput registerInput);
    }

    public class AuthenticationService : IAuthenticationService
    {
        private readonly IUserService userService;
        private readonly IMapper mapper;

        public AuthenticationService(IUserService userService, IMapper mapper)
        {
            this.userService = userService;
            this.mapper = mapper;
        }

        public async Task<User> GetUser(HttpContext httpContext)
        {
            var email = httpContext.User?.Claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (email != null)
            {
                return await userService.GetUserByEmail(email);
            }
            return null;
        }

        public async Task<User> Login(LoginInput loginInput)
        {
            var user = await userService.GetUserByEmail(loginInput.Email.ToLower());

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

            // generate a 128-bit salt using a secure PRNG
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }
            registerInput.Password = await GetHash(registerInput.Password, salt);

            var user = mapper.Map<User>(registerInput);
            user.Salt = Convert.ToBase64String(salt);

            return await userService.AddUserAsync(user);
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
    }
}