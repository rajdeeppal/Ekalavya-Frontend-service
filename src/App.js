import React from "react";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import MainApp from "./Components/PM/MainApp";
import ProgressIframe from "./Components/PM/ProgressIframe";
import { Routes, Route } from "react-router-dom";
import FinalPreview from "./Components/PM/FinalPreview";
import Resolution from "./Components/PM/Resolution";
import LoginForm from "./Components/UserAuthentication/LoginForm";
import Dashboard from "./Components/UserAuthentication/Dashboard";
import PendingRequests from "./Components/Admin/PendingRequests";
import RoleManagement from "./Components/Admin/RoleManagement";
import TaskIframe from "./Components/Admin/TaskIframe";
import { PrivateRoute } from "./Components/PrivateRoute";
import RegisterUserForm from "./Components/UserAuthentication/RegisterUserForm";
import EmailOtpVerification from "./Components/Admin/EmailOtpVerification";
import UserProfile from "./Components/MyProfile/UserProfile";
import ResolutionList from "./Components/DomainExpert/ResolutionList";
import ReviewPage from "./Components/DomainExpert/ReviewPage";
import RejectPage from "./Components/DomainExpert/RejectPage";
import "./App.css";
import RejectIframe from "./Components/PM/RejectIframe";
import CEOReviewPage from "./Components/CEO/CEOReviewPage";
import TrusteeReviewPage from "./Components/Trustee/TrusteeReviewPage";
import CEORejectPage from "./Components/CEO/CEORejectPage";
import TrusteeRejectPage from "./Components/Trustee/TrusteeRejectPage";
import PaymentPage from "./Components/CEO/PaymentPage";
import AOPaymentPage from "./Components/AO/AOPaymentPage";
import CEODashboard from "./Components/CEO/CEODashboard";
import AODashboard from "./Components/AO/AODashboard";
import ReportPage from "./Components/CEO/ReportPage";
import AOPaymentSuccess from "./Components/AO/AOPaymentSuccess";
import AOPaymentReject from "./Components/AO/AOPaymentReject";
import SecretaryApprovalPage from "./Components/Secretary/SecretaryApprovalPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register" element={<RegisterUserForm />} />

      <Route path="/otpValidation" element={<EmailOtpVerification />} />

      <Route
        path="/adminDashboard"
        element={
          <PrivateRoute requiredRoles={['EADMIN']}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/pendingRequests"
        element={
          <PrivateRoute requiredRoles={['EADMIN']}>
            <PendingRequests />
          </PrivateRoute>
        }
      />
      <Route
        path="/rolemanagement"
        element={
          <PrivateRoute requiredRoles={['EADMIN']}>
            <RoleManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="/createBeneficiary"
        element={
          <PrivateRoute requiredRoles={['EADMIN']}>
            <TaskIframe />
          </PrivateRoute>
        }
      />
      <Route
        path="/beneficiary"
        element={
          <PrivateRoute requiredRoles={['PM']}>
            <MainApp />
          </PrivateRoute>
        }
      />
      <Route
        path="/myprofile"
        element={
          <PrivateRoute requiredRoles={['EADMIN','PM','AO','DOMAIN EXPERT','PROCUREMENT','CEO','TRUSTEE', 'Secretary', 'VICE_CHAIRMAN']}>
            <UserProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/inprogress"
        element={
          <PrivateRoute requiredRoles={['PM']}>
            <ProgressIframe />
          </PrivateRoute>
        }
      />
      <Route
        path="/finalpreview"
        element={
          <PrivateRoute requiredRoles={['PM']}>
            <FinalPreview />
          </PrivateRoute>
        }
      />
      <Route
        path="/resolution"
        element={
          <PrivateRoute requiredRoles={['PM']}>
            <Resolution />
          </PrivateRoute>
        }
      />
      <Route
        path="/resolution-list"
        element={
          <PrivateRoute requiredRoles={['DOMAIN EXPERT', 'PROCUREMENT']}>
            <ResolutionList />
          </PrivateRoute>
        }
      />

      <Route
        path="/inprogress-list"
        element={
          <PrivateRoute requiredRoles={['DOMAIN EXPERT', 'PROCUREMENT']}>
            <ReviewPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/review-list"
        element={
          <PrivateRoute requiredRoles={['DOMAIN EXPERT', 'PROCUREMENT']}>
            <RejectPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/CEO/inprogress-list"
        element={
          <PrivateRoute requiredRoles={['CEO']}>
            <CEOReviewPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/CEO/review-list"
        element={
          <PrivateRoute requiredRoles={['CEO']}>
            <CEORejectPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/CEO/report-list"
        element={
          <PrivateRoute requiredRoles={['CEO']}>
            <ReportPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/CEO/payment-list"
        element={
          <PrivateRoute requiredRoles={['CEO']}>
            <PaymentPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/Trustee/inprogress-list"
        element={
          <PrivateRoute requiredRoles={['TRUSTEE']}>
            <TrusteeReviewPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/Trustee/review-list"
        element={
          <PrivateRoute requiredRoles={['TRUSTEE']}>
            <TrusteeRejectPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/AO/payment-list"
        element={
          <PrivateRoute requiredRoles={['AO']}>
            <AOPaymentPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/AO/dashboard/payment-list"
        element={
          <PrivateRoute requiredRoles={['AO']}>
            <AODashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/AO/dashboard/payment-list/success"
        element={
          <PrivateRoute requiredRoles={['AO']}>
            <AOPaymentSuccess />
          </PrivateRoute>
        }
      />

      <Route
        path="/AO/dashboard/payment-list/reject"
        element={
          <PrivateRoute requiredRoles={['AO']}>
            <AOPaymentReject />
          </PrivateRoute>
        }
      />

      <Route
        path="/CEO/dashboard-list"
        element={
          <PrivateRoute requiredRoles={['CEO']}>
            <CEODashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/rejectedList"
        element={
          <PrivateRoute requiredRoles={['PM']}>
            <RejectIframe />
          </PrivateRoute>
        }
      />

      <Route
        path="/VCS/dashboard"
        element={
          <PrivateRoute requiredRoles={['Secretary', 'VICE_CHAIRMAN']}>
            <SecretaryApprovalPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
