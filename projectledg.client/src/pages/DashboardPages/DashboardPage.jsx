// import { Route, Routes } from "react-router-dom";
// import DashboardLayout from "./DashboardPageComp/DashboardLayout";
// import DashboardHomePage from "./DashboardHomePage";
// import FinancialReportsPage from "./FinancialReportsPage";
// import SettingsPage from "./SettingsPage";
// import FinancialStatementPage from "./FinancialStatementPage";
// import BookingPage from "./BookingPage";
// import LandingPage from "../LandingPages/LandingPage";
// // import CompanySelectPage from "../AccountHandlingPages/CompanySelectPage"

// export default function DashboardPage() {
//     return (
//         <Routes>
//             {/* Redirect /dashboard to a default page - temp we use company selection page */}
//             {/* <Route path="/" element={<DashboardHomePage />} /> */}


//             <Route path="/dashboard/:companyId" element={<DashboardLayout />}>
//                 <Route index element={<DashboardHomePage />} />
//                 <Route path="financial-reports" element={<FinancialReportsPage />} />
//                 <Route path="book" element={<BookingPage />} />
//                 <Route path="financial-statement" element={<FinancialStatementPage />} />
//                 <Route path="settings" element={<SettingsPage />} />
//                 {/* <Route path="*" element={<LandingPage />} /> */}
//             </Route>
//         </Routes>
//     );
// }