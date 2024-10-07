import { useEffect, useState } from 'react';
import './App.css';

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