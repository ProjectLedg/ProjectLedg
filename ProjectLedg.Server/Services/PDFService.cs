using DinkToPdf.Contracts;
using DinkToPdf;
using ProjectLedg.Server.Services.IServices;
using System.Text;
using ProjectLedg.Server.Data.Models.DTOs.PDF;

namespace ProjectLedg.Server.Services
{
    public class PDFService : IPDFService
    {
        private readonly IConverter _converter;
        public PDFService(IConverter converter)
        {
            _converter = converter;
        }

        public byte[] GenerateAnnualReportPdf()
        {
            var sb = new StringBuilder();

            // Page 1: Title and Certification (vertically centered)
            sb.Append("<div style='text-align: center; margin-top: 25%; font-family: serif, sans-serif; line-height: 1.6;'>");
            sb.Append("<h1 style='font-size: 2rem; margin: 10px 0;'>Årsredovisning</h1>");
            sb.Append("<h4 style='font-weight: 800; margin: 10px 0;'>för</h4>");
            sb.Append("<h1 style='font-size: 1.6rem; margin: 10px 0;'>Samuel Hesser AB</h1>");
            sb.Append("<h3 style='font-weight: 600; margin: 10px 0;'>Org.nr 559321-2961</h3>");
            sb.Append("<h3 style='padding-top: 3rem; font-weight: 600;'>Räkenskapsåret</h3>");
            sb.Append("<h3>2022</h3>");

            // Certification section
            sb.Append("<h3 style='margin-top: 150px; text-align: left;'>Fastställelseintyg</h3>");
            sb.Append("<p style='text-align: justify;'>Jag intygar att resultaträkningen och balansräkningen har fastställts på årsstämma 2023-06-30.</p>");
            sb.Append("<p style='text-align: justify;'>Årsstämman beslöt att godkänna styrelsens förslag till vinstdisposition.</p>");
            sb.Append("<p style='text-align: justify;'>Jag intygar att innehållet i dessa elektroniska handlingar överensstämmer med originalen och att originalen undertecknats av samtliga personer som enligt lag ska underteckna dessa.</p>");

            // Signature section
            sb.Append("<p style='text-align: left; font-weight: 600;'>Elektroniskt underskriven av:</p>");
            sb.Append("<p style='text-align: left;'>Samuel Hesser, Styrelseledamot<br/>2023-07-26</p>");
            sb.Append("</div>");


            // PAGE 2: Management Report
            sb.Append("<div style='page-break-before: always; font-family: serif, sans-serif; line-height: 1.2; padding: 70px;'>");

            // Opening paragraph
            sb.Append("<p style='margin: 2px 0; font-size: 1rem;'>Styrelsen för Samuel Hesser AB avger följande årsredovisning för räkenskapsåret 2022.</p>");
            sb.Append("<p style='margin: 2px 0; font-size: 1rem;'>Årsredovisningen är upprättad i svenska kronor, SEK. Om inte annat särskilt anges, redovisas alla belopp i hela kronor (kr). Uppgifter inom parentes avser föregående år.</p>");

            // Section: Management Report
            sb.Append("<h2 style='margin: 10px 0; font-size: 1.2rem; padding-left: 9pt;'>Förvaltningsberättelse</h2>");

            // Subsection: Operations
            sb.Append("<h4 style='margin: 10px 0; padding-left: 9pt;'>Verksamheten</h4>");
            sb.Append("<p style='margin: 2px 0; font-size: 1rem; padding-left: 9pt; line-height: 1;'>Allmänt om verksamheten</p>");
            sb.Append("<p style='margin: 2px 0; font-size: 1rem; padding-left: 9pt;'>Bolagets verksamhet innefattar träningsverksamhet. Företaget har sitt säte i Orust.</p>");

            // Subsection: Key Events
            sb.Append("<p style='margin: 2px 0; font-size: 1rem; padding-left: 9pt; line-height: 1;'>Väsentliga händelser under räkenskapsåret</p>");
            sb.Append("<p style='margin: 2px 0; font-size: 1rem; padding-left: 9pt;'>Inget extraordinärt har inträffat under räkenskapsåret.</p>");

            // Financial Summary Table
            sb.Append("<table style='margin: 20px auto; width: 100%; max-width: 1200px; background-color: #f9f9f9; border-collapse: collapse;'>");
            sb.Append("<tr><th style='padding: 4px; text-align: left; font-size: 1rem; border: none'>Flerårsöversikt (Tkr)</th><th style='padding: 4px; text-align: left; border: none'>2022</th><th style='padding: 4px; text-align: left; border: none'>2021 (7 mån)</th></tr>");
            sb.Append("<tr><td style='padding: 4px; text-align: left; border: none'>Nettoomsättning:</td><td style='padding: 4px; text-align: left; border: none'>141</td><td style='padding: 4px; text-align: left; border: none'>137</td></tr>");
            sb.Append("<tr><td style='padding: 4px; text-align: left; border: none'>Resultat efter finansiella poster:</td><td style='padding: 4px; text-align: left; border: none'>7</td><td style='padding: 4px; text-align: left; border: none'>-4</td></tr>");
            sb.Append("<tr><td style='padding: 4px; text-align: left; border: none;'>Soliditet (%):</td><td style='padding: 4px; text-align: left; border: none'>26,5</td><td style='padding: 4px; text-align: left; border: none'>87,5</td></tr>");
            sb.Append("</table>");

            // Section: Changes in Equity
            sb.Append("<h3 style='margin: 10px 0; padding-left: 9pt;'>Förändringar i eget kapital</h3>");
            sb.Append("<table style='margin: 20px auto; width: 100%; max-width: 1200px; background-color: #f9f9f9; border-collapse: collapse;'>");
            sb.Append("<tr><td style='padding: 4px; text-align: left; border: none;'>Belopp vid årets ingång</td><th style='padding: 4px; text-align: left; border: none'>Aktiekapital</th><th style='padding: 4px; text-align: left; border: none'>Balanserat resultat</th><th style='padding: 4px; text-align: left; border: none'>Årets resultat</th><th style='padding: 4px; text-align: left; border: none'>Totalt</th></tr>");
            sb.Append("<tr><td style='padding: 4px; text-align: left; border: none;'>Disposition enligt beslut av årsstämman:</td><td style='padding: 4px; text-align: left; border: none'>25 000</td><td style='padding: 4px; text-align: left; border: none'>0</td><td style='padding: 4px; text-align: left; border: none'>-4 466</td><td style='padding: 4px; text-align: left; border: none'>20 534</td></tr>");
            sb.Append("<tr><td style='padding: 4px; text-align: left; border: none;'>Balanseras i ny räkning</td><td style='padding: 4px; text-align: left; border: none'></td><td style='padding: 4px; text-align: left; border: none'>-4 466</td><td style='padding: 4px; text-align: left; border: none'>4 466</td><td style='padding: 4px; text-align: left; border: none'>0</td></tr>");
            sb.Append("<tr><td style='padding: 4px; text-align: left; border: none;'>Årets resultat</td><td style='padding: 4px; text-align: left; border: none'></td><td style='padding: 4px; text-align: left; border: none'></td><td style='padding: 4px; text-align: left; border: none'>6 531</td><td style='padding: 4px; text-align: left; border: none'>6 531</td></tr>");
            sb.Append("<tr><th style='padding: 4px; text-align: left; border: none;'>Belopp vid årets utgång</th><td style='padding: 4px; text-align: left; border: none'>25 000</td><td style='padding: 4px; text-align: left; border: none'>-4 466</td><td style='padding: 4px; text-align: left; border: none'>6 531</td><td style='padding: 4px; text-align: left; border: none'>27 065</td></tr>");
            sb.Append("</table>");

            // Section: Profit Distribution
            sb.Append("<h2 style='margin: 10px 0; padding-left: 9pt;'>Resultatdisposition</h2>");
            sb.Append("<p style='margin: 2px 0; font-size: 1rem; padding-left: 9pt;'>Styrelsen föreslår att till förfogande stående vinstmedel (kronor):</p>");
            sb.Append("<table style='margin: 20px auto; width: 100%; max-width: 1200px; background-color: #f9f9f9; border-collapse: collapse;'>");
            sb.Append("<tr><td style='padding: 4px; text-align: left; border: none;'>Ansamlad förlust</td><td style='padding: 4px; text-align: left; border: none'>-4 466</td></tr>");
            sb.Append("<tr><td style='padding: 4px; text-align: left; border: none;'>Årets vinst</td><td style='padding: 4px; text-align: left; border: none'>6 531</td></tr>");
            sb.Append("<tr><td style='padding: 4px; text-align: left; border: none;'>I ny räkning överföres</td><td style='padding: 4px; text-align: left; border: none'>2 065</td></tr>");
            sb.Append("</table>");

            sb.Append("<p style='margin: 2px 0; font-size: 1rem; padding-left: 9pt;'>Företagets resultat och ställning i övrigt framgår av efterföljande resultat- och balansräkning med noter.</p>");
            sb.Append("</div>");



            // Page 3: Result Disposition
            sb.Append("<div style='page-break-before: always; font-family: serif, sans-serif; line-height: 1.2; padding: 70px;'>");

            // Section: Result Disposition
            sb.Append("<h2 style='margin: 10px 0; font-size: 1.2rem;'>Resultatdisposition</h2>");
            sb.Append("<p style='margin: 2px 0; font-size: 1rem;'>Styrelsen föreslår att till förfogande stående vinstmedel (kronor):</p>");

            // Result Table
            sb.Append("<table style='margin: 20px auto; width: 100%; max-width: 1200px; background-color: #f9f9f9; border-collapse: collapse;'>");
            sb.Append("<tr><td style='padding: 4px; text-align: left; border: none;'>Ansamlad förlust</td><td style='padding: 4px; text-align: left; border: none;'>-4 466</td></tr>");
            sb.Append("<tr><td style='padding: 4px; text-align: left; border: none;'>Årets vinst</td><td style='padding: 4px; text-align: left; border: none;'>6 531</td></tr>");
            sb.Append("<tr><td style='padding: 4px; text-align: left; border: none;'>I ny räkning överföres</td><td style='padding: 4px; text-align: left; border: none;'>2 065</td></tr>");
            sb.Append("</table>");

            // Closing Paragraph
            sb.Append("<p style='margin: 2px 0; font-size: 1rem;'>Företagets resultat och ställning i övrigt framgår av efterföljande resultat- och balansräkning med noter.</p>");
            sb.Append("</div>");


            // Page 4: Income Statement
            sb.Append("<div style='page-break-before: always; font-family: serif, sans-serif; line-height: 1.2; padding: 70px;'>");

            // Income Statement Table Header
            sb.Append("<table style='margin: 20px auto; width: 100%; max-width: 1200px; background-color: #f9f9f9; border-collapse: collapse;'>");
            sb.Append("<tr>");
            sb.Append("<td style='font-size: 1.4rem; font-weight:bold;'>Resultaträkning</td>");
            sb.Append("<th style='text-align: center;'>Not</th>");
            sb.Append("<th style='font-size: 0.9rem;'>2022-01-01 - 2022-12-31</th>");
            sb.Append("<th style='font-size: 0.9rem;'>2021-06-07 - 2021-12-31 (7 mån)</th>");
            sb.Append("</tr>");

            // Revenue Row
            sb.Append("<tr>");
            sb.Append("<td style='padding: 4px;'>Rörelseintäkter, lagerförändringar m.m.</td>");
            sb.Append("<td></td>");
            sb.Append("<td></td>");
            sb.Append("</tr>");

            // Net Revenue
            sb.Append("<tr>");
            sb.Append("<td style='padding: 4px;'>Nettoomsättning</td>");
            sb.Append("<td></td>");
            sb.Append("<td>140 538</td>");
            sb.Append("<td>136 883</td>");
            sb.Append("</tr>");

            // Total Revenue
            sb.Append("<tr>");
            sb.Append("<th style='padding: 4px;'>Summa Rörelseintäkter, lagerförändringar m.m.</th>");
            sb.Append("<td></td>");
            sb.Append("<th style='padding: 4px; text-align: left;'>140 538</th>");
            sb.Append("<th style='padding: 4px;'>136 883</th>");
            sb.Append("</tr>");
            sb.Append("</table>");

            // Expenses Table
            sb.Append("<table style='margin: 20px auto; width: 100%; max-width: 1200px; background-color: #f9f9f9; border-collapse: collapse;'>");
            sb.Append("<tr>");
            sb.Append("<th style='padding: 4px;'>Rörelsekostnader</th>");
            sb.Append("<th></th>");
            sb.Append("<td></td>");
            sb.Append("<td></td>");
            sb.Append("</tr>");

            // External Costs
            sb.Append("<tr>");
            sb.Append("<td style='padding: 4px;'>Övriga externa kostnader</td>");
            sb.Append("<td></td>");
            sb.Append("<td>-54 520</td>");
            sb.Append("<td>-76 092</td>");
            sb.Append("</tr>");

            // Personnel Costs
            sb.Append("<tr>");
            sb.Append("<td style='padding: 4px;'>Personalkostnader</td>");
            sb.Append("<td></td>");
            sb.Append("<td>-78 991</td>");
            sb.Append("<td>-45 011</td>");
            sb.Append("</tr>");

            // Total Operating Costs
            sb.Append("<tr>");
            sb.Append("<th style='padding: 4px;'>Summa Rörelsekostnader</th>");
            sb.Append("<th></th>");
            sb.Append("<td></td>");
            sb.Append("<td></td>");
            sb.Append("</tr>");

            // Operating Result
            sb.Append("<tr>");
            sb.Append("<th style='padding: 4px;'>Rörelseresultat</th>");
            sb.Append("<td></td>");
            sb.Append("<td>7 027</td>");
            sb.Append("<td>15 780</td>");
            sb.Append("</tr>");
            sb.Append("</table>");

            // Financial Items Table
            sb.Append("<table style='margin: 20px auto; width: 100%; max-width: 1200px; background-color: #f9f9f9; border-collapse: collapse;'>");
            sb.Append("<tr>");
            sb.Append("<td style='font-size: 1.4rem; font-weight: bold; padding: 8px;'>Finansiella poster</td>");
            sb.Append("<th style='text-align: center;'>Not</th>");
            sb.Append("<th style='font-size: 0.9rem;'>2022-12-31</th>");
            sb.Append("<th style='font-size: 0.9rem;'>2021-12-31</th>");
            sb.Append("</tr>");

            // Financial Items Rows
            sb.Append("<tr>");
            sb.Append("<td style='padding: 4px;'>Resultat från övriga finansiella anläggningstillgångar</td>");
            sb.Append("<td></td>");
            sb.Append("<td>0</td>");
            sb.Append("<td>295</td>");
            sb.Append("</tr>");

            sb.Append("<tr>");
            sb.Append("<td style='padding: 4px;'>Övriga ränteintäkter och liknande resultatposter</td>");
            sb.Append("<td></td>");
            sb.Append("<td>39</td>");
            sb.Append("<td>0</td>");
            sb.Append("</tr>");

            sb.Append("<tr>");
            sb.Append("<td style='padding: 4px;'>Räntekostnader och liknande resultatposter</td>");
            sb.Append("<td></td>");
            sb.Append("<td>0</td>");
            sb.Append("<td>-20 541</td>");
            sb.Append("</tr>");

            // Total Financial Items
            sb.Append("<tr>");
            sb.Append("<th style='padding: 4px;'>Summa finansiella poster</th>");
            sb.Append("<td></td>");
            sb.Append("<th style='padding: 4px;'>39</th>");
            sb.Append("<th style='padding: 4px;'>-20 246</th>");
            sb.Append("</tr>");

            // Result After Financial Items
            sb.Append("<tr>");
            sb.Append("<th style='padding: 4px;'>Resultat efter finansiella poster</th>");
            sb.Append("<td></td>");
            sb.Append("<th style='padding: 4px;'>7 066</th>");
            sb.Append("<th style='padding: 4px;'>-4 466</th>");
            sb.Append("</tr>");
            sb.Append("</table>");

            // Taxes and Result
            sb.Append("<table style='margin: 20px auto; width: 100%; max-width: 1200px; background-color: #f9f9f9; border-collapse: collapse;'>");
            sb.Append("<tr>");
            sb.Append("<th style='padding: 4px;'>Resultat före Skatt</th>");
            sb.Append("<td></td>");
            sb.Append("<th style='padding: 4px;'>7 066</th>");
            sb.Append("<th style='padding: 4px;'>-4 466</th>");
            sb.Append("</tr>");

            sb.Append("<tr>");
            sb.Append("<th style='padding: 4px;'>Skatter</th>");
            sb.Append("<td></td>");
            sb.Append("<td>1</td>");
            sb.Append("<td>1</td>");
            sb.Append("</tr>");

            sb.Append("<tr>");
            sb.Append("<td style='padding: 4px;'>Skatter på årets resultat</td>");
            sb.Append("<td></td>");
            sb.Append("<td>2</td>");
            sb.Append("<td>2</td>");
            sb.Append("</tr>");

            // Net Result
            sb.Append("<tr>");
            sb.Append("<th style='padding: 4px;'>Årets resultat</th>");
            sb.Append("<td></td>");
            sb.Append("<th style='padding: 4px;'>6 531</th>");
            sb.Append("<th style='padding: 4px;'>-4 466</th>");
            sb.Append("</tr>");
            sb.Append("</table>");

            sb.Append("</div>");


            // Page 5: Balance Sheet (Assets)
            sb.Append("<div style='page-break-before: always; font-family: serif, sans-serif; line-height: 1.2; padding: 70px;'>");

            // Balance Sheet Header
            sb.Append("<table style='margin: 20px auto; width: 100%; max-width: 1200px; background-color: #f9f9f9; border-collapse: collapse;'>");
            sb.Append("<tr>");
            sb.Append("<td style='font-size: 1.4rem; font-weight: bold; padding: 8px;'>Balansräkning</td>");
            sb.Append("<th style='text-align: center !important; padding: 8px;'>Not</th>");
            sb.Append("<th style='font-size: 0.9rem; padding: 8px;'>2022-12-31</th>");
            sb.Append("<th style='font-size: 0.9rem; padding: 8px;'>2021-12-31</th>");
            sb.Append("</tr>");
            sb.Append("</table>");

            // Assets Section Header
            sb.Append("<table style='margin: 20px auto; width: 100%; max-width: 1200px; background-color: #f9f9f9; border-collapse: collapse;'>");
            sb.Append("<tr><th style='padding: 4px;'>TILLGÅNGAR</th><td></td><td></td><td></td></tr>");
            sb.Append("</table>");

            // Short-term Receivables
            sb.Append("<table style='margin: 20px auto; width: 100%; max-width: 1200px; background-color: #f9f9f9; border-collapse: collapse;'>");
            sb.Append("<tr><td style='padding: 4px;'>Kortfristiga fordringar</td><td></td><td>1 306</td><td>1 306</td></tr>");
            sb.Append("<tr><td style='padding: 4px;'>Övriga kortfristiga placeringar</td><td></td><td>19 745</td><td>19 745</td></tr>");
            sb.Append("<tr><td style='padding: 4px;'>Kassa och bank</td><td></td><td>81 034</td><td>2 422</td></tr>");

            // Totals for Receivables, Placements, and Cash
            sb.Append("<tr><th style='padding: 4px;'>Summa kortfristiga fordringar</th><td></td><th style='padding: 4px;'>1 306</th><th style='padding: 4px;'>1 306</th></tr>");
            sb.Append("<tr><th style='padding: 4px;'>Summa kortfristiga placeringar</th><td></td><th style='padding: 4px;'>19 745</th><th style='padding: 4px;'>19 745</th></tr>");
            sb.Append("<tr><th style='padding: 4px;'>Summa kassa och bank</th><td></td><th style='padding: 4px;'>81 034</th><th style='padding: 4px;'>2 422</th></tr>");
            sb.Append("<tr><th style='padding: 4px;'>Summa omsättningstillgångar</th><td></td><th style='padding: 4px;'>102 085</th><th style='padding: 4px;'>23 473</th></tr>");
            sb.Append("</table>");

            // Total Assets
            sb.Append("<table style='margin: 20px auto; width: 100%; max-width: 1200px; background-color: #f9f9f9; border-collapse: collapse;'>");
            sb.Append("<tr><th style='padding: 4px;'>SUMMA TILLGÅNGAR</th><td></td><th style='padding: 4px;'>102 085</th><th style='padding: 4px;'>23 473</th></tr>");
            sb.Append("</table>");

            sb.Append("</div>");



            // Page 6: Balance Sheet (Liabilities and Equity)
            sb.Append("<div style='page-break-before: always; font-family: serif, sans-serif; line-height: 1.2; padding: 70px;'>");

            // Balance Sheet Header
            sb.Append("<table style='margin: 20px auto; width: 100%; max-width: 1200px; background-color: #f9f9f9; border-collapse: collapse;'>");
            sb.Append("<tr>");
            sb.Append("<td style='font-size: 1.4rem; font-weight: bold; padding: 8px;'>Balansräkning</td>");
            sb.Append("<th style='text-align: center !important; padding: 8px;'>Not</th>");
            sb.Append("<th style='font-size: 0.9rem; padding: 8px;'>2022-12-31</th>");
            sb.Append("<th style='font-size: 0.9rem; padding: 8px;'>2021-12-31</th>");
            sb.Append("</tr>");
            sb.Append("</table>");

            // Assets Section
            sb.Append("<table style='margin: 20px auto; width: 100%; max-width: 1200px; background-color: #f9f9f9; border-collapse: collapse;'>");
            sb.Append("<tr><th style='padding: 4px;'>TILLGÅNGAR</th><td></td><td></td><td></td></tr>");
            sb.Append("<tr><td style='padding: 4px;'>Kortfristiga fordringar</td><td></td><td>1 306</td><td>1 306</td></tr>");
            sb.Append("<tr><td style='padding: 4px;'>Kortfristiga placeringar</td><td></td><td>19 745</td><td>19 745</td></tr>");
            sb.Append("<tr><td style='padding: 4px;'>Kassa och bank</td><td></td><td>81 034</td><td>2 422</td></tr>");
            sb.Append("<tr><th style='padding: 4px;'>Summa omsättningstillgångar</th><td></td><th style='padding: 4px;'>102 085</th><th style='padding: 4px;'>23 473</th></tr>");
            sb.Append("</table>");

            // Total Assets
            sb.Append("<table style='margin: 20px auto; width: 100%; max-width: 1200px; background-color: #f9f9f9; border-collapse: collapse;'>");
            sb.Append("<tr><th style='padding: 4px;'>SUMMA TILLGÅNGAR</th><td></td><th style='padding: 4px;'>102 085</th><th style='padding: 4px;'>23 473</th></tr>");
            sb.Append("</table>");

            // Liabilities and Equity Section
            sb.Append("<table style='margin: 20px auto; width: 100%; max-width: 1200px; background-color: #f9f9f9; border-collapse: collapse;'>");
            sb.Append("<tr><th style='padding: 4px;'>EGET KAPITAL OCH SKULDER</th><td></td><td></td><td></td></tr>");
            sb.Append("<tr><td style='padding: 4px;'>Aktiekapital</td><td></td><td>25 000</td><td>25 000</td></tr>");
            sb.Append("<tr><td style='padding: 4px;'>Balanserat resultat</td><td></td><td>-4 466</td><td>0</td></tr>");
            sb.Append("<tr><td style='padding: 4px;'>Årets resultat</td><td></td><td>6 531</td><td>-4 466</td></tr>");
            sb.Append("<tr><th style='padding: 4px;'>Summa eget kapital</th><td></td><th style='padding: 4px;'>27 065</th><th style='padding: 4px;'>20 534</th></tr>");
            sb.Append("</table>");

            // Short-term Liabilities and Total Liabilities & Equity
            sb.Append("<table style='margin: 20px auto; width: 100%; max-width: 1200px; background-color: #f9f9f9; border-collapse: collapse;'>");
            sb.Append("<tr><td style='padding: 4px;'>Summa kortfristiga skulder</td><td></td><td>75 020</td><td>2 939</td></tr>");
            sb.Append("<tr><th style='padding: 4px;'>SUMMA EGET KAPITAL OCH SKULDER</th><td></td><th style='padding: 4px;'>102 085</th><th style='padding: 4px;'>23 473</th></tr>");
            sb.Append("</table>");

            sb.Append("</div>");



            // Page 7: Notes
            sb.Append("<div style='page-break-before: always; font-family: serif, sans-serif; line-height: 1.2; padding: 70px;'>");

            // Section: Notes
            sb.Append("<h2 style='margin: 10px 0; font-size: 1.2rem; padding-left: 9pt;'>Noter</h2>");

            // Note 1: Accounting Principles
            sb.Append("<h4 style='margin: 10px 0; padding-left: 9pt;'>Not 1 Redovisningsprinciper</h4>");
            sb.Append("<p style='margin: 2px 0; font-size: 1rem; padding-left: 9pt;'>Årsredovisningen är upprättad i enlighet med årsredovisningslagen och Bokföringsnämndens allmänna råd (BFNAR 2016:10) om årsredovisning i mindre företag.</p>");

            // Note 2: Number of Employees
            sb.Append("<h4 style='margin: 10px 0; padding-left: 9pt;'>Not 2 Medelantalet anställda</h4>");
            sb.Append("<table style='margin: 20px auto; width: 100%; max-width: 1200px; background-color: #f9f9f9; border-collapse: collapse;'>");
            sb.Append("<tr><th></th><th></th><th style='padding: 4px;'>2022</th><th style='padding: 4px;'>2021-06-07 - 2021-12-31</th></tr>");
            sb.Append("<tr><td style='padding: 4px;'>Medelantalet anställda</td><td></td><td style='padding: 4px;'>1</td><td style='padding: 4px;'>1</td></tr>");
            sb.Append("</table>");

            // Closing Paragraph
            sb.Append("<p style='margin: 2px 0; font-size: 1rem; padding-left: 9pt;'>Resultat- och balansräkningen kommer att föreläggas på årsstämma för fastställelse.</p><br>");
            sb.Append("<p style='margin: 2px 0; font-size: 1rem; padding-left: 9pt;'>Orust 2023-06-30</p><br>");

            // Signature
            sb.Append("<p style='font-style: italic; margin: 2px 0; font-size: 1rem; padding-left: 9pt;'>Samuel Hesser</p>");
            sb.Append("<p style='margin: 2px 0; font-size: 1rem; padding-left: 9pt;'>Samuel Hesser</p>");

            sb.Append("</div>");



            // Page 8: Notes
            sb.Append("<div style='page-break-before: always; font-family: serif, sans-serif; line-height: 1.2; padding: 70px;'>");

            // Section Header
            sb.Append("<h2 style='margin: 10px 0; font-size: 1.2rem; padding-left: 9pt;'>Noter</h2>");

            // Note 1: Accounting Principles
            sb.Append("<h3 style='margin: 10px 0; padding-left: 9pt;'>Not 1: Redovisningsprinciper</h3>");
            sb.Append("<p style='margin: 2px 0; font-size: 1rem; padding-left: 9pt;'>Årsredovisningen är upprättad i enlighet med årsredovisningslagen och Bokföringsnämndens allmänna råd (BFNAR 2016:10) om årsredovisning i mindre företag.</p>");

            // Note 2: Number of Employees
            sb.Append("<h3 style='margin: 10px 0; padding-left: 9pt;'>Not 2: Medelantalet anställda</h3>");
            sb.Append("<p style='margin: 2px 0; font-size: 1rem; padding-left: 9pt;'>Antal anställda under året: 1</p>");

            sb.Append("</div>");

            var headerHtml = @"
    <div style='width: 100%; font-size: 12px; display: flex; justify-content: space-between;'>
        <div style='text-align: left;'>Samuel Hesser AB<br/>Org.nr: 559321-2961</div>
        <div style='text-align: right;'>Sida: [page]</div>
    </div>";

            // Save the header HTML as a temporary file
            string headerFilePath = Path.Combine(Path.GetTempPath(), "header.html");
            File.WriteAllText(headerFilePath, headerHtml);

            var doc = new HtmlToPdfDocument()
            {
                GlobalSettings = {
            ColorMode = ColorMode.Color,
            Orientation = Orientation.Portrait,
            PaperSize = PaperKind.A4,
            Margins = new MarginSettings { Top = 30, Bottom = 20 }
        },
                Objects = {
            new ObjectSettings() {
                PagesCount = true,
                HtmlContent = sb.ToString(),
                WebSettings = { DefaultEncoding = "utf-8" },
                HeaderSettings = {
                    HtmUrl = headerFilePath,
                    Spacing = 5
                }
            }
        }
            };

            return _converter.Convert(doc);
        }
    }
}
