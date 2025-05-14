import { IoIosArrowForward } from "react-icons/io";
import SideNavDropdown from "./SideNavDropdown";
import { sideNavItems } from "../layouts/dashboard/config";
import { memo, useState, useRef } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface SideNavigationProps {
    onToggle: (minimized: boolean) => void;
}

const SideNavigation = ({ onToggle }: SideNavigationProps) => {
    const [menuAnimation] = useAutoAnimate();
    const [minimize, setMinimize] = useState(window.innerWidth <= 768);
    const [isHovered, setIsHovered] = useState(false);
    const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

    const toggleSideNav = () => {
        setMinimize(!minimize);
        onToggle(!minimize);
    };

    const handleMouseEnter = () => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        hoverTimeout.current = setTimeout(() => setIsHovered(false), 3000);
    };

    return (
        <aside
            className={`fixed top-16 left-0 h-[calc(100vh-4rem)] border-r-2 border-gray-200 z-10 bg-white transition-[width] duration-300
            ${minimize ? "w-[1.15rem]" : "w-1/5 max-md:w-[calc(100%-1rem)] max-lg:w-1/4"}`}
            ref={menuAnimation}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {!minimize && (
                <>
                    <section className="flex flex-col items-center w-full h-5/6 overflow-y-auto">
                        {sideNavItems.map((navItem, i) => (
                            <SideNavDropdown key={i} {...navItem} onToggle={onToggle} />
                        ))}
                    </section>
                    <section className="flex items-center justify-center h-1/6">
                        <span className="text-sm text-center max-w-[70%]">
                            Welcome to WasteOps! We're here to help you manage your waste operations efficiently.
                        </span>
                    </section>
                </>
            )}
            <button
                className={`inline-flex items-center justify-center rounded-full size-8 border-gray-200 border-2 bg-white absolute top-6 hover:bg-gray-200 max-md:hover:bg-white transition-all duration-500 max-md:duration-150
                ${minimize ? "-right-4 rotate-0" : "-right-4 rotate-180"}
                ${isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                max-md:opacity-100 max-md:pointer-events-auto`}
                onClick={toggleSideNav}
            >
                <IoIosArrowForward className="size-4 text-gray-500" />
            </button>
        </aside>
    );
};

export default memo(SideNavigation);