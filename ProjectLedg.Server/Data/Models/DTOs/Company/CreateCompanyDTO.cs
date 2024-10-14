namespace ProjectLedg.Server.Data.Models.DTOs.Company
{
    public class CreateCompanyDTO
    {
        public string CompanyName { get; set; }
        public string OrgNumber { get; set; }
        public int AmountOfEmployees { get; set; }
        
        public string CompanyDescription { get; set; }
    }
}
