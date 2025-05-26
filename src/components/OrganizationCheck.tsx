import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/userStore';

const OrganizationCheck = () => {
    const navigate = useNavigate();
    const { user, organization } = useAuthStore();

    useEffect(() => {
        if (!organization) {
            if (user?.role === 'A') {
                navigate('/create-organization');
            } else if (user?.role === 'E') {
                navigate('/join-organization');
            }
        }
    }, [user, organization, navigate]);

    return null;
};

export default OrganizationCheck; 