import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPages/LandingPage';
import LoginPage from './pages/AccountHandlingPages/LoginPage';
import SignupPage from './pages/AccountHandlingPages/SignupPage';
import CompanySelectPage from './pages/AccountHandlingPages/CompanySelectPage';
import CompanyCreatePage from './pages/AccountHandlingPages/CompanyCreatePage';
import ContactPage from './pages/LandingPages/ContactPage';
import PricingPage from './pages/LandingPages/PricingPage';
import FeaturePage from './pages/LandingPages/FeaturePage';
import WhyPage from './pages/LandingPages/WhyPage';
import DashboardLayout from './pages/DashboardPages/DashboardPageComp/DashboardLayout';
import DashboardHomePage from './pages/DashboardPages/DashboardHomePage';
import FinancialReportsPage from './pages/DashboardPages/FinancialReportsPage';
import FinancialStatementPage from './pages/DashboardPages/FinancialStatementPage';
import SettingsPage from './pages/DashboardPages/SettingsPage';
import BookingPage from './pages/DashboardPages/BookingPage';
import InvoicingPage from './pages/DashboardPages/InvoicingPage';
import HelpPage from './pages/DashboardPages/HelpPage';
//Admin
import AdminLoginPage from './pages/Admin/AdminLoginPage';
import AdminDashboardHomePage from './pages/Admin/AdminDashboards/AdminDashboardHomePage';
import AdminDashboardLayout from './pages/Admin/AdminDashboards/AdminDashboardLayout'
import ProtectedRoute from './pages/Admin/ProtectedRouteComp/ProtectedRoute';
import UserTickets from './pages/Admin/AdminDashboards/UserTickets'
import AdminSettingsPage from './pages/Admin/AdminDashboards/AdminSettingsPage'
import UserManagementPage from './pages/Admin/AdminDashboards/UserManagementPage'
import { ThemeProvider } from './components/ThemeProvider';

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/company-select" element={<CompanySelectPage />} />
                    <Route path="/dashboard/:companyId" element={<DashboardLayout />}>
                        <Route index element={<DashboardHomePage />} />
                        <Route path="financial-reports" element={<FinancialReportsPage />} />
                        <Route path="book" element={<BookingPage />} />
                        <Route path="financial-statement" element={<FinancialStatementPage />} />
                        <Route path="invoicing" element={<InvoicingPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="help" element={<HelpPage />} />
                    </Route>
                    <Route path="/why" element={<WhyPage />} />
                    <Route path="/features" element={<FeaturePage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/company-create" element={<CompanyCreatePage />} />
                    <Route path="/admin-login" element={<AdminLoginPage />} />

                    {/* Protected Routes for Admin and Manager roles */}
                    <Route path="/admin/dashboard"
                        element={
                            <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                            <AdminDashboardLayout />
                            </ProtectedRoute>
                        } >
                        <Route index element={<AdminDashboardHomePage />} />
                        <Route path="settings" element={<AdminSettingsPage />} />
                        <Route path="tickets" element={<UserTickets />} />
                        <Route path="usermanagement" element={<UserManagementPage />} />
                        </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
