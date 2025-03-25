import React from "react";

import { BrowserRouter as Router, Route, Routes ,useLocation} from "react-router-dom";

import SideBar from "./components/SideBar";
import Header from "./components/Header";
import TestProfile from "./pages/TestProfile";
import Login from "./pages/Login";
import ResultsPage from "./pages/ResultsPage";
import AdminDashboard from "./pages/AdminDashboard";
import User from "./pages/User";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CategoryTable from "./components/Categories/CategoryTable";
import RiskTable from "./components/RiskProfile/RiskTable";
import QuestionsTable from "./components/QuestionsTable";
import AddQuestionsTable from "./components/AddQuestionModal";
import SessionChecker from "./SessionChecker";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/SettingsPage";
import Unauthorized from "./pages/Unauthorized";

function App() {

  const location = useLocation();
  const hideSidebarRoutes = ["/","/login","/change-password","/forgot-password","/reset-password","/unauthorized"];
  

  return (
    <div className="app-container">
      {/* Header should be visible on all pages except Login */}
      {!hideSidebarRoutes.includes(location.pathname) && <Header />}

      <div className="content-layout">
        {/* Sidebar should only render if not on login page */}
        {!hideSidebarRoutes.includes(location.pathname) && (
          <div className="sidebar">
            <SideBar />
          </div>
        )}
 
        {/* Main Content */}
        <div className="main-content">
        <SessionChecker>
          <Routes>
         
            <Route path="/" element={<Login />} />
            <Route path="/test_options" element={<TestProfile />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/users" element={<User />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/categories" element={<CategoryTable />} />
            <Route path="/risk-profiles" element={<RiskTable />} />
            <Route path="/questions" element={<QuestionsTable />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/settings" element={<SettingsPage /> } />
          </Routes>
          </SessionChecker>
        </div>
      </div>
    </div>
  );
}

export default App;
