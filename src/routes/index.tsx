import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../layouts/dashboard/Index";
import AuthForm from "../layouts/auth/Index";
import ProtectedRoute from "./ProtectedRoute.tsx";
import { Facilities } from '../pages/Facilities.tsx';
import OrganizationCreate from "../pages/organizationCreate.tsx";
import OrganizationJoin from "../pages/organizationJoin.tsx";
import { Fleet } from "../pages/Fleet.tsx";
import JoiningCode from "../pages/JoiningCode.tsx";
import Employment from "../pages/Employment.tsx";
import Map from "../pages/MapsRoutes.tsx";
import Teams from "../pages/Teams.tsx";
import Shifts from "../pages/Shifts.tsx";

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
            {
                path: "harita",
                element: <Map />,
            },
            {
                path: "operasyonlar/ekipler",
                element: <Teams />,
            },
            {
                path: "operasyonlar/vardiyalar",
                element: <Shifts />,
            }
        ],
    },
]);

export default router;

