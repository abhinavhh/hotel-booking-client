import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Bell,
  Globe,
  Camera,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { DashboardSidebar } from "../../dashboard/components/DashboardSidebar";
import { useProfile } from "../hooks/useProfile";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

type TabType = "personal" | "security" | "preferences";

export const ProfilePage: React.FC = () => {
  const {
    profile,
    isLoading,
    error,
    isUpdating,
    updateProfile,
    changePassword,
    updatePreferences,
    uploadAvatar,
  } = useProfile();

  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [personalData, setPersonalData] = useState({
    name: "",
    phone: "",
    dateOfBirth: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState({
    currency: "USD",
    language: "en",
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });

  React.useEffect(() => {
    if (profile) {
      setPersonalData({
        name: profile.name || "",
        phone: profile.phone || "",
        dateOfBirth: profile.dateOfBirth || "",
        street: profile.address?.street || "",
        city: profile.address?.city || "",
        state: profile.address?.state || "",
        country: profile.address?.country || "",
        zipCode: profile.address?.zipCode || "",
      });

      if (profile.preferences) {
        setPreferences({
          currency: profile.preferences.currency || "USD",
          language: profile.preferences.language || "en",
          emailNotifications: profile.preferences.notifications?.email ?? true,
          smsNotifications: profile.preferences.notifications?.sms ?? false,
          pushNotifications: profile.preferences.notifications?.push ?? true,
        });
      }
    }
  }, [profile]);

  const handlePersonalDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalData({ ...personalData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSavePersonalInfo = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    const result = await updateProfile({
      name: personalData.name,
      phone: personalData.phone,
      dateOfBirth: personalData.dateOfBirth,
      address: {
        street: personalData.street,
        city: personalData.city,
        state: personalData.state,
        country: personalData.country,
        zipCode: personalData.zipCode,
      },
    });

    if (result.success) {
      setSuccessMessage(result.message || "Profile updated successfully");
    } else {
      setErrorMessage(result.error || "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const result = await changePassword(passwordData);

    if (result.success) {
      setSuccessMessage(result.message || "Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setErrorMessage(result.error || "Failed to change password");
    }
  };

  const handleSavePreferences = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    const result = await updatePreferences({
      currency: preferences.currency,
      language: preferences.language,
      notifications: {
        email: preferences.emailNotifications,
        sms: preferences.smsNotifications,
        push: preferences.pushNotifications,
      },
    });

    if (result.success) {
      setSuccessMessage(result.message || "Preferences updated successfully");
    } else {
      setErrorMessage(result.error || "Failed to update preferences");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadAvatar(file);
    if (result.success) {
      setSuccessMessage(result.message || "Avatar updated successfully");
    } else {
      setErrorMessage(result.error || "Failed to upload avatar");
    }
  };

  const tabs = [
    { id: "personal" as TabType, label: "Personal Info", icon: User },
    { id: "security" as TabType, label: "Security", icon: Lock },
    { id: "preferences" as TabType, label: "Preferences", icon: Globe },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardSidebar currentPath="/profile" />
        <div className="lg:ml-64">
          <div className="p-4 md:p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-32 bg-card/50 rounded-xl" />
              <div className="h-96 bg-card/50 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar currentPath="/profile" />

      <div className="lg:ml-64">
        <div className="p-4 md:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Profile Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your account information and preferences
            </p>
          </motion.div>

          {/* Success/Error Messages */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-600">{successMessage}</p>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{errorMessage}</p>
            </motion.div>
          )}

          {/* Profile Card with Avatar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-2xl p-6 mb-6 border border-primary/20"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/80 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold text-foreground">
                  {profile?.name}
                </h2>
                <p className="text-muted-foreground flex items-center gap-2 justify-center md:justify-start mt-1">
                  <Mail className="w-4 h-4" />
                  {profile?.email}
                </p>
                {profile?.memberSince && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Member since{" "}
                    {new Date(profile.memberSince).toLocaleDateString()}
                  </p>
                )}
              </div>

              {profile?.loyaltyPoints !== undefined && (
                <div className="bg-card/80 backdrop-blur-xl rounded-xl p-4 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">
                    Loyalty Points
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {profile.loyaltyPoints}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border overflow-hidden"
          >
            {/* Tab Headers */}
            <div className="flex border-b border-border overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSuccessMessage("");
                      setErrorMessage("");
                    }}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-primary border-b-2 border-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      name="name"
                      type="text"
                      value={personalData.name}
                      onChange={handlePersonalDataChange}
                      icon={<User size={20} />}
                      disabled={isUpdating}
                    />

                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={personalData.phone}
                      onChange={handlePersonalDataChange}
                      icon={<Phone size={20} />}
                      disabled={isUpdating}
                    />

                    <Input
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={personalData.dateOfBirth}
                      onChange={handlePersonalDataChange}
                      icon={<Calendar size={20} />}
                      disabled={isUpdating}
                    />

                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={profile?.email || ""}
                      icon={<Mail size={20} />}
                      disabled
                    />
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Address Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <Input
                          label="Street Address"
                          name="street"
                          type="text"
                          value={personalData.street}
                          onChange={handlePersonalDataChange}
                          icon={<MapPin size={20} />}
                          disabled={isUpdating}
                        />
                      </div>

                      <Input
                        label="City"
                        name="city"
                        type="text"
                        value={personalData.city}
                        onChange={handlePersonalDataChange}
                        disabled={isUpdating}
                      />

                      <Input
                        label="State/Province"
                        name="state"
                        type="text"
                        value={personalData.state}
                        onChange={handlePersonalDataChange}
                        disabled={isUpdating}
                      />

                      <Input
                        label="Country"
                        name="country"
                        type="text"
                        value={personalData.country}
                        onChange={handlePersonalDataChange}
                        disabled={isUpdating}
                      />

                      <Input
                        label="Zip/Postal Code"
                        name="zipCode"
                        type="text"
                        value={personalData.zipCode}
                        onChange={handlePersonalDataChange}
                        disabled={isUpdating}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleSavePersonalInfo}
                      icon={<Save size={20} />}
                      isLoading={isUpdating}
                      disabled={isUpdating}
                    >
                      Save Changes
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Change Password
                    </h3>
                    <div className="space-y-4 max-w-md">
                      <Input
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        icon={<Lock size={20} />}
                        disabled={isUpdating}
                      />

                      <Input
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        icon={<Lock size={20} />}
                        disabled={isUpdating}
                      />

                      <Input
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        icon={<Lock size={20} />}
                        disabled={isUpdating}
                      />

                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handleChangePassword}
                        icon={<Save size={20} />}
                        isLoading={isUpdating}
                        disabled={isUpdating}
                        className="w-full"
                      >
                        Update Password
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Regional Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Currency
                        </label>
                        <select
                          value={preferences.currency}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              currency: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          disabled={isUpdating}
                        >
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                          <option value="INR">INR - Indian Rupee</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Language
                        </label>
                        <select
                          value={preferences.language}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              language: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          disabled={isUpdating}
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notification Preferences
                    </h3>
                    <div className="space-y-4 max-w-2xl">
                      <label className="flex items-center justify-between p-4 bg-background rounded-xl border border-border cursor-pointer hover:bg-primary/5 transition-colors">
                        <div>
                          <p className="font-medium text-foreground">
                            Email Notifications
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Receive booking confirmations and updates via email
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.emailNotifications}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              emailNotifications: e.target.checked,
                            })
                          }
                          className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                          disabled={isUpdating}
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-background rounded-xl border border-border cursor-pointer hover:bg-primary/5 transition-colors">
                        <div>
                          <p className="font-medium text-foreground">
                            SMS Notifications
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Get text messages for important updates
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.smsNotifications}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              smsNotifications: e.target.checked,
                            })
                          }
                          className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                          disabled={isUpdating}
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-background rounded-xl border border-border cursor-pointer hover:bg-primary/5 transition-colors">
                        <div>
                          <p className="font-medium text-foreground">
                            Push Notifications
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Receive push notifications on your device
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.pushNotifications}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              pushNotifications: e.target.checked,
                            })
                          }
                          className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                          disabled={isUpdating}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleSavePreferences}
                      icon={<Save size={20} />}
                      isLoading={isUpdating}
                      disabled={isUpdating}
                    >
                      Save Preferences
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
