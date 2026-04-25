import StartPage from "./pages/StartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardAdminPage from "./pages/DashboardAdminPage";
import SystemHealthPage from "./pages/SystemHealthPage";
import UserManagementPage from "./pages/UserManagementPage";
import HouseholdManagementPage from "./pages/HouseholdManagementPage";
import HouseholdPage from "./pages/HouseholdPage";
import AddMemberPage from "./pages/AddMemberPage";
import EditHouseholdPage from "./pages/EditHouseholdPage";
import IncomePage from "./pages/IncomePage";
import PersonalExpensePage from "./pages/PersonalExpensePage";
import FamilyExpensePage from "./pages/FamilyExpensePage";
import BudgetPage from "./pages/BudgetPage";
import UtilitiesPage from "./pages/UtilitiesPage";
import SettingsPage from "./pages/SettingsPage";
import NotificationPage from "./pages/NotificationPage";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard-admin" element={<DashboardAdminPage />} />
      <Route path="/dashboard-admin/system-health" element={<SystemHealthPage />} />
      <Route path="/dashboard-admin/users" element={<UserManagementPage />} />
      <Route path="/dashboard-admin/households" element={<HouseholdManagementPage />} />
      <Route path="/household" element={<HouseholdPage />} />
      <Route path="/household/add-member" element={<AddMemberPage />} />
      <Route path="/household/edit" element={<EditHouseholdPage />} />
      <Route path="/income" element={<IncomePage />} />
      <Route path="/expense" element={<Navigate to="/expense/personal" replace />} />
      <Route path="/expense/personal" element={<PersonalExpensePage />} />
      <Route path="/expense/family" element={<FamilyExpensePage />} />
      <Route path="/budget" element={<BudgetPage />} />
      <Route path="/utilities" element={<UtilitiesPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/notifications" element={<NotificationPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
