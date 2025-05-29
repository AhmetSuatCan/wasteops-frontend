import { useState, useEffect } from 'react';
import { shiftApi } from '../services/api/shift';
import { mapApi } from '../services/api/map';
import { teamsApi } from '../services/api/teams';

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

interface Team {
    id: number;
    name: string;
    status: string;
    created_at: string;
    disband_date: string | null;
    organization: number;
}

interface Shift {
    id: number;
    name: string;
    route: number;
    team: number;
    start_time: string;
    organization: number;
    created_at: string;
    end_time: string | null;
}

interface ShiftWithDetails extends Omit<Shift, 'route' | 'team'> {
    routeDetails: Route | null;
    teamDetails: Team | null;
}

export const useShift = () => {
    const [shifts, setShifts] = useState<ShiftWithDetails[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchShifts = async () => {
        try {
            setLoading(true);
            const data = await shiftApi.getAllShifts();

            // Fetch route and team details for each shift
            const shiftsWithDetails = await Promise.all(
                data.map(async (shift: Shift) => {
                    try {
                        // Fetch route and team details using the shift's route and team IDs
                        const [routeDetails, teamDetails] = await Promise.all([
                            mapApi.getRoute(shift.route.toString()),
                            teamsApi.getTeam(shift.team.toString())
                        ]);

                        return {
                            ...shift,
                            routeDetails,
                            teamDetails
                        };
                    } catch (err) {
                        console.error(`Error fetching details for shift ${shift.id}:`, err);
                        return {
                            ...shift,
                            routeDetails: null,
                            teamDetails: null
                        };
                    }
                })
            );

            setShifts(shiftsWithDetails);
            setError(null);
        } catch (err) {
            setError('Failed to fetch shifts');
            console.error('Error fetching shifts:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoutes = async () => {
        try {
            setLoading(true);
            const data = await mapApi.getRoutes();
            setRoutes(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch routes');
            console.error('Error fetching routes:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeams = async () => {
        try {
            setLoading(true);
            const data = await teamsApi.getAllTeams();
            setTeams(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch teams');
            console.error('Error fetching teams:', err);
        } finally {
            setLoading(false);
        }
    };

    const createShift = async (shiftData: {
        name: string;
        route_id: number;
        team_id: number;
        start_time: string;
    }) => {
        try {
            setLoading(true);
            const newShift = await shiftApi.createShift(shiftData);

            // Fetch route and team details for the new shift
            const [routeDetails, teamDetails] = await Promise.all([
                mapApi.getRoute(newShift.route.toString()),
                teamsApi.getTeam(newShift.team.toString())
            ]);

            const shiftWithDetails = {
                ...newShift,
                routeDetails,
                teamDetails
            };

            setShifts(prev => [...prev, shiftWithDetails]);
            setError(null);
            return shiftWithDetails;
        } catch (err) {
            setError('Failed to create shift');
            console.error('Error creating shift:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShifts();
        fetchRoutes();
        fetchTeams();
    }, []);

    return {
        shifts,
        routes,
        teams,
        loading,
        error,
        createShift,
        fetchShifts,
        fetchRoutes,
        fetchTeams
    };
};
