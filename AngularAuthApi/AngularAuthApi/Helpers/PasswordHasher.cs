using System.Security.Cryptography;

namespace AngularAuthApi.Helpers
{
    public class PasswordHasher
    {
        private readonly static RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
        private readonly static int saltSize = 16;
        private readonly static int hashSize = 20;
        private readonly static int Iteration = 10000;

        public static string HashPassword(string password)
        {
            byte[] salt;
            rng.GetBytes(salt = new byte[saltSize]);
            var key = new Rfc2898DeriveBytes(password, salt, Iteration);
            var hash = key.GetBytes(Iteration);
            var hashBytes = new byte[hashSize + saltSize];
            Array.Copy(salt, 0, hashBytes, 0, saltSize);
            Array.Copy(hash, 0, hashBytes, saltSize, hashSize);
            var base64Hash = Convert.ToBase64String(hashBytes);

            return base64Hash;
        }

        public static bool VerifyPassword(string password, string base64Hash)
        {
            var hashBytes = Convert.FromBase64String(base64Hash);
            var salt = new byte[saltSize];
            Array.Copy(hashBytes, 0, salt, 0, saltSize);
            var key = new Rfc2898DeriveBytes(password, salt, Iteration);
            byte[] hash = key.GetBytes(hashSize);
            for (var i = 0; i < hashSize; i++)
            {
                if (hashBytes[i + saltSize] != hash[i])
                    return false;
            }
            return true;
        }
    }
}

