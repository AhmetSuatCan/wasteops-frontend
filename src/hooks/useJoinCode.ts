import { useState } from 'react';
import { humanResourcesApi } from '../services/api/humanResources';
import { useAuthStore } from '../store/userStore';
import { authApi } from '../services/api/auth';

interface Code {
    code: string;
    created_at: string;
    expires_at: string;
}

interface UseJoinCodeReturn {
    joinOrganization: (code: string) => Promise<void>;
    generateCode: () => Promise<Code>;
    getCodes: () => Promise<Code[]>;
    expireCode: (code: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export const useJoinCode = (): UseJoinCodeReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const user = useAuthStore(state => state.user);

    const joinOrganization = async (code: string) => {
        setIsLoading(true);
        setError(null);

        try {
            await humanResourcesApi.useCode(code);

            // After joining the organization, fetch the updated organization data
            if (user?.role === 'E') {
                const organizationData = await authApi.checkActiveEmployment();
                useAuthStore.setState({ organization: organizationData });
            }
        } catch (error) {
            setError('Organizasyona katılma başarısız oldu. Lütfen kodu kontrol edip tekrar deneyin.');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const generateCode = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await humanResourcesApi.generateCode();
            return response;
        } catch (error) {
            setError('Kod oluşturma başarısız oldu. Lütfen tekrar deneyin.');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const getCodes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await humanResourcesApi.getCodes();
            return response;
        } catch (error) {
            setError('Kodları getirme başarısız oldu. Lütfen tekrar deneyin.');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const expireCode = async (code: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await humanResourcesApi.expireCode(code);
        } catch (error) {
            setError('Kod iptal etme başarısız oldu. Lütfen tekrar deneyin.');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        joinOrganization,
        generateCode,
        getCodes,
        expireCode,
        isLoading,
        error
    };
};
