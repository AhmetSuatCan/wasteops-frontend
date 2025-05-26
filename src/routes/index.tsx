import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../layouts/dashboard/Index";
import AuthForm from "../layouts/auth/Index";
import ProtectedRoute from "./ProtectedRoute.tsx";
import { Facilities } from '../pages/facilities.tsx';
import OrganizationCreate from "../pages/organizationCreate.tsx";
import OrganizationJoin from "../pages/organizationJoin.tsx";
import { Fleet } from "../pages/Fleet.tsx";
import JoiningCode from "../pages/JoiningCode.tsx";
import Employment from "../pages/Employment.tsx";

const router = createBrowserRouter([
    // Auth Layout
    {
        path: "/",
        element: <AuthForm />,
    },
    // Organization Routes
    {
        path: "/create-organization",
        element: <ProtectedRoute element={<OrganizationCreate />} />,
    },
    {
        path: "/join-organization",
        element: <ProtectedRoute element={<OrganizationJoin />} />,
    },
    // Dashboard Layout
    {
        path: "/dashboard",
        element: <ProtectedRoute element={<Dashboard />} />,
        children: [
            {
                path: "tesisler",
                element: <Facilities />,
            },
            {
                path: "insan-kaynaklari/kodlar",
                element: <JoiningCode />,
            }, {
                path: "insan-kaynaklari/calisanlar",
                element: <Employment />,
            }, {
                path: "filo",
                element: <Fleet />,
            },
        ],
    },
]);

export default router;

