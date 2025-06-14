import axios from 'axios';
import { V1_OPERATIONS_URL } from './config';

const api = axios.create({
    baseURL: V1_OPERATIONS_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to attach access token from localStorage
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

interface Shift {
    name: string;
    route_id: number;
    team_id: number;
    start_time: string;
}

export const shiftApi = {
    getAllShifts: async () => {
        const response = await api.get('/shift/');
        return response.data;
    },
    getShift: async (id: string) => {
        const response = await api.get(`/shift/${id}/`);
        return response.data;
    },
    createShift: async (shift: Shift) => {
        const response = await api.post('/create-shift/', shift);
        return response.data;
    },
    getShiftsForTeam: async (teamId: string) => {
        const response = await api.get(`/get-shifts-for-team/${teamId}/`);
        return response.data;
    }
};

