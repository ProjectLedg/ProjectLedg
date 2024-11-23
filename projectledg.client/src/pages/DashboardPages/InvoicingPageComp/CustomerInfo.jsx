import React, { useState, useEffect } from "react";
import {axiosConfig} from '/axiosconfig';
import { AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useParams } from "react-router-dom";

export function CustomerInfo({ invoice, handleInputChange }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { companyId } = useParams();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axiosConfig.get(`/Customer/getall/${companyId}`);
        setCustomers(response.data);
        
      } catch (error) {
        setError("Lyckades inte hämta kunder");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [companyId]);

  const handleCustomerSelect = (customerId) => {
    const customer = customers.find(c => c.id === parseInt(customerId));
    if (!customer) {
      setError("Vald kund hittades inte");
      return;
    }
    
    setSelectedCustomer(customer);
    

    // Update invoice state with selected customer info
    handleInputChange({ target: { name: "customerName", value: customer.name } });
    handleInputChange({ target: { name: "customerAddress", value: customer.address } });
    handleInputChange({ target: { name: "customerOrgNumber", value: customer.organizationNumber } });
    handleInputChange({ target: { name: "customerTaxId", value: customer.taxId } });
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <CardTitle className="mb-2 sm:mb-0">Kundinformation</CardTitle>
        <div className="w-48 ">
          <Select onValueChange={handleCustomerSelect} disabled={loading} >
            <SelectTrigger>
              <SelectValue placeholder={loading ? "Laddar..." : "Välj kund"} />
            </SelectTrigger>
            <SelectContent className="dark:bg-darkBackground dark:border-darkBorder" >
              {customers.map((customer) => (
                <SelectItem  key={customer.id} value={customer.id.toString()}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Laddar kunder...</span>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Fel</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        

        <div className="space-y-2">
          <div>
            <Label htmlFor="customerName">Kundnamn</Label>
            <Input 
              id="customerName" 
              name="customerName"
              value={invoice.customerName}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="customerAddress">Kundadress</Label>
            <Textarea 
              id="customerAddress" 
              name="customerAddress"
              value={invoice.customerAddress}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="customerOrgNumber">Organisationsnummer</Label>
            <Input 
              id="customerOrgNumber" 
              name="customerOrgNumber"
              value={invoice.customerOrgNumber || ""}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="customerTaxId">Momsregistreringsnummer</Label>
            <Input 
              id="customerTaxId" 
              name="customerTaxId"
              value={invoice.customerTaxId || ""}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}