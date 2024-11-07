using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.User;
using ProjectLedg.Server.Helpers.Hashing;
using QRCoder;

namespace ProjectLedg.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TwoFactorAuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public TwoFactorAuthController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // Enable 2FA for the current user
        [HttpPost("enable-2fa")]
        public async Task<IActionResult> EnableTwoFactorAuthentication([FromBody] TwoFactorAuthDTO code)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var isTwoFactorEnabled = await _userManager.GetTwoFactorEnabledAsync(user);
            if (isTwoFactorEnabled)
            {
                return BadRequest("Two-factor authentication is already enabled.");
            }

            if (string.IsNullOrEmpty(user.AuthenticatorKey))
            {
                // Generate a new authenticator key
                await _userManager.ResetAuthenticatorKeyAsync(user);
                var unformattedKey = await _userManager.GetAuthenticatorKeyAsync(user);

                // Hash the key using the helper class
                user.AuthenticatorKey = AuthenticatorHelper.HashAuthenticatorKey(unformattedKey);

                // Save the hashed key in the database
                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error storing authenticator key.");
                }
            }

            // Verify the 6-digit code entered by the user
            var isValidCode = await _userManager.VerifyTwoFactorTokenAsync(user, TokenOptions.DefaultAuthenticatorProvider, code.Code);

            if (!isValidCode)
            {
                return BadRequest("Invalid 2FA code.");
            }

            // Enable 2FA for this user
            await _userManager.SetTwoFactorEnabledAsync(user, true);

            return Ok(new { Message = "Two-factor authentication enabled successfully." });
        }

        // Generate QR code for 2FA setup
        [HttpGet("generate-qr-code")]
        public async Task<IActionResult> GenerateQrCode()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                Console.WriteLine("User not found.");
                return BadRequest("User not found");
            }

            var unformattedKey = await _userManager.GetAuthenticatorKeyAsync(user);
            if (string.IsNullOrEmpty(unformattedKey))
            {
                await _userManager.ResetAuthenticatorKeyAsync(user);
                unformattedKey = await _userManager.GetAuthenticatorKeyAsync(user);
            }

            var email = user.Email;
            var authenticatorUri = GenerateQrCodeUri(email, unformattedKey);

            using (var qrGenerator = new QRCodeGenerator())
            using (var qrCodeData = qrGenerator.CreateQrCode(authenticatorUri, QRCodeGenerator.ECCLevel.Q))
            using (var qrCode = new PngByteQRCode(qrCodeData))
            {
                var qrCodeBytes = qrCode.GetGraphic(20);
                return File(qrCodeBytes, "image/png");
            }
        }

        // Verify 2FA token
        [HttpPost("verify-2fa")]
        public async Task<IActionResult> VerifyTwoFactorCode([FromBody] TwoFactorAuthDTO code)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Get the stored hashed authenticator key
            var hashedKey = user.AuthenticatorKey;

            // Check the code using the hashed key
            var isValidCode = await _userManager.VerifyTwoFactorTokenAsync(user, TokenOptions.DefaultAuthenticatorProvider, code.Code);

            if (!isValidCode)
            {
                return BadRequest("Invalid 2FA code.");
            }

            // Enable 2FA for this user
            await _userManager.SetTwoFactorEnabledAsync(user, true);

            return Ok("2FA setup verified successfully.");
        }

        // Disable 2FA
        [HttpPost("disable-2fa")]
        public async Task<IActionResult> DisableTwoFactorAuthentication()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var disable2FaResult = await _userManager.SetTwoFactorEnabledAsync(user, false);
            if (!disable2FaResult.Succeeded)
            {
                return BadRequest("Failed to disable two-factor authentication.");
            }

            return Ok("Two-factor authentication has been disabled.");
        }

        private string GenerateQrCodeUri(string email, string unformattedKey)
        {
            return string.Format(
                "otpauth://totp/{0}?secret={1}&issuer=ProjectLedg&digits=6",
                email, unformattedKey);
        }
    }
}
