import React from 'react';

const ProfileCard = () => {
    return (
        <div className="relative group">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">JD</span>
                </div>
                <span className="text-gray-700">John Doe</span>
            </button>

            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
            </div>
        </div>
    );
};

export default ProfileCard; 