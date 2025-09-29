import AsyncStorage from "@react-native-async-storage/async-storage";
// api.js

const API_URL = "https://a8a6c83b1819.ngrok-free.app/api";

// Existing registerUser function
export const registerUser = async ({ fullName, email, password }) => {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Registration failed");
    return data;
  } catch (error) {
    console.error("API error:", error.message);
    throw error;
  }
};

// New loginUser function
// Updated loginUser function
export const loginUser = async ({ email, password }) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      throw new Error("Server returned invalid JSON. Response: " + text);
    }

    if (!response.ok) throw new Error(data.error || "Login failed");

    return data;
  } catch (error) {
    console.error("API error:", error.message);
    throw error;
  }
};

// Update user profile
export const updateProfile = async ({
  email,
  cellNumber,
  address,
  bloodType,
  allergies,
  conditions,
  medicalAid,
  userRole,
  emergencyContacts,
}) => {
  try {
    const response = await fetch(`${API_URL}/users/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // optionally include auth token if needed:
      },
      body: JSON.stringify({
        email,
        cellNumber,
        address,
        bloodType,
        allergies,
        conditions,
        medicalAid,
        userRole,
        emergencyContacts,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Profile update failed");
    return data; // { message, user }
  } catch (error) {
    console.error("API error:", error.message);
    throw error;
  }
};

export const getMedicalAids = async () => {
  try {
    const response = await fetch(`${API_URL}/medical-aids`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || "Failed to fetch medical aids");

    return data.medicalAids;
  } catch (error) {
    console.error("API error:", error.message);
    throw error;
  }
};

// Get all blood types
export const getBloodTypes = async () => {
  try {
    const response = await fetch(`${API_URL}/blood/bloodTypes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok)
      throw new Error(data.error || "Failed to fetch blood types");
    return data; // [{ id, blood_id, type }, ...]
  } catch (error) {
    console.error("API error:", error.message);
    throw error;
  }
};
// Get user by email
export const getUserByEmail = async (email) => {
  try {
    const response = await fetch(
      `${API_URL}/users/${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Failed to fetch user");

    return data;
  } catch (error) {
    console.error("API error:", error.message);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_URL}/users/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // If using auth token:
        // Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Logout failed");

    // Clear local session storage (optional, but recommended in frontend)
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
    await AsyncStorage.removeItem("userEmail");

    return data; // { message: "Logout successful" }
  } catch (error) {
    console.error("API error:", error.message);
    throw error;
  }
};

export const changePassword = async ({ email, oldPassword, newPassword }) => {
  try {
    const token = await AsyncStorage.getItem("userToken");

    const response = await fetch(`${API_URL}/users/update-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ email, oldPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok)
      throw new Error(data.error || "Failed to change password");

    return data;
  } catch (error) {
    console.error("Change password API error:", error);
    throw error;
  }
};

// Get the notification by email of the user
export const getNotificationsByEmail = async (email) => {
  try {
    const response = await fetch(`${API_URL}/notifications/email/${email}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching notifications by email:", error);
    throw error;
  }
};

export const getEmergencyDetails = async () => {
  try {
    const response = await fetch(`${API_URL}/emergencies`);
    if (!response.ok) {
      throw new Error(
        console.error("Error fetching emergencies details", error)
      );
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching emergencies details", error);
    throw error;
  }
};

// api/Api.js
export const createNotification = async ({
  fromUserId,
  emergencyTypeId,
  latitude,
  longitude,
  city,
  country,
  description,
}) => {
  try {
    const response = await fetch(`${API_URL}/notifications/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fromUserId,
        emergencyTypeId,
        latitude,
        longitude,
        city,
        country,
        description,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create notification");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};
