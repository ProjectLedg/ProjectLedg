import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./DashboardPageComp/DashboardLayout";
import DashboardHomePage from "./DashboardHomePage";
import FinancialReportsPage from "./FinancialReportsPage";
import SettingsPage from "./SettingsPage";
import FinancialStatementPage from "./FinancialStatementPage";
import BookingPage from "./BookingPage";
import LandingPage from "../LandingPages/LandingPage";

export default function DashboardPage() {
    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                <Route index element={<DashboardHomePage />} />
                <Route path="financial-reports" element={<FinancialReportsPage />} />
                <Route path="book" element={<BookingPage />} />
                <Route path="financial-statement" element={<FinancialStatementPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="/*" element={<LandingPage />} />
            </Route>
        </Routes>
    );
}