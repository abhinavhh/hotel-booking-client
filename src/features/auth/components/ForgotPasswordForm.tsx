import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  KeyRound,
  ArrowLeft,
} from "lucide-react";
import { useAuth, useFormValidation } from "../hooks/useAuth";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { slideUp, staggerContainer } from "../../../Animations/animation";

type Step = "email" | "otp" | "reset" | "success";

export const ForgotPasswordForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const {
    sendOTP,
    verifyOTP,
    resetPassword,
    isLoading,
    error: authError,
  } = useAuth();
  const { errors, validateEmail, validatePassword, validateOTP, clearErrors } =
    useFormValidation();

  // Step 1: Send OTP to Email
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const isEmailValid = validateEmail(email);

    if (isEmailValid) {
      const result = await sendOTP(email);

      if (result.success) {
        setSuccessMessage(result.message || "");
        setCurrentStep("otp");
      }
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const isOTPValid = validateOTP(otp);

    if (isOTPValid) {
      const result = await verifyOTP(email, otp);

      if (result.success) {
        setSuccessMessage(result.message || "");
        setCurrentStep("reset");
      }
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setConfirmPasswordError("");

    const isPasswordValid = validatePassword(newPassword);

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    if (isPasswordValid) {
      const result = await resetPassword(email, otp, newPassword);

      if (result.success) {
        setSuccessMessage(result.message || "");
        setCurrentStep("success");
      }
    }
  };

  const handleBackToEmail = () => {
    setCurrentStep("email");
    setOtp("");
    clearErrors();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "email":
        return (
          <motion.form
            key="email-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSendOTP}
            className="space-y-4"
          >
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={20} />}
              error={errors.email}
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              icon={!isLoading && <ArrowRight size={20} />}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </motion.form>
        );

      case "otp":
        return (
          <motion.form
            key="otp-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleVerifyOTP}
            className="space-y-4"
          >
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-600">{successMessage}</p>
              </motion.div>
            )}

            <div className="text-sm text-muted-foreground mb-4">
              We've sent a 6-digit code to <strong>{email}</strong>
            </div>

            <Input
              label="Enter OTP"
              name="otp"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              icon={<KeyRound size={20} />}
              error={errors.otp}
              disabled={isLoading}
              maxLength={6}
            />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleBackToEmail}
                icon={<ArrowLeft size={20} />}
                disabled={isLoading}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                icon={!isLoading && <ArrowRight size={20} />}
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>

            <button
              type="button"
              onClick={handleSendOTP}
              className="text-sm text-primary hover:underline w-full text-center"
              disabled={isLoading}
            >
              Resend OTP
            </button>
          </motion.form>
        );

      case "reset":
        return (
          <motion.form
            key="reset-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleResetPassword}
            className="space-y-4"
          >
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-600">{successMessage}</p>
              </motion.div>
            )}

            <Input
              label="New Password"
              name="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              icon={<Lock size={20} />}
              error={errors.password}
              disabled={isLoading}
            />

            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock size={20} />}
              error={confirmPasswordError}
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              icon={!isLoading && <ArrowRight size={20} />}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </motion.form>
        );

      case "success":
        return (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-8"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle className="w-20 h-20 mx-auto text-green-500" />
            </motion.div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground">
                Password Reset Successful!
              </h3>
              <p className="text-muted-foreground">
                Your password has been reset successfully. You can now login
                with your new password.
              </p>
            </div>
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => (window.location.href = "/login")}
              icon={<ArrowRight size={20} />}
              className="w-full"
            >
              Go to Login
            </Button>
          </motion.div>
        );
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "email":
        return "Forgot Password?";
      case "otp":
        return "Verify OTP";
      case "reset":
        return "Reset Password";
      case "success":
        return "All Set!";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case "email":
        return "Enter your email address and we'll send you an OTP to reset your password";
      case "otp":
        return "Enter the 6-digit code sent to your email";
      case "reset":
        return "Create a new password for your account";
      case "success":
        return "";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
      {/* Left Side - Decorative */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="hidden lg:flex flex-col justify-center space-y-6 p-8"
      >
        <motion.div variants={slideUp}>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Reset Your
            <span className="block text-primary mt-2">Password</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Don't worry, we've got you covered
          </p>
        </motion.div>

        <motion.div variants={slideUp} className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Step 1</h3>
              <p className="text-sm text-muted-foreground">
                Enter your email address
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <KeyRound className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Step 2</h3>
              <p className="text-sm text-muted-foreground">
                Verify the OTP sent to your email
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Step 3</h3>
              <p className="text-sm text-muted-foreground">
                Create your new password
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Side - Form */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        <motion.div
          variants={slideUp}
          className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8 space-y-6"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              {getStepTitle()}
            </h2>
            {getStepDescription() && (
              <p className="text-muted-foreground">{getStepDescription()}</p>
            )}
          </div>

          {authError && currentStep !== "success" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Error</p>
                <p className="text-sm text-destructive/80 mt-1">{authError}</p>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

          {currentStep === "email" && (
            <p className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <a
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </a>
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
