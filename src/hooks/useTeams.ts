import { useState, useCallback } from 'react';
import { teamsApi } from '../services/api/teams';
import { message } from 'antd';

interface Team {
    id: string;
    name: string;
    status: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    role: string;
    address: string;
    age: number;
    gender: string;
}

interface TeamMember {
    id: string;
    employee_id: string;
    team_id: string;
    name: string;
    email: string;
    role: string;
    assigned_at: string;
    removed_at: string;
    user: User;
}

interface UnteamedEmployee {
    id: string;
    user: User;
}

interface UseTeamsReturn {
    // State
    teams: Team[];
    selectedTeam: Team | null;
    teamMembers: TeamMember[];
    unteamedEmployees: UnteamedEmployee[];
    loading: boolean;
    modals: {
        addMember: boolean;
        disbandConfirm: boolean;
        createTeam: boolean;
    };

    // Actions
    fetchTeams: () => Promise<void>;
    selectTeam: (team: Team) => Promise<void>;
    createTeam: (name: string, status: string) => Promise<void>;
    updateTeam: (id: string, name: string) => Promise<void>;
    disbandTeam: (id: string) => Promise<void>;
    addMemberToTeam: (employeeId: string, teamId: string, role: string) => Promise<void>;
    removeMemberFromTeam: (id: string) => Promise<void>;

    // Modal controls
    openAddMemberModal: () => void;
    closeAddMemberModal: () => void;
    openDisbandConfirmModal: () => void;
    closeDisbandConfirmModal: () => void;
    openCreateTeamModal: () => void;
    closeCreateTeamModal: () => void;
}

export const useTeams = (): UseTeamsReturn => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [unteamedEmployees, setUnteamedEmployees] = useState<UnteamedEmployee[]>([]);
    const [loading, setLoading] = useState(false);
    const [modals, setModals] = useState({
        addMember: false,
        disbandConfirm: false,
        createTeam: false,
    });

    const fetchTeams = useCallback(async () => {
        try {
            setLoading(true);
            const data = await teamsApi.getAllTeams();
            setTeams(data);
        } catch (error) {
            message.error('Failed to fetch teams');
        } finally {
            setLoading(false);
        }
    }, []);

    const selectTeam = useCallback(async (team: Team) => {
        try {
            setLoading(true);
            setSelectedTeam(team);
            const members = await teamsApi.getTeamMembers(team.id);
            setTeamMembers(members);
        } catch (error) {
            message.error('Failed to fetch team members');
        } finally {
            setLoading(false);
        }
    }, []);

    const createTeam = useCallback(async (name: string, status: string) => {
        try {
            setLoading(true);
            await teamsApi.createTeam({ name, status });
            await fetchTeams();
            message.success('Team created successfully');
        } catch (error) {
            message.error('Failed to create team');
        } finally {
            setLoading(false);
        }
    }, [fetchTeams]);

    const updateTeam = useCallback(async (id: string, name: string) => {
        try {
            setLoading(true);
            await teamsApi.updateTeam({ id, name });
            await fetchTeams();
            message.success('Team updated successfully');
        } catch (error) {
            message.error('Failed to update team');
        } finally {
            setLoading(false);
        }
    }, [fetchTeams]);

    const disbandTeam = useCallback(async (id: string) => {
        try {
            setLoading(true);
            await teamsApi.disbandTeam(id);
            await fetchTeams();
            setSelectedTeam(null);
            setTeamMembers([]);
            message.success('Team disbanded successfully');
        } catch (error) {
            message.error('Failed to disband team');
        } finally {
            setLoading(false);
        }
    }, [fetchTeams]);

    const addMemberToTeam = useCallback(async (employeeId: string, teamId: string, role: string) => {
        try {
            console.log('Adding member:', { employeeId, teamId, role });
            setLoading(true);
            await teamsApi.addEmployeeToTeam({
                employment_id: employeeId,
                team_id: teamId,
                role: role
            });
            if (selectedTeam) {
                const members = await teamsApi.getTeamMembers(selectedTeam.id);
                setTeamMembers(members);
            }
            message.success('Member added successfully');
        } catch (error) {
            console.error('Error adding member:', error);
            message.error('Failed to add member');
        } finally {
            setLoading(false);
        }
    }, [selectedTeam]);

    const removeMemberFromTeam = useCallback(async (id: string) => {
        try {
            setLoading(true);
            await teamsApi.removeEmployeeFromTeam({ id });
            if (selectedTeam) {
                const members = await teamsApi.getTeamMembers(selectedTeam.id);
                setTeamMembers(members);
            }
            const unteamed = await teamsApi.getUnteamedEmployee();
            setUnteamedEmployees(unteamed);
            message.success('Member removed successfully');
        } catch (error) {
            message.error('Failed to remove member');
        } finally {
            setLoading(false);
        }
    }, [selectedTeam]);

    const openAddMemberModal = useCallback(async () => {
        try {
            setLoading(true);
            const unteamed = await teamsApi.getUnteamedEmployee();
            setUnteamedEmployees(unteamed);
            setModals(prev => ({ ...prev, addMember: true }));
        } catch (error) {
            message.error('Failed to fetch unteamed employees');
        } finally {
            setLoading(false);
        }
    }, []);

    const closeAddMemberModal = useCallback(() => {
        setModals(prev => ({ ...prev, addMember: false }));
    }, []);

    const openDisbandConfirmModal = useCallback(() => {
        setModals(prev => ({ ...prev, disbandConfirm: true }));
    }, []);

    const closeDisbandConfirmModal = useCallback(() => {
        setModals(prev => ({ ...prev, disbandConfirm: false }));
    }, []);

    const openCreateTeamModal = useCallback(() => {
        setModals(prev => ({ ...prev, createTeam: true }));
    }, []);

    const closeCreateTeamModal = useCallback(() => {
        setModals(prev => ({ ...prev, createTeam: false }));
    }, []);

    return {
        teams,
        selectedTeam,
        teamMembers,
        unteamedEmployees,
        loading,
        modals,
        fetchTeams,
        selectTeam,
        createTeam,
        updateTeam,
        disbandTeam,
        addMemberToTeam,
        removeMemberFromTeam,
        openAddMemberModal,
        closeAddMemberModal,
        openDisbandConfirmModal,
        closeDisbandConfirmModal,
        openCreateTeamModal,
        closeCreateTeamModal,
    };
};
