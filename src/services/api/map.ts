import axios from 'axios';
import { V1_MAP_URL } from './config';

const api = axios.create({
    baseURL: V1_MAP_URL,
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

interface Node {
    container_id: number;
    order: number;
}

export const mapApi = {
    getContainers: async () => {
        const response = await api.get('/containers/');
        return response.data;
    },
    getRoutes: async () => {
        const response = await api.get('/routes/');
        return response.data;
    },
    createContainer: async (data: {
        name: string;
        address: string;
        latitude: number;
        longitude: number;
    }) => {
        console.log('Creating container:', data);
        const response = await api.post('/containers/', data);
        return response.data;
    },
    deleteContainer: async (id: number) => {
        const response = await api.delete(`/containers/${id}/`);
        return response.data;
    },
    createRoute: async (data: {
        name: string;
    }) => {
        const response = await api.post('/routes/', data);
        return response.data;
    },
    deleteRoute: async (id: number) => {
        const response = await api.delete(`/routes/${id}/`);
        return response.data;
    },
    createNodes: async (data: {
        route_id: number;
        nodes: Node[];
    }) => {
        console.log('Creating nodes:', data);
        const response = await api.post('/route-nodes/bulk/', data);
        return response.data;
    },
};

