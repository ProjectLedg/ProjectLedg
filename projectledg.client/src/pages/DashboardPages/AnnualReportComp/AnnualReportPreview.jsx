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
import { HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

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
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { value: 'company', label: 'Företag' },
    { value: 'resultDisposition', label: 'Resultatdisposition' },
    { value: 'financials', label: 'Balansrapport & Resultaträkning' },
    { value: 'equityAndLiabilities', label: 'Eget kapital & Skulder' },
  ];

  const customTitles = {
    "company.name": "Företagsnamn",
    "company.address": "Företagsadress",
    "resultDisposition.profit": "Årets vinst",
    "financials.incomeStatement.revenue": "Intäkter",
    "financials.incomeStatement.expenses": "Kostnader",
    "financials.balanceSheet.assets": "Tillgångar",
    "financials.balanceSheet.liabilities": "Skulder",
    "company.organizationNumber" : "Organisationsnummer",
    "company.fiscalYear":"Finansiella året",
    "company.annualMeetingDate" : "Årsstämma Datum",
    "company.companyDescription": "Verksamhetsbeskrivning",
    "company.amountOfEmployees" : "Antal anställda",
    "financials.incomeStatement.netRevenue" : "Nettointäkter",
    "financials.incomeStatement.externalExpenses": " Externa kostnader",
    "financials.incomeStatement.staffExpenses" : "Personal kostnader",
    "financials.incomeStatement.financialItems" : "Finansiella poster",
    "financials.incomeStatement.resultAfterFinancialItems" : "Resultat efter Finansiella poster",
    "financials.incomeStatement.taxOnResult" : "Skatt på årets resultat",
    "financials.incomeStatement.annualResult" : "Årets resultat",
    "financials.balanceSheet.intangibleAssets" : "Immateriella tillgångar",
    "financials.balanceSheet.tangibeAssets" : "Materiella tillgångar",
    "financials.balanceSheet.financialAssets" : "Finansiella tillgångar",
    "financials.balanceSheet.totalFixedAssets": "Summa anläggningstillgånar",
    "equityAndLiabilities.equity.stockCapital": "Aktiekapital",
    "equityAndLiabilities.equity.balancedResult": "Balanserat resultat",
    "equityAndLiabilities.equity.yearResult": "Årets resultat",
    "equityAndLiabilities.equity.totalEquity": "Summa kapital",
    "equityAndLiabilities.liabilities.totalLongTermLiabilities": "Summa långfristiga skulder",
    "equityAndLiabilities.liabilities.totalShortTermLiabilities": "Summa kortfristiga skulder",
    "equityAndLiabilities.liabilities.shortTermLoans": "Kortfristiga lån",
    "equityAndLiabilities.liabilities.taxesAndFees": "Moms och avgifter",
    "equityAndLiabilities.liabilities.accountsPayable": "Leveranstörsskulder",
    "financials.balanceSheet.currentAssets.stock": "Lager",
    "financials.balanceSheet.currentAssets.accountsReceivable": "Kundfordringar",
    "financials.balanceSheet.currentAssets.bankKassa": "Bank och kassa",
   "financials.balanceSheet.currentAssets.shortTermReceivables": "Kortfristiga fordringar",
   "financials.balanceSheet.totalCurrentAssets": "Summa omsättningstillgångar",

  
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportDataResponse = await axiosConfig.get(`/AnnualReport/Reportcontent?companyId=${companyId}`);
        setReportData(reportDataResponse.data);
        console.log(reportData)
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

  const handlePrevTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.value === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].value);
    }
  };

  const handleNextTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.value === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].value);
    }
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
      console.log("Final data for submit: ",finalData)
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
    return <div className="p-4 text-red-500">Fel: {error}</div>;
  }

  if (!reportData) {
    return(
        <div className="p-8 space-y-20">
         
         <div className='space-y-15'>
         <Skeleton className="h-8 w-1/5 rounded-lg dark:bg-darkSecondary" /> {/* Titel */}
         <Skeleton className="h-5 w-2/5 rounded-lg mt-5 dark:bg-darkSecondary" /> {/* Underrubrik */}
         </div>
         
         <div className="space-x-4 flex flex-row">
                <Skeleton className="h-8 w-1/2 rounded-lg dark:bg-darkSecondary" />
                <Skeleton className="h-8 w-1/2 rounded-lg dark:bg-darkSecondary" />
        </div>

        <div className="space-x-4 flex flex-row">
                <Skeleton className="h-8 w-1/2 rounded-lg dark:bg-darkSecondary" />
                <Skeleton className="h-8 w-1/2 rounded-lg dark:bg-darkSecondary" />
        </div>

        <div className="space-x-4 flex flex-row">
                <Skeleton className="h-8 w-1/2 rounded-lg dark:bg-darkSecondary" />
                <Skeleton className="h-8 w-1/2 rounded-lg dark:bg-darkSecondary" />
        </div>
        <div className="space-x-4 flex flex-row">
                <Skeleton className="h-8 w-1/2 rounded-lg dark:bg-darkSecondary" />
                
        </div>

        <div className="space-y-5 flex flex-row">
                <Skeleton className="h-8 w-full rounded-lg dark:bg-darkSecondary" />
                
        </div>
        
      </div>

      );
  }

  const renderInputField = (path, value, label) => {
    
    const isNumeric = typeof value === 'number';
    
    // Always check customTitles for the label
    const customLabel = customTitles[path] || 
                        label || 
                        path.split('.').pop().replace(/([A-Z])/g, ' $1').trim();
    
    return (
      <div key={path} className="space-y-2">
        <Label htmlFor={path} className="text-sm font-medium">
          {customLabel}
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
            <h3 className="text-lg font-semibold mt-4">
              {customTitles[path] || key.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {renderSection(value, path)}
            </div>
          </div>
        );
      } else {
        return renderInputField(path, value, customTitles[path]);
      }
    });
  };
  

  return (
    <>
    <ToastProvider swipeDirection="right">
        <TabsContent value="annualReports">
          <Card className="rounded-none shadow-none border-none">
            <CardHeader>
              <CardTitle>Generera Årsredovisning</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-4 dark:bg-darkBackground truncate hidden lg:flex lg:justify-around">
                    {tabs.map(tab => (
                      <TabsTrigger key={tab.value} value={tab.value}>
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Content for each tab */}
                  <TabsContent value="company">
                    <h3 className="text-lg font-semibold mb-2">Företagsinformation</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {renderSection(reportData.company, 'company')}
                    </div>
                  </TabsContent>

                  <TabsContent value="resultDisposition">
                    <h3 className="text-lg font-semibold mb-2">Resultatsdisposition</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {renderSection(reportData.resultDisposition, 'resultDisposition')}
                    </div>
                  </TabsContent>

                  <TabsContent value="financials">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Resultaträkning</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {renderSection(reportData.financials.incomeStatement, 'financials.incomeStatement')}
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Balansrapport</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {renderSection(reportData.financials.balanceSheet, 'financials.balanceSheet')}
                        </div>
                      </div>
                    </div>

                  </TabsContent>

                  <TabsContent value="equityAndLiabilities">
                  <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Kapital</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                        {renderSection(reportData.equityAndLiabilities.equity, 'equityAndLiabilities.equity')}
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Skulder</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                        {renderSection(reportData.equityAndLiabilities.liabilities, 'equityAndLiabilities.liabilities')}
                        </div>
                      </div>
                    </div>
                    
                  </TabsContent>
                </Tabs>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 justify-between">
              <div className="lg:hidden flex space-x-2">
                <Button onClick={handlePrevTab} disabled={activeTab === tabs[0].value} className="w-36">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Tillbaka
                </Button>
                <Button onClick={handleNextTab} disabled={activeTab === tabs[tabs.length - 1].value} className="w-36">
                  Nästa
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <Button onClick={handleConfirmAndContinue} className="bg-green-500 w-full ">
                Bekräfta och fortsätt
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>


      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Signering</DialogTitle>
            <DialogDescription>
              Fyll i denna information för att signera och bekräfta Årsredovisning
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="signatureRole" className="text-right">
                  Din roll i företaget {reportData?.company.name}
                </Label>
                <TooltipProvider>
                  <TooltipShad>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Skriv in din roll i företaget exempel. VD, CFO, etc., För att korrekt signera Årsredovisningen</p>
                    </TooltipContent>
                  </TooltipShad>
                </TooltipProvider>
              </div>
              <Input
                id="signatureRole"
                value={additionalInfo.signatureRole}
                onChange={(e) => handleAdditionalInfoChange('signatureRole', e.target.value)}
                placeholder="Skriv in din roll i företaget"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="profitPercentageToKeep" className="text-right">
                Procent av Vinsten ({reportData?.resultDisposition.profit}SEK) till aktieägare
                </Label>
                <TooltipProvider>
                  <TooltipShad>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Skriv in procentsats av vinsten som du vill tilldela aktieägare som del av vinsten</p>
                    </TooltipContent>
                  </TooltipShad>
                </TooltipProvider>
              </div>
              <Input
                id="profitPercentageToKeep"
                type="number"
                value={additionalInfo.profitPercentageToKeep}
                onChange={(e) => handleAdditionalInfoChange('profitPercentageToKeep', e.target.value)}
                placeholder="Skriv en procentsats"
                min="0"
                max="100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signature" className="text-right">Signatur</Label>
                <Input
                  id="signature"
                  value={additionalInfo.signature}
                  onChange={(e) => handleAdditionalInfoChange('signature', e.target.value)}
                  placeholder="Signatur namn"
                />
              </div>
              
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full">Signera och Generera</Button>
        </DialogContent>
      </Dialog>
      {/* Toast Notifications */}
        <Toast
        open={toastState.isLoading || toastState.pdfLink} // Toasten hålls öppen så länge vi genererar eller har en pdf-länk
        onOpenChange={(open) => {
            // Vi tillåter användaren att stänga toasten
            if (!open) {
            setToastState({ isLoading: false, pdfLink: null }); // När toasten stängs, resetta state
            }
        }}
        >
        <ToastTitle>Årsredovisning</ToastTitle>
        <ToastDescription>
            {toastState.isLoading ? (
            <div className="flex items-center space-x-2">
                <span>Genererar rapport...</span>
                {/* Loader för när vi genererar rapporten */}
                <div className="loader w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
            </div>
            ) : toastState.pdfLink ? (
            <a href={toastState.pdfLink} download="Annual_Report.pdf" className="text-blue-500 underline">
                Ladda ner PDF
            </a>
            ) : null}
        </ToastDescription>

        {/* Stäng-knapp som tillåter användaren att stänga toasten manuellt */}
        <ToastClose className="absolute top-2 right-2" />
        </Toast>

        <ToastViewport />
      </ToastProvider>
    </>
    
  );
}