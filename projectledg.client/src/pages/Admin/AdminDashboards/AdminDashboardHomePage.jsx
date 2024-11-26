import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { axiosConfig } from '/axiosconfig';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { HelpCircle } from 'lucide-react';
import {
  TooltipShad,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const tooltipInfo = {
  logins: "Antal Inloggningar: <br /> Det totala antalet unika inloggningar för Ledge; filtrerat på Dag/Vecka/År.",
  ingoing: "Ingående fakturor: <br /> Det totala antalet ingående fakturor som har bokförts.",
  totalusers : "Total antalet användare på plattformen",
  outgoingInvoice : "Utgående fakturor: <br /> Det totala antalet utgående fakturor som har bokförts.",
  loginsweekly : "Antal Inloggningar: <br /> Det totala antalet unika inloggningar för Ledge; filtrerat på Dag/Vecka/År.",
  loginsyearly : "Antal Inloggningar: <br /> Det totala antalet unika inloggningar för Ledge; filtrerat på Dag/Vecka/År."
  
};

const MetricCard = ({ title, value, toolDescription }) => (
  <Card className="overflow-hidden max-h-64">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center">
        {title}
      </CardTitle>
      <TooltipProvider>
        <TooltipShad>
          <TooltipTrigger>
            <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p dangerouslySetInnerHTML={{ __html: toolDescription }}></p>
          </TooltipContent>
        </TooltipShad>
      </TooltipProvider>
    </CardHeader>
    <CardContent>
      <div className="text-lg sm:text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const LoadingSpinner = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 10));
    }, 70);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-64 space-y-4">
        <Progress value={progress} className="w-full" />
        <p className="text-center text-sm text-muted-foreground">Loading data...</p>
      </div>
    </div>
  );
};

const AdminDashboardHomePage = () => {
  const { userId } = useParams();
  const { isChatOpen } = useOutletContext();
  const [outgoingInvoice , setoutgoingInvoices] = useState(null);
  const [logins, setLogins] = useState(null);
  const [invoices, setInvoices] = useState(null);
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginsweekly, setLoginsweekly] = useState(null);
  const [loginsyearly, setLoginsyearly] = useState(null);
  

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [loginsResponse, invoicesResponse, userResponse, outgoingInvoiceResponse, loginsweeklyResponse, loginsyearlyReponse] = await Promise.all([
          axiosConfig.get('/Statistics/users/logins/today'),
          axiosConfig.get('/Statistics/invoices/ingoing/today'),
          axiosConfig.get('/Statistics/users/total'),
          axiosConfig.get('/Statistics/invoices/outgoing/today'),
          axiosConfig.get('/Statistics/users/logins/week'),
          axiosConfig.get('/Statistics/users/logins/year')
        ]);

        console.log("Logins Data:", loginsResponse.data);
        console.log("Invoices Data:", invoicesResponse.data);

        setLogins(loginsResponse.data);
        setInvoices(invoicesResponse.data);
        setUsers(userResponse.data);
        setoutgoingInvoices(outgoingInvoiceResponse.data);
        setLoginsweekly(loginsweeklyResponse.data);
        setLoginsyearly(loginsyearlyReponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard Overview</h2>
      </div>
      <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2`}>
        <MetricCard
          title="Number of Logins daily"
          value={logins || 0}
          toolDescription={tooltipInfo.logins}
        />
        <MetricCard
          title="Number of Ingoing Invoices"
          value={invoices || 0}
          toolDescription={tooltipInfo.ingoing}
        />
        <MetricCard
          title="Number of users"
          value={users || 0}
          toolDescription={tooltipInfo.totalusers}
        />
        <MetricCard
          title="Number of Outgoing Invoices"
          value={outgoingInvoice || 0}
          toolDescription={tooltipInfo.outgoingInvoice}
        />
        <MetricCard
          title="Number of logins weekly"
          value={loginsweekly || 0}
          toolDescription={tooltipInfo.loginsweekly}
        />
        <MetricCard
          title="Number of logins yearly"
          value={loginsyearly || 0}
          toolDescription={tooltipInfo.loginsyearly}
        />
      </div>
    </div>
  );
};

export default AdminDashboardHomePage;
