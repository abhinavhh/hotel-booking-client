import React, { useState, useEffect } from "react";
import {
  Save,
  Mail,
  CreditCard,
  Percent,
  DollarSign,
  Bell,
  Shield,
  Globe,
} from "lucide-react";
import { AdminSidebar } from "../components/AdminSidebar";
import { useAdminSettings } from "../hooks/useAdmin";
import type { Settings } from "../types/admin.types";

const AdminSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [localSettings, setLocalSettings] = useState<Settings | null>(null);

  const { settings, loading, error, updateSettings } = useAdminSettings();

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    if (!localSettings) return;

    setSaving(true);
    const result = await updateSettings(localSettings);
    setSaving(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      alert(result.error || "Failed to save settings");
    }
  };

  const handleChange = (section: keyof Settings, field: string, value: any) => {
    if (!localSettings) return;

    setLocalSettings((prev) => {
      if (!prev) return prev;
      const sectionObj = (prev[section] as Record<string, any>) || {};
      return {
        ...prev,
        [section]: {
          ...sectionObj,
          [field]: value,
        },
      } as Settings;
    });
  };

  const getNotificationDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      emailNotifications: "Receive email notifications for important events",
      bookingConfirmation: "Send confirmation emails for new bookings",
      paymentReceived: "Notify when payments are received",
      cancellationAlerts: "Alert on booking cancellations",
      reviewSubmitted: "Notify when new reviews are submitted",
      systemUpdates: "Receive notifications about system updates",
    };
    return descriptions[key] || "Enable or disable this notification type";
  };

  const tabs = [
    { id: "general", name: "General", icon: Globe },
    { id: "email", name: "Email", icon: Mail },
    { id: "payment", name: "Payment", icon: CreditCard },
    { id: "commission", name: "Commission", icon: Percent },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !localSettings) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">{error || "Failed to load settings"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Settings
              </h1>
              <p className="text-gray-600">
                Manage your platform configuration and preferences
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
              <span className="text-xl">✓</span>
              <span>Settings saved successfully!</span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Tabs Sidebar */}
            <div className="lg:w-64">
              <div className="bg-white rounded-lg shadow-sm p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* General Settings */}
                {activeTab === "general" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      General Settings
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site Name *
                        </label>
                        <input
                          type="text"
                          value={localSettings.general.siteName}
                          onChange={(e) =>
                            handleChange("general", "siteName", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site URL
                        </label>
                        <input
                          type="url"
                          value={localSettings.general.siteUrl || ""}
                          onChange={(e) =>
                            handleChange("general", "siteUrl", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Support Email
                        </label>
                        <input
                          type="email"
                          value={localSettings.general.supportEmail || ""}
                          onChange={(e) =>
                            handleChange(
                              "general",
                              "supportEmail",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="support@example.com"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Currency *
                          </label>
                          <select
                            value={localSettings.general.currency}
                            onChange={(e) =>
                              handleChange(
                                "general",
                                "currency",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="INR">INR - Indian Rupee</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone *
                          </label>
                          <select
                            value={localSettings.general.timezone}
                            onChange={(e) =>
                              handleChange(
                                "general",
                                "timezone",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="Asia/Kolkata">
                              Asia/Kolkata (IST)
                            </option>
                            <option value="America/New_York">
                              America/New York (EST)
                            </option>
                            <option value="Europe/London">
                              Europe/London (GMT)
                            </option>
                            <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                            <option value="Australia/Sydney">
                              Australia/Sydney (AEST)
                            </option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select
                          value={localSettings.general.language || "en"}
                          onChange={(e) =>
                            handleChange("general", "language", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Settings */}
                {activeTab === "email" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Email Configuration
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Provider
                        </label>
                        <select
                          value={localSettings.email?.provider || "smtp"}
                          onChange={(e) =>
                            handleChange("email", "provider", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="smtp">SMTP</option>
                          <option value="sendgrid">SendGrid</option>
                          <option value="mailgun">Mailgun</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Host
                          </label>
                          <input
                            type="text"
                            value={localSettings.email?.smtpHost || ""}
                            onChange={(e) =>
                              handleChange("email", "smtpHost", e.target.value)
                            }
                            placeholder="smtp.gmail.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Port
                          </label>
                          <input
                            type="text"
                            value={localSettings.email?.smtpPort || ""}
                            onChange={(e) =>
                              handleChange("email", "smtpPort", e.target.value)
                            }
                            placeholder="587"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Username
                        </label>
                        <input
                          type="text"
                          value={localSettings.email?.smtpUser || ""}
                          onChange={(e) =>
                            handleChange("email", "smtpUser", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Password
                        </label>
                        <input
                          type="password"
                          value={localSettings.email?.smtpPassword || ""}
                          onChange={(e) =>
                            handleChange(
                              "email",
                              "smtpPassword",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            From Email
                          </label>
                          <input
                            type="email"
                            value={localSettings.email?.fromEmail || ""}
                            onChange={(e) =>
                              handleChange("email", "fromEmail", e.target.value)
                            }
                            placeholder="noreply@example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            From Name
                          </label>
                          <input
                            type="text"
                            value={localSettings.email?.fromName || ""}
                            onChange={(e) =>
                              handleChange("email", "fromName", e.target.value)
                            }
                            placeholder="HotelBooking Pro"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Settings */}
                {activeTab === "payment" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Payment Gateway Configuration
                    </h2>
                    <div className="space-y-6">
                      {/* Stripe */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                            <h3 className="font-semibold text-gray-900">
                              Stripe
                            </h3>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={
                                localSettings.payment?.stripeEnabled || false
                              }
                              onChange={(e) =>
                                handleChange(
                                  "payment",
                                  "stripeEnabled",
                                  e.target.checked
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Stripe Public Key"
                            value={localSettings.payment?.stripePublicKey || ""}
                            onChange={(e) =>
                              handleChange(
                                "payment",
                                "stripePublicKey",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="password"
                            placeholder="Stripe Secret Key"
                            value={localSettings.payment?.stripeSecretKey || ""}
                            onChange={(e) =>
                              handleChange(
                                "payment",
                                "stripeSecretKey",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Razorpay */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                            <h3 className="font-semibold text-gray-900">
                              Razorpay
                            </h3>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={
                                localSettings.payment?.razorpayEnabled || false
                              }
                              onChange={(e) =>
                                handleChange(
                                  "payment",
                                  "razorpayEnabled",
                                  e.target.checked
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Razorpay Key ID"
                            value={localSettings.payment?.razorpayKeyId || ""}
                            onChange={(e) =>
                              handleChange(
                                "payment",
                                "razorpayKeyId",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="password"
                            placeholder="Razorpay Key Secret"
                            value={
                              localSettings.payment?.razorpayKeySecret || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                "payment",
                                "razorpayKeySecret",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Commission Settings */}
                {activeTab === "commission" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Commission & Fees
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Platform Commission (%) *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={localSettings.commission.platformFee}
                            onChange={(e) =>
                              handleChange(
                                "commission",
                                "platformFee",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                            max="100"
                            step="0.1"
                          />
                          <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Commission charged on each booking
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tax Rate (%) *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={localSettings.commission.taxRate}
                            onChange={(e) =>
                              handleChange(
                                "commission",
                                "taxRate",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                            max="100"
                            step="0.1"
                          />
                          <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          GST or VAT applied to bookings
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cancellation Fee (%)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={
                              localSettings.commission.cancellationFee || 0
                            }
                            onChange={(e) =>
                              handleChange(
                                "commission",
                                "cancellationFee",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                            max="100"
                            step="0.1"
                          />
                          <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Fee charged on cancellations
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Refund Processing Days
                        </label>
                        <input
                          type="number"
                          value={
                            localSettings.commission.refundProcessingDays || 7
                          }
                          onChange={(e) =>
                            handleChange(
                              "commission",
                              "refundProcessingDays",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="1"
                          max="30"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Days to process refund requests
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeTab === "notifications" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Notification Preferences
                    </h2>
                    <div className="space-y-4">
                      {Object.entries(localSettings.notifications || {}).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between py-3 border-b border-gray-200"
                          >
                            <div>
                              <p className="font-medium text-gray-900">
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .trim()
                                  .replace(/^./, (str) => str.toUpperCase())}
                              </p>
                              <p className="text-sm text-gray-500">
                                {getNotificationDescription(key)}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value as boolean}
                                onChange={(e) =>
                                  handleChange(
                                    "notifications",
                                    key,
                                    e.target.checked
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === "security" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Security Settings
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="font-medium text-gray-900">
                            Two-Factor Authentication
                          </p>
                          <p className="text-sm text-gray-500">
                            Require 2FA for admin accounts
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              localSettings.security?.twoFactorAuth || false
                            }
                            onChange={(e) =>
                              handleChange(
                                "security",
                                "twoFactorAuth",
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          value={localSettings.security?.sessionTimeout || 30}
                          onChange={(e) =>
                            handleChange(
                              "security",
                              "sessionTimeout",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="5"
                          max="120"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Login Attempts
                        </label>
                        <input
                          type="number"
                          value={localSettings.security?.maxLoginAttempts || 5}
                          onChange={(e) =>
                            handleChange(
                              "security",
                              "maxLoginAttempts",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="3"
                          max="10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Minimum Length
                        </label>
                        <input
                          type="number"
                          value={localSettings.security?.passwordMinLength || 8}
                          onChange={(e) =>
                            handleChange(
                              "security",
                              "passwordMinLength",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="6"
                          max="20"
                        />
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="font-medium text-gray-900">
                            Require Special Characters
                          </p>
                          <p className="text-sm text-gray-500">
                            Password must include special characters
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              localSettings.security?.requireSpecialChar ||
                              false
                            }
                            onChange={(e) =>
                              handleChange(
                                "security",
                                "requireSpecialChars",
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div
                            className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
                              rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white
                              after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300
                              after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                          ></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Save Button for Mobile */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg
                       hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
