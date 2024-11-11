import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { axiosConfig } from '/axiosconfig';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from '@/components/ui/toast';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TooltipProvider, TooltipShad, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

export function AnnualReportPreview() {
  const { companyId } = useParams();
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastState, setToastState] = useState({ isLoading: false, pdfLink: null });
  const [additionalInfo, setAdditionalInfo] = useState({
    signature: '',
    signatureRole: '',
    profitPercentageToKeep: 0,
    
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportDataResponse = await axiosConfig.get(`/AnnualReport/Reportcontent?companyId=${companyId}`);
        setReportData(reportDataResponse.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [companyId]);

  const handleInputChange = (path, value) => {
    setReportData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      let current = newData;
      const keys = path.split('.');
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleAdditionalInfoChange = (field, value) => {
    setAdditionalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirmAndContinue = () => {
    setIsModalOpen(true);
  };

  
  
  
  
  const handleSubmit = async () => {
    setToastState({ isLoading: true, pdfLink: null }); // Show loading toast
    setIsModalOpen(false);
    try {
      const finalData = {
        ...reportData,
        anualReportRequest: {
          companyId: parseInt(companyId),
          signature: additionalInfo.signature,
          signatureRole: additionalInfo.signatureRole,
          profitPercentageToKeep: parseFloat(additionalInfo.profitPercentageToKeep)
        }
      };
      
      const response = await axiosConfig.post("/PDF/generate-annual-report", finalData, {
        responseType: 'blob' // Important: tells axios to expect binary data
      });
      
      // Create and set blob for the PDF data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setPdfBlob(blob);
      
      // Update the toast with the PDF download link
      setToastState({ isLoading: false, pdfLink: url });
  
      
      setIsModalOpen(false);
    } catch (error) {
      setPdfBlob(null);
      setError('Failed to submit annual report. Please try again.');
      setToastState({ isLoading: false, pdfLink: null }); // Hide toast on error
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!reportData) {
    return <div className="p-4">Loading...</div>;
  }

  const renderInputField = (path, value, label) => {
    const isNumeric = typeof value === 'number';
    return (
      <div key={path} className="space-y-2">
        <Label htmlFor={path} className="text-sm font-medium">
          {label || path.split('.').pop().replace(/([A-Z])/g, ' $1').trim()}
        </Label>
        <Input
          id={path}
          value={value}
          onChange={(e) => handleInputChange(path, isNumeric ? parseFloat(e.target.value) || 0 : e.target.value)}
          type={isNumeric ? "number" : "text"}
          step="any"
          className="w-full"
        />
      </div>
    );
  };

  const renderSection = (data, basePath = '') => {
    return Object.entries(data).map(([key, value]) => {
      const path = basePath ? `${basePath}.${key}` : key;
      if (typeof value === 'object' && value !== null) {
        return (
          <div key={path} className="space-y-4">
            <h3 className="text-lg font-semibold mt-4">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {renderSection(value, path)}
            </div>
          </div>
        );
      } else {
        return renderInputField(path, value);
      }
    });
  };

  return (
    <>
    <ToastProvider swipeDirection="right">
      <TabsContent value="annualReports">
        <Card className="rounded-none shadow-none border-none">
          <CardHeader>
            <CardTitle>Annual Report Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <Tabs defaultValue="company" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="company">Company</TabsTrigger>
                  <TabsTrigger value="resultDisposition">Result Disposition</TabsTrigger>
                  <TabsTrigger value="financials">Financials</TabsTrigger>
                  <TabsTrigger value="equityAndLiabilities">Equity & Liabilities</TabsTrigger>
                </TabsList>
                
                <TabsContent value="company">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {renderSection(reportData.company, 'company')}
                  </div>
                </TabsContent>
                
                <TabsContent value="resultDisposition">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {renderSection(reportData.resultDisposition, 'resultDisposition')}
                  </div>
                </TabsContent>
                
                <TabsContent value="financials">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Income Statement</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {renderSection(reportData.financials.incomeStatement, 'financials.incomeStatement')}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Balance Sheet</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {renderSection(reportData.financials.balanceSheet, 'financials.balanceSheet')}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="equityAndLiabilities">
                  <div className="space-y-6">
                    {renderSection(reportData.equityAndLiabilities, 'equityAndLiabilities')}
                  </div>
                </TabsContent>
              </Tabs>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button onClick={handleConfirmAndContinue} className="w-full">Confirm and Continue</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Additional Information</DialogTitle>
            <DialogDescription>
              Please provide the following information to complete your annual report submission.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="signatureRole" className="text-right">
                  Your role in the company
                </Label>
                <TooltipProvider>
                  <TooltipShad>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter your role in the company, e.g., CEO, CFO, etc., to correctly sign the financial statement</p>
                    </TooltipContent>
                  </TooltipShad>
                </TooltipProvider>
              </div>
              <Input
                id="signatureRole"
                value={additionalInfo.signatureRole}
                onChange={(e) => handleAdditionalInfoChange('signatureRole', e.target.value)}
                placeholder="Enter your role in the company"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="profitPercentageToKeep" className="text-right">
                  Percentage to transfer to next fiscal year (%)
                </Label>
                <TooltipProvider>
                  <TooltipShad>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter the percentage of profit you want to transfer to the next fiscal year</p>
                    </TooltipContent>
                  </TooltipShad>
                </TooltipProvider>
              </div>
              <Input
                id="profitPercentageToKeep"
                type="number"
                value={additionalInfo.profitPercentageToKeep}
                onChange={(e) => handleAdditionalInfoChange('profitPercentageToKeep', e.target.value)}
                placeholder="Enter percentage"
                min="0"
                max="100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signature" className="text-right">First Name</Label>
                <Input
                  id="signature"
                  value={additionalInfo.signature}
                  onChange={(e) => handleAdditionalInfoChange('signature', e.target.value)}
                  placeholder="Signatur namn"
                />
              </div>
              
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full">Sign and Submit</Button>
        </DialogContent>
      </Dialog>
      {/* Toast Notifications */}
            <Toast
        open={toastState.isLoading || toastState.pdfLink}
        onOpenChange={() => setToastState({ isLoading: false, pdfLink: null })}
        >
        <ToastTitle>Annual Report Submission</ToastTitle>
        <ToastDescription>
            {toastState.isLoading ? (
            <div className="flex items-center space-x-2">
                <span>Generating your report...</span>
                <div className="loader" /> {/* Replace with actual loader */}
            </div>
            ) : toastState.pdfLink ? (
            <a href={toastState.pdfLink} download="Annual_Report.pdf" className="text-blue-500 underline">
                Download PDF
            </a>
            ) : null}
        </ToastDescription>
        <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    </>
    
  );
}