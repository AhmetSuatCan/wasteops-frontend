import { Outlet, useLocation } from "react-router-dom";
import SideNavigation from "../../components/SideNavigation";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
    const [isSideNavMinimized, setIsSideNavMinimized] = useState(window.innerWidth <= 768);
    const [welcomeLoader, setWelcomeLoader] = useState(() => !!localStorage.getItem("LoginSuccessfully"));
    const [loading, setLoading] = useState(false);
    const loaderDurations = {
        welcome: 2000,
        general: 1000
    };

    const { pathname } = useLocation();

    const handleToggle = (minimized: boolean) => setIsSideNavMinimized(minimized);

    // A general function to manage loader states
    const manageLoader = (condition: boolean, setState: (value: boolean) => void, duration: number, onEnd?: () => void) => {
        document.documentElement.style.setProperty('--loader-duration', `${duration}ms`);
        if (condition) {
            const timer = setTimeout(() => {
                setState(false);
                if (onEnd) onEnd();
            }, duration);
            return () => clearTimeout(timer);
        }
    };

    // Welcome loader on initial login
    useEffect(() => {
        manageLoader(welcomeLoader, setWelcomeLoader, loaderDurations.welcome, () => {
            localStorage.removeItem("LoginSuccessfully");
        });
    }, [welcomeLoader]);

    // Loader during page transitions
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, loaderDurations.general);

        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <>
            {loading && (
                <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            )}
            <section className="flex relative">
                <Header />
                <SideNavigation onToggle={handleToggle} />
                <main
                    className={`flex flex-col w-full mt-16 transition-all duration-300 max-md:ml-4
                    ${isSideNavMinimized ? 'ml-4' : 'ml-[20%] max-lg:ml-[25%]'}`}
                >
                    <ToastContainer />
                    <Outlet context={{ setLoading }} />
                </main>
            </section>
        </>
    );
};

export default Dashboard;
