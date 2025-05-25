import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../layouts/dashboard/Index";
import AuthForm from "../layouts/auth";
import ProtectedRoute from "./ProtectedRoute.tsx";
import Facilities from '../pages/facilities';

const router = createBrowserRouter([
    // Auth Layout
    {
        path: "/",
        element: <AuthForm />,
    },
    // Dashboard Layout
    {
        path: "/dashboard",
        element: <ProtectedRoute element={<Dashboard />} />,
        children: [
            {
                index: true,
                element: <Facilities />
            }
        ]
    }
]);

export default router;

