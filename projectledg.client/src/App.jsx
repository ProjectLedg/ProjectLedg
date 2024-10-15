import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPages/LandingPage';
import LoginPage from './pages/AccountHandlingPages/LoginPage';
import SignupPage from './pages/AccountHandlingPages/SignupPage';
import CompanySelectPage  from './pages/AccountHandlingPages/CompanySelectPage'
import CompanyCreatePage  from './pages/AccountHandlingPages/CompanyCreatePage'
import ContactPage from './pages/LandingPages/ContactPage'
import PricingPage from './pages/LandingPages/PricingPage'
import FeaturePage from './pages/LandingPages/FeaturePage'
import WhyPage from  './pages/LandingPages/WhyPage'
import DashboardLayout from './pages/DashboardPages/DashboardPageComp/DashboardLayout'
import DashboardHomePage from './pages/DashboardPages/DashboardHomePage'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/signup" element={<SignupPage/>}/>
                <Route path="/company-select" element={<CompanySelectPage/>}/>
                <Route path="/dashboard/:companyId" element={<DashboardLayout />}>
                    {/* Nested Routes */}
                    <Route index element={<DashboardHomePage />} />
                    {/* Add futute sub-dashboard routes here */}
                </Route>
                <Route path="/why" element={<WhyPage/>}/>
                <Route path="/feature" element={<FeaturePage/>}/>
                <Route path="/pricing" element={<PricingPage/>}/>
                <Route path="/contact" element={<ContactPage/>}/>
                <Route path="/company-create" element={<CompanyCreatePage/>}/>      
            </Routes>
        </Router>
    );    
}
export default App;