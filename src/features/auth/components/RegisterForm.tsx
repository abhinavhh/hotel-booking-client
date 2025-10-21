import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useAuth, useFormValidation } from "../hooks/useAuth";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { slideUp, staggerContainer } from "../../../Animations/animation";
import { Link } from "react-router-dom";

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const {
    register,
    isLoading,
    error: authError,
    isAuthenticated,
    user,
    logout,
  } = useAuth();
  const { errors, validateEmail, validatePassword, clearErrors } =
    useFormValidation();

  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ): boolean => {
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const validateName = (name: string): boolean => {
    if (!name || name.trim().length === 0) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setConfirmPasswordError("");

    const isNameValid = validateName(formData.username);
    const isEmailValid = validateEmail(formData.email);
    const isPasswordValid = validatePassword(formData.password);
    const isConfirmPasswordValid = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );

    if (
      isNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    ) {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        console.log("Registration successful!", result.user);
        // You can redirect here if needed:
        // window.location.href = "/dashboard";
        // or use React Router: navigate("/dashboard");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    logout();
  };

  if (isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <Sparkles className="w-16 h-16 mx-auto text-primary" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground">Welcome!</h2>
        {user && (
          <p className="text-lg text-primary font-medium">
            {user.name || user.email}
          </p>
        )}
        <p className="text-muted-foreground">
          Your account has been created successfully.
        </p>
        <button onClick={handleLogout}>Log Out</button>
      </motion.div>
    );
  }

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
            Join Us at
            <span className="block text-primary mt-2">Hotel Booking</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Create your account and start your luxury journey
          </p>
        </motion.div>
      </motion.div>

      {/* Right Side - Register Form */}
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
              Create Account
            </h2>
            <p className="text-muted-foreground">
              Fill in your details to get started
            </p>
          </div>

          {authError && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">
                  Registration Failed
                </p>
                <p className="text-sm text-destructive/80 mt-1">{authError}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="username"
              type="text"
              placeholder="John Doe"
              value={formData.username}
              onChange={handleChange}
              icon={<User size={20} />}
              error={
                !formData.username && errors.email ? "Name is required" : ""
              }
              disabled={isLoading}
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              icon={<Mail size={20} />}
              error={errors.email}
              disabled={isLoading}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              icon={<Lock size={20} />}
              error={errors.password}
              disabled={isLoading}
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={<Lock size={20} />}
              error={confirmPasswordError}
              disabled={isLoading}
            />

            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary mt-0.5"
                disabled={isLoading}
                required
              />
              <span className="text-muted-foreground">
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              icon={!isLoading && <ArrowRight size={20} />}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login">
              <span className="text-primary font-medium hover:underline">
                Sign in
              </span>
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
