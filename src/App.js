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
import { PrivateRoute, useAuth } from "./Components/PrivateRoute";
import RegisterUserForm from "./Components/UserAuthentication/RegisterUserForm";
import ForgotPassword from "./Components/UserAuthentication/ForgotPassword";
import EmailOtpVerification from "./Components/Admin/EmailOtpVerification";
import UserProfile from "./Components/MyProfile/UserProfile";
import ResolutionList from "./Components/DomainExpert/ResolutionList";
import AOResolutionList from "./Components/AO/AOResolutionList";
import CEOResolutionList from "./Components/CEO/CEOResolutionList";
import TrusteeResolutionList from "./Components/Trustee/TrusteeResolutionList";
import SecretaryResolutionList from "./Components/Secretary/SecretaryResolutionList";
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
import { jwtDecode }   from 'jwt-decode';
import DirectorReviewPage from "./Components/Director/DirectorReviewPage";
import DirectorRejectPage from "./Components/Director/DirectorRejectPage";
import DirectorResolutionList from "./Components/Director/DirectorResolutionList";
import TrainingIframe from "./Components/PM/TrainingIframe";
import TrainingInProgressTable from "./Components/PM/TrainingInProgressTable";
import TrainingInProgressFrame from "./Components/PM/TrainingInProgressframe";
import TrainingDirectorReviewPage from "./Components/Director/TrainingDirectorReviewPage";
import TrainingDirectorRejectPage from "./Components/Director/TrainingDirectorRejectPage";
import TrainingTrusteeReviewPage from "./Components/Trustee/TrainingTrusteeReviewPage";
import TrainingTrusteeRejectPage from "./Components/Trustee/TrainingTrusteeRejectPage";
import TrainingCEOReviewPage from "./Components/CEO/TrainingCEOReviewPage";
import TrainingCEORejectPage from "./Components/CEO/TrainingCEORejectPage";
import TrainingRejectIframe from "./Components/PM/TrainingRejectIframe";
import TrainingFinalPreview from "./Components/PM/TrainingFinalPreview";
import TrainingCEODashboard from "./Components/CEO/TrainingCEODashboard";
import TrainingDomainExpertReviewPage from "./Components/DomainExpert/TrainingDomainExpertReviewPage";
import TrainingDomainExpertRejectPage from "./Components/DomainExpert/TrainingDomainExpertRejectPage";

function App() {
  const { userRole } = useAuth();
console.log(userRole);
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register" element={<RegisterUserForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

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
          <PrivateRoute requiredRoles={['EADMIN','PM','CFO','DOMAIN EXPERT','PROCUREMENT','CEO','TRUSTEE', 'SECRETARY', 'VICE_CHAIRMAN', 'PROJECT DIRECTOR']}>
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
        path="/training-final-preview"
        element={
          <PrivateRoute requiredRoles={['PM']}>
            <TrainingFinalPreview/>
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
        path="/training"
        element={
          <PrivateRoute requiredRoles={['PM']}>
            <TrainingIframe />
          </PrivateRoute>
        }
      />

      <Route
        path="/training-in-progress"
        element={
          <PrivateRoute requiredRoles={['PM']}>
            <TrainingInProgressFrame/>
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
        path="/training/inprogress-list"
        element={
          <PrivateRoute requiredRoles={['DOMAIN EXPERT', 'PROCUREMENT']}>
            <TrainingDomainExpertReviewPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/training/review-list"
        element={
          <PrivateRoute requiredRoles={['DOMAIN EXPERT', 'PROCUREMENT']}>
            <TrainingDomainExpertRejectPage />
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
        path="/CEO/training/inprogress-list"
        element={
          <PrivateRoute requiredRoles={['CEO']}>
            <TrainingCEOReviewPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/CEO/training/review-list"
        element={
          <PrivateRoute requiredRoles={['CEO']}>
            <TrainingCEORejectPage />
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
        path="/Trustee/training/inprogress-list"
        element={
          <PrivateRoute requiredRoles={['TRUSTEE']}>
            <TrainingTrusteeReviewPage/>
          </PrivateRoute>
        }
      />

      <Route
        path="/Trustee/training/review-list"
        element={
          <PrivateRoute requiredRoles={['TRUSTEE']}>
            <TrainingTrusteeRejectPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/AO/payment-list"
        element={
          <PrivateRoute requiredRoles={['CFO']}>
            <AOPaymentPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/AO/dashboard/payment-list"
        element={
          <PrivateRoute requiredRoles={['CFO']}>
            <AODashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/AO/dashboard/payment-list/success"
        element={
          <PrivateRoute requiredRoles={['CFO']}>
            <AOPaymentSuccess />
          </PrivateRoute>
        }
      />

      <Route
        path="/AO/dashboard/payment-list/reject"
        element={
          <PrivateRoute requiredRoles={['CFO']}>
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
        path="/CEO/dashboard/training-records"
        element={
          <PrivateRoute requiredRoles={['CEO']}>
            <TrainingCEODashboard />
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
        path="/training-rejected"
        element={
          <PrivateRoute requiredRoles={['PM']}>
            <TrainingRejectIframe />
          </PrivateRoute>
        }
      />

      <Route
        path="/VCS/dashboard"
        element={
          <PrivateRoute requiredRoles={['SECRETARY', 'VICE_CHAIRMAN']}>
            <SecretaryApprovalPage />
          </PrivateRoute>
        }
      />

       <Route
        path="/Trustee/resolution-list"
        element={
          <PrivateRoute requiredRoles={['TRUSTEE']}>
            <TrusteeResolutionList />
          </PrivateRoute>
        }
      />

      <Route
        path="/VCS/resolution-list"
        element={
          <PrivateRoute requiredRoles={['Secretary', 'VICE_CHAIRMAN']}>
            <SecretaryResolutionList />
          </PrivateRoute>
        }
      />

      <Route
        path="/CEO/resolution-list"
        element={
          <PrivateRoute requiredRoles={['CEO']}>
            <CEOResolutionList />
          </PrivateRoute>
        }
      />

      <Route
        path="/AO/resolution-list"
        element={
          <PrivateRoute requiredRoles={['CFO']}>
            <AOResolutionList />
          </PrivateRoute>
        }
      />

      <Route
        path="/Director/inprogress-list"
        element={
          <PrivateRoute requiredRoles={['PROJECT DIRECTOR']}>
            <DirectorReviewPage />
          </PrivateRoute>
        }
      />
      

      <Route
        path="/Director/training/inprogress-list"
        element={
          <PrivateRoute requiredRoles={['PROJECT DIRECTOR']}>
            <TrainingDirectorReviewPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/Director/review-list"
        element={
          <PrivateRoute requiredRoles={['PROJECT DIRECTOR']}>
            <DirectorRejectPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/Director/training/review-list"
        element={
          <PrivateRoute requiredRoles={['PROJECT DIRECTOR']}>
            <TrainingDirectorRejectPage />
          </PrivateRoute>
        }
      />
      

      <Route
        path="/Director/resolution-list"
        element={
          <PrivateRoute requiredRoles={['PROJECT DIRECTOR']}>
            <DirectorResolutionList />
          </PrivateRoute>
        }
      />

    </Routes>
  );
}

export default App;
