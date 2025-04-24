// src/api/config.js
export const API_BASE = 'https://ee5cbf72-71a4-4ba9-8e80-52f41c2316f9.mock.pstmn.io';

export const ENDPOINTS = {
    getEvents: `${API_BASE}/getevents`,
    getGifts: `${API_BASE}/getgifts`,
    getFeedbacks: `${API_BASE}/getfeedbacks`,
    // (POST/PUT 쓰실 땐 같은 URL에 method만 바꾸시면 됩니다)
};
