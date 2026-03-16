import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ScreeningProvider } from "@/contexts/ScreeningContext";
import NotFound from "./pages/NotFound";

// Onboarding
import SplashScreen from "./pages/onboarding/SplashScreen";
import IntroScreen from "./pages/onboarding/IntroScreen";
import TutorialScreen from "./pages/onboarding/TutorialScreen";

// Auth
import RoleSelectScreen from "./pages/auth/RoleSelectScreen";
import LoginScreen from "./pages/auth/LoginScreen";
import SignupScreen from "./pages/auth/SignupScreen";
import ForgotPasswordScreen from "./pages/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "./pages/auth/ResetPasswordScreen";
import OTPVerificationScreen from "./pages/auth/OTPVerificationScreen";
import ChangePasswordScreen from "./pages/auth/ChangePasswordScreen";

// Dashboard
import DashboardScreen from "./pages/dashboard/DashboardScreen";
import AdminDashboardScreen from "./pages/admin/AdminDashboardScreen";
import CampModeScreen from "./pages/screening/CampModeScreen";

// Screening
import ConsentScreen from "./pages/screening/ConsentScreen";
import PatientDetailsScreen from "./pages/screening/PatientDetailsScreen";
import DyeInstructionScreen from "./pages/screening/DyeInstructionScreen";
import CaptureGuideScreen from "./pages/screening/CaptureGuideScreen";
import ImageCaptureScreen from "./pages/screening/ImageCaptureScreen";
import ProcessingScreen from "./pages/screening/ProcessingScreen";
import HeatmapScreen from "./pages/screening/HeatmapScreen";
import ResultsScreen from "./pages/screening/ResultsScreen";
import OverrideScreen from "./pages/screening/OverrideScreen";
import ReferralScreen from "./pages/screening/ReferralScreen";
import ClinicDetailScreen from "./pages/screening/ClinicDetailScreen";
import SaveRecordScreen from "./pages/screening/SaveRecordScreen";

// Records
import RecordsListScreen from "./pages/records/RecordsListScreen";
import RecordDetailScreen from "./pages/records/RecordDetailScreen";

// Statistics
import StatisticsScreen from "./pages/statistics/StatisticsScreen";
import LocationHeatmapScreen from "./pages/statistics/LocationHeatmapScreen";
import CampSummariesScreen from "./pages/statistics/CampSummariesScreen";

// Profile
import ProfileScreen from "./pages/profile/ProfileScreen";
import EditProfileScreen from "./pages/profile/EditProfileScreen";
import SettingsScreen from "./pages/profile/SettingsScreen";
import SyncScreen from "./pages/profile/SyncScreen";
import DisclaimerScreen from "./pages/profile/DisclaimerScreen";
import AboutIndicesScreen from "./pages/profile/AboutIndicesScreen";
import HelpScreen from "./pages/profile/HelpScreen";

const queryClient = new QueryClient();

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="mobile-screen items-center justify-center bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          <p className="text-primary-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ScreeningProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Onboarding */}
              <Route path="/" element={<SplashScreen />} />
              <Route path="/intro" element={<IntroScreen />} />
              <Route path="/tutorial" element={<TutorialScreen />} />

              {/* Auth */}
              <Route path="/role-select" element={<RoleSelectScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
              <Route path="/reset-password" element={<ResetPasswordScreen />} />
              <Route path="/change-password" element={<ProtectedRoute><ChangePasswordScreen /></ProtectedRoute>} />
              <Route path="/verify-otp" element={<OTPVerificationScreen />} />

              {/* Protected Dashboard */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboardScreen /></ProtectedRoute>} />
              <Route path="/camp-mode" element={<ProtectedRoute><CampModeScreen /></ProtectedRoute>} />

              {/* Screening Flow */}
              <Route path="/new-screening" element={<Navigate to="/screening/consent" replace />} />
              <Route path="/screening/consent" element={<ProtectedRoute><ConsentScreen /></ProtectedRoute>} />
              <Route path="/screening/patient-details" element={<ProtectedRoute><PatientDetailsScreen /></ProtectedRoute>} />
              <Route path="/screening/dye-instruction" element={<ProtectedRoute><DyeInstructionScreen /></ProtectedRoute>} />
              <Route path="/screening/capture-guide" element={<ProtectedRoute><CaptureGuideScreen /></ProtectedRoute>} />
              <Route path="/screening/capture" element={<ProtectedRoute><ImageCaptureScreen /></ProtectedRoute>} />
              <Route path="/screening/processing" element={<ProtectedRoute><ProcessingScreen /></ProtectedRoute>} />
              <Route path="/screening/heatmap" element={<ProtectedRoute><HeatmapScreen /></ProtectedRoute>} />
              <Route path="/screening/results" element={<ProtectedRoute><ResultsScreen /></ProtectedRoute>} />
              <Route path="/screening/override" element={<ProtectedRoute><OverrideScreen /></ProtectedRoute>} />
              <Route path="/screening/referral" element={<ProtectedRoute><ReferralScreen /></ProtectedRoute>} />
              <Route path="/screening/clinic/:id" element={<ProtectedRoute><ClinicDetailScreen /></ProtectedRoute>} />
              <Route path="/screening/save" element={<ProtectedRoute><SaveRecordScreen /></ProtectedRoute>} />

              {/* Records */}
              <Route path="/records" element={<ProtectedRoute><RecordsListScreen /></ProtectedRoute>} />
              <Route path="/records/:id" element={<ProtectedRoute><RecordDetailScreen /></ProtectedRoute>} />

              {/* Statistics */}
              <Route path="/statistics" element={<ProtectedRoute><StatisticsScreen /></ProtectedRoute>} />
              <Route path="/statistics/location" element={<ProtectedRoute><LocationHeatmapScreen /></ProtectedRoute>} />
              <Route path="/statistics/camps" element={<ProtectedRoute><CampSummariesScreen /></ProtectedRoute>} />

              {/* Profile */}
              <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
              <Route path="/edit-profile" element={<ProtectedRoute><EditProfileScreen /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />
              <Route path="/settings/sync" element={<ProtectedRoute><SyncScreen /></ProtectedRoute>} />
              <Route path="/disclaimer" element={<ProtectedRoute><DisclaimerScreen /></ProtectedRoute>} />
              <Route path="/about-indices" element={<ProtectedRoute><AboutIndicesScreen /></ProtectedRoute>} />
              <Route path="/help" element={<ProtectedRoute><HelpScreen /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ScreeningProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
