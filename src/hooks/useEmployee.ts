import { useState, useEffect } from 'react';
import { humanResourcesApi } from '../services/api/humanResources';
import { teamsApi } from '../services/api/teams';
import { shiftApi } from '../services/api/shift';
import { mapApi } from '../services/api/map';
import { useAuthStore } from '../store/userStore';
import { message } from 'antd';

interface Team {
    id: number;
    name: string;
    status: string;
    created_at: string;
    disband_date: string | null;
    organization: number;
}

interface User {
    id: string;
    name: string;
    email: string;
    phone_number: string;
}

interface TeamMember {
    id: number;
    team: number;
    user: User;
    role: 'Driver' | 'Collector' | 'TeamLeader';
    assigned_at: string;
}

interface Route {
    id: number;
    name: string;
    organization: number;
    created_by: string;
    created_at: string;
    nodes: Array<{
        id: number;
        order: number;
        container: {
            id: number;
            name: string;
            address: string;
            latitude: string;
            longitude: string;
            organization: number;
            created_at: string;
        };
    }>;
}

interface Shift {
    id: number;
    name: string;
    team: number;
    route: number;
    start_time: string;
    end_time: string | null;
    status: string;
    routeDetails?: Route | null;
}

interface UseEmployeeReturn {
    team: Team | null;
    teamMembers: TeamMember[];
    shifts: Shift[];
    loading: boolean;
    error: string | null;
    hasTeam: boolean;
}

export const useEmployee = (): UseEmployeeReturn => {
    const [team, setTeam] = useState<Team | null>(null);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasTeam, setHasTeam] = useState(false);

    const { user, organization } = useAuthStore();

    const fetchEmployeeData = async () => {
        if (!user || !organization) {
            setError('User or organization information not available');
            setLoading(false);
            return;
        }

        try {
            // Get employment ID using user ID and organization ID
            console.log('user.id', user.id);
            console.log('organization.id', organization.id);
            const employmentData = await humanResourcesApi.getActiveEmploymentId(user.id, organization.id);
            console.log('employmentData', employmentData);
            if (!employmentData) {
                setError('Employment record not found');
                setLoading(false);
                return;
            }

            // Get active team ID using employment ID
            const teamData = await teamsApi.getActiveTeamId(employmentData.employment_id);
            console.log('teamData', teamData);

            if (!teamData) {
                setHasTeam(false);
                setLoading(false);
                return;
            }

            setHasTeam(true);

            // Fetch team details
            console.log('teamData.team_id', teamData.team_id);
            const teamDetails = await teamsApi.getTeam(teamData.team_id);
            setTeam(teamDetails);

            // Fetch team members
            const members = await teamsApi.getTeamMembers(teamData.team_id);
            setTeamMembers(members);

            // Fetch shifts with route details
            const teamShifts = await shiftApi.getShiftsForTeam(teamData.team_id);

            // Fetch route details for each shift
            const shiftsWithRoutes = await Promise.all(
                teamShifts.map(async (shift: { id: number; route: number; name: string; team: number; start_time: string; end_time: string | null; status: string }) => {
                    try {
                        const routeDetails = await mapApi.getRoute(shift.route.toString());
                        return {
                            ...shift,
                            routeDetails
                        };
                    } catch (err) {
                        console.error(`Error fetching route details for shift ${shift.id}:`, err);
                        return {
                            ...shift,
                            routeDetails: null
                        };
                    }
                })
            );

            setShifts(shiftsWithRoutes);

        } catch (err) {
            console.error('Error fetching employee data:', err);
            setError('Failed to fetch employee data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployeeData();
    }, [user?.id, organization?.id]); // Re-fetch when user or organization changes

    return {
        team,
        teamMembers,
        shifts,
        loading,
        error,
        hasTeam,
    };
};
