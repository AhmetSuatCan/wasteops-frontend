import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/userStore';
import { useJoinCode } from '../hooks/useJoinCode';

const OrganizationJoin: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [organizationCode, setOrganizationCode] = useState('');
    const { joinOrganization, isLoading, error: joinError } = useJoinCode();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await joinOrganization(organizationCode);
            navigate('/dashboard', { replace: true });
        } catch (error) {
            console.error('Error joining organization:', error);
        }
    };

    const handleCancel = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-md flex items-center justify-center min-h-[80vh]">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full">
                <h1 className="text-3xl font-bold text-center mb-4 text-brandGreen">
                    Organizasyona Katıl
                </h1>
                <p className="text-gray-600 text-center mb-8">
                    Yöneticiniz tarafından sağlanan organizasyon kodunu girin
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {joinError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{joinError}</span>
                            <button
                                type="button"
                                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                            >
                                <span className="sr-only">Kapat</span>
                                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    <div>
                        <label htmlFor="organizationCode" className="block text-sm font-medium text-gray-700 mb-1">
                            Organizasyon Kodu
                        </label>
                        <input
                            required
                            type="text"
                            id="organizationCode"
                            value={organizationCode}
                            onChange={(e) => setOrganizationCode(e.target.value.toUpperCase())}
                            className="w-full px-6 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandGreen uppercase text-center tracking-widest text-2xl placeholder:text-2xl"
                            placeholder="0 0 0 0 0 0"
                            maxLength={10}
                        />
                    </div>

                    <div className="flex justify-center space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brandGreen"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={!organizationCode.trim() || isLoading}
                            className="px-6 py-2 bg-brandGreen text-white rounded-md hover:bg-brandGreen/90 focus:outline-none focus:ring-2 focus:ring-brandGreen disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Katılıyor...' : 'Organizasyona Katıl'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrganizationJoin;
