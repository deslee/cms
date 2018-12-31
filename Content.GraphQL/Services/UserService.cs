using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Content.Data;
using Content.Data.Models;
using Content.GraphQL.Constants;
using Content.GraphQL.Models;
using Content.GraphQL.Models.Input;
using Content.GraphQL.Models.Result;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Content.GraphQL.Services
{
    public interface IUserService
    {
        Task<User> GetUserById(string id);
        Task<User> GetUserByEmail(string email);
        Task<User> AddUserAsync(User user);
        Task<LoginResult> Login(LoginInput loginInput);
        Task<MutationResult<User>> UpdateUser(UserInput userInput);
        Task<MutationResult<User>> RegisterUser(RegisterInput registerInput);
        Task<string> CreateJwtToken(User source, UserContext userContext);
        Task<IEnumerable<Claim>> GetClaimsForUser(User user);
        Task<MutationResult> AddUserToSite(string userId, string userEmail, string siteId);
    }

    public class UserService : IUserService
    {
        private readonly DataContext dataContext;
        private readonly AppSettings appSettings;
        private readonly ILogger<UserService> logger;

        public UserService(DataContext dataContext, AppSettings appSettings, ILogger<UserService> logger)
        {
            this.dataContext = dataContext;
            this.appSettings = appSettings;
            this.logger = logger;
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

        public async Task<User> GetUserById(string id)
        {
            return await dataContext.Users.FindAsync(id);
        }

        public async Task<LoginResult> Login(LoginInput loginInput)
        {
            var user = await GetUserByEmail(loginInput.Email.ToLower());

            if (user == null)
            {
                return new LoginResult
                {
                    ErrorMessage = "Invalid login"
                };
            }

            var validPassword = await ValidatePassword(loginInput.Password, user.Password, user.Salt);

            var token = await CreateJwtToken(user, new UserContext(new[] { new Claim(Constants.ClaimTypes.DatabaseId, user.Id) }));

            if (validPassword)
            {
                return new LoginResult
                {
                    Data = user,
                    Token = token
                };
            }
            else
            {
                return new LoginResult
                {
                    ErrorMessage = "Invalid login"
                };
            }
        }

        public async Task<MutationResult<User>> RegisterUser(RegisterInput registerInput)
        {
            JObject data;
            try
            {
                data = JsonConvert.DeserializeObject<JObject>(registerInput.Data);
            }
            catch (JsonReaderException ex)
            {
                logger.LogError(ex, "Json parsing exception");
                return new MutationResult<User>
                {
                    ErrorMessage = "Invalid data json"
                };
            }

            registerInput.Email = registerInput.Email.Trim().ToLower();

            var existsAlready = await dataContext.Users.AnyAsync(u => u.Email == registerInput.Email);
            if (existsAlready)
            {
                return new MutationResult<User>
                {
                    ErrorMessage = "User already exists"
                };
            }

            // generate a 128-bit salt using a secure PRNG
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }
            registerInput.Password = await GetHash(registerInput.Password, salt);

            var user = new User
            {
                Email = registerInput.Email.ToLower(),
                Password = registerInput.Password,
                Data = data
            };

            user.Salt = Convert.ToBase64String(salt);

            var addedUser = await AddUserAsync(user);
            return new MutationResult<User>
            {
                Data = addedUser
            };
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

        public async Task<string> CreateJwtToken(User user, UserContext userContext)
        {
            // validate
            var validated = user.Id == userContext.Id;
            if (!validated)
            {
                return null;
            }

            var token = await Task.Run(() =>
                    {
                        var tokenHandler = new JwtSecurityTokenHandler();
                        var key = Encoding.ASCII.GetBytes(appSettings.Secret);
                        var tokenDescriptor = new SecurityTokenDescriptor
                        {
                            Subject = new ClaimsIdentity(new[] {
                                new Claim(Constants.ClaimTypes.Email, user.Email.ToString()),
                                new Claim(Constants.ClaimTypes.DatabaseId, user.Id)
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
            if (user.Email == "desmondclee@gmail.com")
            {
                claims.Add(new Claim(Constants.ClaimTypes.Role, Roles.Admin));
            }
            return Task.FromResult(claims.AsEnumerable());
        }

        public async Task<MutationResult> AddUserToSite(string userId, string userEmail, string siteId)
        {
            if (string.IsNullOrWhiteSpace(userId) && string.IsNullOrWhiteSpace(userEmail))
            {
                return new MutationResult { ErrorMessage = "Both userId and userEmail cannot be null" };
            }

            if (string.IsNullOrWhiteSpace(siteId))
            {
                return new MutationResult { ErrorMessage = "siteId cannot be null" };
            }

            var site = await dataContext.Sites.FirstOrDefaultAsync(s => s.Id == siteId);
            if (site == null)
            {
                return new MutationResult { ErrorMessage = $"Site {siteId} does not exist" };
            }

            var siteUser = new SiteUser
            {
                Site = site,
                SiteId = siteId
            };

            if (userId != null)
            {
                siteUser.UserId = userId;
            }
            else
            {
                var user = await dataContext.Users.FirstOrDefaultAsync(u => u.Email == userEmail.ToLower());
                siteUser.UserId = user.Id;
            }

            if (await dataContext.SiteUsers.AnyAsync(su => su.SiteId == siteUser.SiteId && su.UserId == siteUser.UserId))
            {
                return new MutationResult { ErrorMessage = $"User is already added to site" };
            }
            dataContext.SiteUsers.Update(siteUser);

            await dataContext.SaveChangesAsync();
            return new MutationResult();
        }

        public async Task<MutationResult<User>> UpdateUser(UserInput userInput)
        {
            JObject data;
            try
            {
                data = JsonConvert.DeserializeObject<JObject>(userInput.Data);
            }
            catch (JsonReaderException ex)
            {
                logger.LogError(ex, "Json parsing exception");
                return new MutationResult<User>
                {
                    ErrorMessage = "Invalid data json"
                };
            }

            var user = await dataContext.Users.FirstOrDefaultAsync(u => u.Id == userInput.Id);
            if (user == null)
            {
                return new MutationResult<User> { ErrorMessage = $"User {userInput.Id} not found." };
            }

            user.Email = userInput.Email.ToLower();
            user.Data = data;

            await dataContext.SaveChangesAsync();
            return new MutationResult<User>
            {
                Data = user
            };
        }
    }
}