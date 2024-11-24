using iTextSharp.text.pdf;
using System.IO;

namespace ProjectLedg.Server.Helpers.File_Compressor
{
    public class FileCompressor
    {
        public static string CompressPdfWithGhostscript(string inputFilePath)
        {
            // making sure that the output file has a .pdf extension
            string outputFilePath = Path.Combine(Path.GetTempPath(), $"{Path.GetRandomFileName()}.pdf");

            //path to Ghostscript executable
            var ghostscriptPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "GhostScript", "gswin64c.exe");

            // Ghostscript arguments from GhostSCript Documentation
            var args = $"-sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dBATCH -sOutputFile=\"{outputFilePath}\" \"{inputFilePath}\"";

            var processInfo = new System.Diagnostics.ProcessStartInfo
            {
                FileName = ghostscriptPath,
                Arguments = args,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true,
            };

            using var process = new System.Diagnostics.Process
            {
                StartInfo = processInfo
            };

            process.Start();
            process.WaitForExit();

            if (process.ExitCode != 0)
            {
                string error = process.StandardError.ReadToEnd();
                throw new Exception($"Ghostscript compression failed: {error}");
            }

            return outputFilePath;
        }
    }
}