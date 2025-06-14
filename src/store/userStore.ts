import { create } from 'zustand';
import { authApi, RegisterData, Organization } from '../services/api/auth';

interface User {
    id: string;
    email: string;
    name: string;
    gender: string;
    age: number;
    role: 'A' | 'E';
    phone_number: string;
    address: string;
    is_active: boolean;
    is_staff: boolean;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    organization: Organization | null;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    organization: null,

    login: async (email, password) => {
        console.log('its doing login')
        try {
            const data = await authApi.login(email, password);
            console.log(data)

            // Save tokens to localStorage
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);

            const userData = await authApi.getUser();
            console.log(userData)

            // Role-based organization data fetching
            let organizationData = null;
            try {
                if (userData.role === 'A') {
                    organizationData = await authApi.checkOwnedOrganization();
                } else if (userData.role === 'E') {
                    organizationData = await authApi.checkActiveEmployment();
                }
            } catch (error: any) {
                // If it's a 404 error, it means no organization exists
                // This is expected for new users, so we don't treat it as an error
                if (error.response?.status !== 404) {
                    console.error('Error fetching organization data:', error);
                }
                // organizationData remains null
            }
            console.log(`organizationData: ${organizationData.id}`)

            set({
                user: userData,
                isAuthenticated: true,
                isLoading: false,
                organization: organizationData
            });
        } catch (error) {
            console.error('Login failed:', error);
            set({ isLoading: false });
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const data = await authApi.register(userData);

            // Save tokens to localStorage
            localStorage.setItem('accessToken', data.tokens.access);
            localStorage.setItem('refreshToken', data.tokens.refresh);

            set({
                user: data.user,
                isAuthenticated: true,
                isLoading: false,
                organization: null // New users won't have an organization initially
            });
        } catch (error) {
            console.error('Registration failed:', error);
            set({ isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        try {
            // Clear tokens from localStorage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                organization: null
            });
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    },

    checkAuth: async () => {
        try {
            set({ isLoading: true });

            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                set({ isAuthenticated: false, user: null, isLoading: false, organization: null });
                return false;
            }

            const userData = await authApi.getUser();

            // Role-based organization data fetching
            let organizationData = null;
            try {
                if (userData.role === 'A') {
                    organizationData = await authApi.checkOwnedOrganization();
                } else if (userData.role === 'E') {
                    organizationData = await authApi.checkActiveEmployment();
                }
            } catch (error: any) {
                // If it's a 404 error, it means no organization exists
                // This is expected for new users, so we don't treat it as an error
                if (error.response?.status !== 404) {
                    console.error('Error fetching organization data:', error);
                }
                // organizationData remains null
            }

            set({
                isAuthenticated: true,
                user: userData,
                isLoading: false,
                organization: organizationData
            });

            return true;
        } catch (error) {
            console.error('Auth check failed:', error);
            set({ isAuthenticated: false, user: null, isLoading: false, organization: null });
            return false;
        }
    },
}));
