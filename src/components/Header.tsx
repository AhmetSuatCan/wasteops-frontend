import React from 'react';
import ProfileCard from './ProfileCard';

const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-40 flex items-center px-8">
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800">WasteOps</h1>
                <ProfileCard />
            </div>
        </header>
    );
};

export default Header; 