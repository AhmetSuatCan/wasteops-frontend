import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../layouts/dashboard/Index.tsx"
import AuthForm from "../layouts/auth";
import ProtectedRoute from "./ProtectedRoute.tsx";

const router = createBrowserRouter([
    // Auth Layout
    {
        path: "/",
        element: <AuthForm />,
    },
    // Dashboard Layout
    {
        path: "/dashboard",
        element: <ProtectedRoute element={<Dashboard />} />
    }
    ,
    // Not Found Page
])


export default router

