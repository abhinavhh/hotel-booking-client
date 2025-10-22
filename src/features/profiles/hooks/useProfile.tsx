import { useState, useEffect } from "react";
import api from "../../../lib/api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  preferences?: {
    currency: string;
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  memberSince?: string;
  totalBookings?: number;
  loyaltyPoints?: number;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get("/profile");
      setProfile(response.data.profile);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to load profile";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await api.put("/profile", data);
      setProfile(response.data.profile);
      return { success: true, message: "Profile updated successfully" };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update profile";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUpdating(false);
    }
  };

  const changePassword = async (data: ChangePasswordData) => {
    setIsUpdating(true);
    setError(null);

    try {
      await api.post("/profile/change-password", data);
      return { success: true, message: "Password changed successfully" };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to change password";
      return { success: false, error: errorMessage };
    } finally {
      setIsUpdating(false);
    }
  };

  const updatePreferences = async (preferences: any) => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await api.put("/profile/preferences", preferences);
      setProfile(response.data.profile);
      return { success: true, message: "Preferences updated successfully" };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update preferences";
      return { success: false, error: errorMessage };
    } finally {
      setIsUpdating(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    setIsUpdating(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await api.post("/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile(response.data.profile);
      return { success: true, message: "Avatar updated successfully" };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to upload avatar";
      return { success: false, error: errorMessage };
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    isLoading,
    error,
    isUpdating,
    updateProfile,
    changePassword,
    updatePreferences,
    uploadAvatar,
    refreshProfile: fetchProfile,
  };
};
