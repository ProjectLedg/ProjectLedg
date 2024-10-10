import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./DashboardPageComp/DashboardLayout";
import DashboardHomePage from "./DashboardHomePage";
import FinancialReportsPage from "./FinancialReportsPage";

export default function DashboardPage() {
    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                <Route index element={<DashboardHomePage />} />
                <Route path="financial-reports" element={<FinancialReportsPage />} />
            </Route>
        </Routes>
    );
}