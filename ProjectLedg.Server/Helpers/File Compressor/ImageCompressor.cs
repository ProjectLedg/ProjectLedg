using System.Drawing;
using SkiaSharp;

namespace ProjectLedg.Server.Helpers.File_Compressor
{
    public static class ImageCompressor
    {
        public static string CompressImage(string inputFilePath, int maxWidth = 2000, int maxHeight = 2000, int quality = 75)
        {
            //Generating a compressed output file path
            string outputFilePath = Path.Combine(Path.GetTempPath(), $"{Path.GetRandomFileName()}.jpg");

            using var inputStream = new FileStream(inputFilePath, FileMode.Open, FileAccess.Read);
            using var bitmap = SKBitmap.Decode(inputStream);

            // Calculating new dimensions while preserving aspect ratio
            var ratio = Math.Min((float)maxWidth / bitmap.Width, (float)maxHeight / bitmap.Height);
            var newWidth = (int)(bitmap.Width * ratio);
            var newHeight = (int)(bitmap.Height * ratio);

            using var resizedBitmap = bitmap.Resize(new SKImageInfo(newWidth, newHeight), SKFilterQuality.Medium);
            using var image = SKImage.FromBitmap(resizedBitmap);
            using var outputStream = new FileStream(outputFilePath, FileMode.Create);

            //Compress and save as JPEG
            image.Encode(SKEncodedImageFormat.Jpeg, quality).SaveTo(outputStream);

            return outputFilePath;
        }
    }
}
