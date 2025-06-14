import { Outlet, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const UserDashboard = () => {
    const [loading, setLoading] = useState(false);
    const { pathname } = useLocation();
    const loaderDuration = 1000;

    // Loader during page transitions
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, loaderDuration);

        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <>
            <section className="flex relative">
                <Header />
                <main className="flex flex-col w-full mt-16 ml-4 relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                        </div>
                    )}
                    <ToastContainer />
                    <Outlet context={{ setLoading }} />
                </main>
            </section>
        </>
    );
};

export default UserDashboard; 