import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPages/LandingPage';
import LoginPage from './pages/AccountHandlingPages/LoginPage';
import SignupPage from './pages/AccountHandlingPages/SignupPage';
import CompanySelectPage from './pages/AccountHandlingPages/CompanySelectPage';
import DashboardPage from './pages/DashboardPages/DashboardPage';
import WhyPage from './pages/LandingPages/WhyPage';
import FeaturePage from './pages/LandingPages/FeaturePage';
import PricingPage from './pages/LandingPages/PricingPage';
import ContactPage from './pages/LandingPages/ContactPage';
import CompanyCreatePage from './pages/AccountHandlingPages/CompanyCreatePage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/signup" element={<SignupPage/>}/>
                <Route path="/company-select" element={<CompanySelectPage/>}/>
                <Route path="/dashboard" element={<DashboardPage/>}/>
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