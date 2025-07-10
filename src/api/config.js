// src/api/config.js
export const API_BASE = "https://rewftufssxzqgdqrsqlz.functions.supabase.co";

export const ENDPOINTS = {
  getUserEvents: `${API_BASE}/get-user-events`,
  getUserEventDetail: `${API_BASE}/get-user-event-detail`,
  createUserEvent: `${API_BASE}/create-user-event`,
  createGiftOption: `${API_BASE}/create-gift-option`,
  createGiftRequest: `${API_BASE}/create-gift-request`,
  updateUserEvent: `${API_BASE}/update-user-event`,
  deleteGiftOption: `${API_BASE}/delete-gift-option`,
  deleteUserEvent: `${API_BASE}/delete-user-event`,
};
