using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Content.Data;
using Content.Data.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Content.GraphQL.Services
{
    public interface IUserService
    {
        Task<User> GetUserByEmail(string email);
        Task<User> AddUserAsync(User user);
    }

    public class UserService : IUserService
    {
        private readonly DataContext dataContext;

        public UserService(DataContext dataContext)
        {
            this.dataContext = dataContext;
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
    }
}