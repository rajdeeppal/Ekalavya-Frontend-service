import React from "react";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import MainApp from "./Components/PM/MainApp";
import ProgressIframe from "./Components/PM/ProgressIframe";
import { Routes, Route } from "react-router-dom";
import FinalPreview from "./Components/PM/FinalPreview";
import Resolution from "./Components/PM/Resolution";
import LoginForm from "./Components/UserAuthentication/LoginForm";
import PendingRequests from "./Components/Admin/PendingRequests";
import RoleManagement from "./Components/Admin/RoleManagement";
import TaskIframe from "./Components/Admin/TaskIframe";
import { PrivateRoute } from "./Components/PrivateRoute";
import RegisterUserForm from "./Components/UserAuthentication/RegisterUserForm";
import EmailOtpVerification from "./Components/Admin/EmailOtpVerification";
import UserProfile from "./Components/MyProfile/UserProfile";
import ResolutionList from "./Components/DomainExpert/ResolutionList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/register" element={<RegisterUserForm />} />

      <Route path="/otpValidation" element={<EmailOtpVerification />} />

      <Route
        path="/adminDashboard"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/pendingRequests"
        element={
          <PrivateRoute>
            <PendingRequests />
          </PrivateRoute>
        }
      />
      <Route
        path="/rolemanagement"
        element={
          <PrivateRoute>
            <RoleManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="/createBeneficiary"
        element={
          <PrivateRoute>
            <TaskIframe />
          </PrivateRoute>
        }
      />
      <Route
        path="/beneficiary"
        element={
          <PrivateRoute>
            <MainApp />
          </PrivateRoute>
        }
      />
      <Route
        path="/myprofile"
        element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/inprogress"
        element={
          <PrivateRoute>
            <ProgressIframe />
          </PrivateRoute>
        }
      />
      <Route
        path="/finalpreview"
        element={
          <PrivateRoute>
            <FinalPreview />
          </PrivateRoute>
        }
      />
      <Route
        path="/resolution"
        element={
          <PrivateRoute>
            <Resolution />
          </PrivateRoute>
        }
      />
      <Route
        path="/resolution-list"
        element={
          <PrivateRoute>
            <ResolutionList />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
