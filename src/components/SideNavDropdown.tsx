import { Link } from 'react-router-dom';
import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

interface SideNavDropdownProps {
    title: string;
    path: string;
    children?: { title: string; path: string }[];
    onToggle?: (minimized: boolean) => void;
}

const SideNavDropdown = ({ title, path, children, onToggle }: SideNavDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        if (children) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="w-full">
            <div
                className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={handleClick}
            >
                <Link
                    to={path}
                    className="flex-1"
                    onClick={(e) => {
                        if (children) {
                            e.preventDefault();
                        }
                    }}
                >
                    {title}
                </Link>
                {children && (
                    <IoIosArrowDown
                        className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                            }`}
                    />
                )}
            </div>
            {children && isOpen && (
                <div className="pl-4">
                    {children.map((child, index) => (
                        <Link
                            key={index}
                            to={child.path}
                            className="block py-2 px-4 hover:bg-gray-100"
                        >
                            {child.title}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SideNavDropdown; 