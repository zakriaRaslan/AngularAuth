using AngularAuthApi.Models;

namespace AngularAuthApi.Utility_Service
{
    public interface IEmailService
    {
        void SendEmail(EmailModel email);
    }
}
