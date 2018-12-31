namespace Content.Data
{
    public interface IUserAccessor
    {
        string GetCurrentUser();
    }

    public class SystemUserAccessor : IUserAccessor
    {
        public string GetCurrentUser()
        {
            return "System";
        }
    }
}