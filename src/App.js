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
import AODashboardTable from "./Components/AO/AODashboardTable";

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

      <Route
        path="/inprogress-list"
        element={
          <PrivateRoute>
            <ReviewPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/review-list"
        element={
          <PrivateRoute>
            <RejectPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/CEO/inprogress-list"
        element={
          <PrivateRoute>
            <CEOReviewPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/CEO/review-list"
        element={
          <PrivateRoute>
            <CEORejectPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/CEO/payment-list"
        element={
          <PrivateRoute>
            <PaymentPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/Trustee/inprogress-list"
        element={
          <PrivateRoute>
            <TrusteeReviewPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/Trustee/review-list"
        element={
          <PrivateRoute>
            <TrusteeRejectPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/AO/payment-list"
        element={
          <PrivateRoute>
            <AOPaymentPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/AO/dashboard/payment-list"
        element={
          <PrivateRoute>
            <AODashboardTable />
          </PrivateRoute>
        }
      />

      <Route
        path="/CEO/dashboard-list"
        element={
          <PrivateRoute>
            <CEODashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/rejectedList"
        element={
          <PrivateRoute>
            <RejectIframe />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
