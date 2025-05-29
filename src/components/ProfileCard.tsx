import React, { useState } from 'react';
import { useAuthStore } from '../store/userStore';
import { useNavigate } from 'react-router-dom';

const ProfileCard = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    console.log(user)

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleProfileClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsProfileModalOpen(true);
        setIsDropdownOpen(false);
    };

    if (!user) return null;

    return (
        <>
            <div
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
            >
                <button className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">{getInitials(user.name)}</span>
                    </div>
                    <span className="text-gray-700">{user.name}</span>
                </button>

                {/* Dropdown menu */}
                <div
                    className={`absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 transition-all duration-200 ${isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                        }`}
                >
                    <button
                        onClick={handleProfileClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Profil
                    </button>
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Çıkış Yap
                    </button>
                </div>
            </div>

            {/* Profile Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">Profil Bilgileri</h2>
                            <button
                                onClick={() => setIsProfileModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-brandGreen/10 flex items-center justify-center">
                                    <span className="text-2xl font-medium text-brandGreen">{getInitials(user.name)}</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-medium text-gray-800">{user.name}</h3>
                                    <p className="text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Rol</label>
                                    <p className="text-gray-800 font-medium">{user.role === 'A' ? 'Yönetici' : 'Çalışan'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <label className="block text-sm font-medium text-gray-500 mb-1">E-posta</label>
                                    <p className="text-gray-800 font-medium">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileCard; 