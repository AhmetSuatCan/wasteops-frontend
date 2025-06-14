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

export const teamsApi = {
    createTeam: async (data: {
        name: string;
        status: string;
    }) => {
        const response = await api.post('/team/', data);
        return response.data;
    },
    updateTeam: async (data: {
        id: string;
        name: string;
    }) => {
        const response = await api.patch(`/team/${data.id}/`, data);
        return response.data;
    },
    disbandTeam: async (id: string) => {
        const response = await api.patch(`/team/${id}/disband/`);
        return response.data;
    },
    getUnteamedEmployee: async () => {
        const response = await api.get('/unteamed-employees/');
        return response.data;
    },
    addEmployeeToTeam: async (data: {
        employment_id: string;
        team_id: string;
        role: string;
    }) => {
        console.log('Adding employee to team:', data);
        const response = await api.post('/teaming-employee/', data);
        return response.data;
    },
    removeEmployeeFromTeam: async (data: {
        id: string;
    }) => {
        //UserTeam id is data.id.
        const response = await api.patch(`/teaming-employee/${data.id}/remove/`);
        return response.data;
    },
    getTeam: async (id: string) => {
        const response = await api.get(`/team/${id}/`);
        return response.data;
    },
    getAllTeams: async () => {
        const response = await api.get('/team/');
        return response.data;
    },
    getTeamMembers: async (id: string) => {
        //Team id is id.
        const response = await api.get(`/team/${id}/members/`);
        return response.data;
    },
    getActiveTeamId: async (employmentId: string) => {
        const response = await api.get(`/get-active-team-id/?employment_id=${employmentId}`);
        return response.data;
    }

};

