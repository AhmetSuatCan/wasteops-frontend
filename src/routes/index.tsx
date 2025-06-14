import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../layouts/dashboard/Index";
import UserDashboard from "../layouts/dashboard/UserDashboard";
import AuthForm from "../layouts/auth/Index";
import ProtectedRoute from "./ProtectedRoute.tsx";
import RoleBasedRoute from "./RoleBasedRoute.tsx";
import { Facilities } from '../pages/facilities.tsx';
import OrganizationCreate from "../pages/organizationCreate.tsx";
import OrganizationJoin from "../pages/organizationJoin.tsx";
import { Fleet } from "../pages/Fleet.tsx";
import JoiningCode from "../pages/JoiningCode.tsx";
import Employment from "../pages/Employment.tsx";
import Map from "../pages/MapsRoutes.tsx";
import Teams from "../pages/Teams.tsx";
import Shifts from "../pages/Shifts.tsx";
import EmployeeDashboard from "../pages/EmployeeDashboard.tsx";

const router = createBrowserRouter([
    // Auth Layout - Only accessible to non-authenticated users
    {
        path: "/",
        element: <AuthForm />,
    },
    // Organization Routes
    {
        path: "/create-organization",
        element: (
            <ProtectedRoute
                element={
                    <RoleBasedRoute
                        element={<OrganizationCreate />}
                        allowedRoles={['A']}
                        requireNoOrganization={true}
                    />
                }
            />
        ),
    },
    {
        path: "/join-organization",
        element: (
            <ProtectedRoute
                element={
                    <RoleBasedRoute
                        element={<OrganizationJoin />}
                        allowedRoles={['E']}
                        requireNoOrganization={true}
                    />
                }
            />
        ),
    },
    // Admin Dashboard Layout
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute
                element={
                    <RoleBasedRoute
                        element={<Dashboard />}
                        allowedRoles={['A']}
                        requireOrganization={true}
                    />
                }
            />
        ),
        children: [
            {
                path: "tesisler",
                element: <Facilities />,
            },
            {
                path: "insan-kaynaklari/kodlar",
                element: <JoiningCode />,
            },
            {
                path: "insan-kaynaklari/calisanlar",
                element: <Employment />,
            },
            {
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
            },
        ],
    },
    // Employee Dashboard Layout
    {
        path: "/employee-dashboard",
        element: (
            <ProtectedRoute
                element={
                    <RoleBasedRoute
                        element={<UserDashboard />}
                        allowedRoles={['E']}
                        requireOrganization={true}
                    />
                }
            />
        ),
        children: [
            {
                path: "",
                element: <EmployeeDashboard />,
            },
        ],
    },
]);

export default router;

