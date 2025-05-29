import axios from 'axios';
import { V1_ORGANIZATION_URL } from './config';

const api = axios.create({
    baseURL: V1_ORGANIZATION_URL,
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

export const organizationApi = {
    createOrganization: async (data: {
        name: string;
        address: string;
        organization_type: string;
        num_of_facilities: number;
        num_of_cars: number;
        num_of_containers: number;
    }) => {
        try {
            console.log('Request initiated to create organization');
            const response = await api.post('/core/', data);
            return response.data;
        } catch (error) {
            console.error('Create organization error:', error);
            throw error;
        }
    },
    createTruck: async (data: {
        license_plate: string;
        car_type: string;
        capacity: number;
        status: string;
        location: string;
    }) => {
        try {
            console.log('Request initiated to create truck');
            const response = await api.post('/trucks/', data);
            return response.data;
        } catch (error) {
            console.error('Create truck error:', error);
            throw error;
        }
    },
    updateTruck: async (truckId: string, data: {
        license_plate: string;
        car_type: string;
        capacity: number;
        status: string;
        location: string;
    }) => {
        try {
            console.log('Request initiated to update truck');
            const response = await api.put(`/trucks/${truckId}/`, data);
            return response.data;
        } catch (error) {
            console.error('Update truck error:', error);
            throw error;
        }
    },
    deleteTruck: async (truckId: string) => {
        try {
            console.log('Request initiated to delete truck');
            const response = await api.delete(`/trucks/${truckId}/`);
            return response.data;
        } catch (error) {
            console.error('Delete truck error:', error);
            throw error;
        }
    },

    getTrucks: async () => {
        try {
            console.log('Request initiated to get trucks');
            const response = await api.get('/trucks/');
            return response.data;
        } catch (error) {
            console.error('Get trucks error:', error);
            throw error;
        }
    },
    createFacility: async (data: {
        name: string;
        address: string;
        facility_type: 'recycling' | 'treatment';
        capacity: number;
        contact_info?: string;
        operating_hours?: string;
    }) => {
        try {
            console.log('Request initiated to create facility');
            const response = await api.post('/facilities/', data);
            return response.data;
        } catch (error) {
            console.error('Create facility error:', error);
            throw error;
        }
    },
    updateFacility: async (facilityId: string, data: {
        name: string;
        address: string;
        facility_type: 'recycling' | 'treatment';
        capacity: number;
        contact_info?: string;
        operating_hours?: string;
    }) => {
        try {
            console.log('Request initiated to update facility');
            const response = await api.put(`/facilities/${facilityId}/`, data);
            return response.data;
        } catch (error) {
            console.error('Update facility error:', error);
            throw error;
        }
    },
    deleteFacility: async (facilityId: string) => {
        try {
            console.log('Request initiated to delete facility');
            const response = await api.delete(`/facilities/${facilityId}/`);
            return response.data;
        } catch (error) {
            console.error('Delete facility error:', error);
            throw error;
        }
    },
    getFacilities: async () => {
        try {
            console.log('Request initiated to get facilities');
            const response = await api.get('/facilities/');
            return response.data;
        } catch (error) {
            console.error('Get facilities error:', error);
            throw error;
        }
    },
};

