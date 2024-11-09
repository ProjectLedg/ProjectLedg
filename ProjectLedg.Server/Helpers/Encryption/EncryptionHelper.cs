using System.Security.Cryptography;
using System.Text;

public class EncryptionHelper
{
    private readonly byte[] _aesKey;
    private readonly byte[] _aesIV;

    public EncryptionHelper(byte[] aesKey, byte[] aesIV)
    {
        _aesKey = aesKey;
        _aesIV = aesIV;
    }

    public string EncryptData(string data)
    {
        using var aes = Aes.Create();
        aes.Key = _aesKey;
        aes.IV = _aesIV;

        using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
        using var ms = new MemoryStream();
        using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
        using (var sw = new StreamWriter(cs))
        {
            sw.Write(data);
        }

        return Convert.ToBase64String(ms.ToArray());
    }

    public string DecryptData(string encryptedData)
    {
        var encryptedBytes = Convert.FromBase64String(encryptedData);

        using var aes = Aes.Create();
        aes.Key = _aesKey;
        aes.IV = _aesIV;

        using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
        using var ms = new MemoryStream(encryptedBytes);
        using var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
        using var sr = new StreamReader(cs);

        return sr.ReadToEnd();
    }
}