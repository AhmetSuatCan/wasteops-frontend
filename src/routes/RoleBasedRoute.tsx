import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/userStore';

interface RoleBasedRouteProps {
    element: ReactElement;
    allowedRoles: ('A' | 'E')[];
    requireOrganization?: boolean;
    requireNoOrganization?: boolean;
}

const RoleBasedRoute = ({
    element,
    allowedRoles,
    requireOrganization = false,
    requireNoOrganization = false,
}: RoleBasedRouteProps) => {
    const { user, organization } = useAuthStore();

    // Check if user has required role
    const hasRequiredRole = user && allowedRoles.includes(user.role);

    // Check organization requirements
    const hasOrganization = !!organization;
    const meetsOrganizationRequirement = requireOrganization ? hasOrganization : true;
    const meetsNoOrganizationRequirement = requireNoOrganization ? !hasOrganization : true;

    if (!hasRequiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    if (!meetsOrganizationRequirement || !meetsNoOrganizationRequirement) {
        if (user.role === 'A') {
            return <Navigate to="/create-organization" replace />;
        } else {
            return <Navigate to="/join-organization" replace />;
        }
    }

    return element;
};

export default RoleBasedRoute; 