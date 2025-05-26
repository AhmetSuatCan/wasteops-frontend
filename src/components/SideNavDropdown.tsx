import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { IconType } from 'react-icons';

interface SideNavDropdownProps {
    title: string;
    path: string;
    icon: IconType;
    children?: { title: string; path: string; icon: IconType }[];
    onToggle?: (minimized: boolean) => void;
}

const SideNavDropdown = ({ title, path, icon: Icon, children, onToggle }: SideNavDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const isActive = location.pathname === path || (children && children.some(child => child.path === location.pathname));

    const handleClick = () => {
        if (children) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="w-full pt-4">
            <div
                className={`flex items-center justify-between px-6 py-3 cursor-pointer transition-colors duration-200
                ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={handleClick}
            >
                <Link
                    to={path}
                    className="flex-1 flex items-center gap-3 text-lg font-medium text-gray-700"
                    onClick={(e) => {
                        if (children) {
                            e.preventDefault();
                        }
                    }}
                >
                    <Icon className="text-xl text-gray-600" />
                    {title}
                </Link>
                {children && (
                    <IoIosArrowDown
                        className={`transform transition-transform duration-200 text-gray-500 ${isOpen ? 'rotate-180' : ''}`}
                    />
                )}
            </div>
            {children && isOpen && (
                <div className="pl-12">
                    {children.map((child, index) => {
                        const ChildIcon = child.icon;
                        const isChildActive = location.pathname === child.path;
                        return (
                            <Link
                                key={index}
                                to={child.path}
                                className={`block py-3 px-6 text-base text-gray-600 transition-colors duration-200 flex items-center gap-3
                                ${isChildActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                            >
                                <ChildIcon className="text-lg text-gray-500" />
                                {child.title}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SideNavDropdown; 