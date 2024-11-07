import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPages/LandingPage';
import LoginPage from './pages/AccountHandlingPages/LoginPage';
import SignupPage from './pages/AccountHandlingPages/SignupPage';
import CompanySelectPage from './pages/AccountHandlingPages/CompanySelectPage'
import CompanyCreatePage from './pages/AccountHandlingPages/CompanyCreatePage'
import ContactPage from './pages/LandingPages/ContactPage'
import PricingPage from './pages/LandingPages/PricingPage'
import FeaturePage from './pages/LandingPages/FeaturePage'
import WhyPage from './pages/LandingPages/WhyPage'
import DashboardLayout from './pages/DashboardPages/DashboardPageComp/DashboardLayout'
import DashboardHomePage from './pages/DashboardPages/DashboardHomePage'
import FinancialReportsPage from './pages/DashboardPages/FinancialReportsPage'
import AnnualReportPage from './pages/DashboardPages/AnnualReportPage';
import SettingsPage from './pages/DashboardPages/SettingsPage'
import BookingPage from './pages/DashboardPages/BookingPage'
import InvoicingPage from './pages/DashboardPages/InvoicingPage';
import HelpPage from './pages/DashboardPages/HelpPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/company-select" element={<CompanySelectPage />} />
                <Route path="/dashboard/:companyId" element={<DashboardLayout />}>
                    {/* Nested Routes */}
                    <Route index element={<DashboardHomePage />} />
                    <Route path="financial-reports" element={<FinancialReportsPage />} />
                    <Route path="book" element={<BookingPage />} />
                    <Route path="annual-report" element={<AnnualReportPage />} />
                    <Route path="invoicing" element={<InvoicingPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="help" element={<HelpPage />} />
                </Route>
                <Route path="/why" element={<WhyPage />} />
                <Route path="/features" element={<FeaturePage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/company-create" element={<CompanyCreatePage />} />
            </Routes>
        </Router>
    );
}
export default App;