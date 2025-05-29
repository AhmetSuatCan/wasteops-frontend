import { useState } from 'react';
import { humanResourcesApi } from '../services/api/humanResources';

interface User {
    id: string;
    name: string;
    gender: string;
    email: string;
    age: number;
    phone_number: string;
    address: string;
}

interface Employee {
    id: number;
    user: User;
    start_date: string;
    created_at: string;
}

export const useEmployment = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await humanResourcesApi.getEmployees();
            console.log('hook employees', data)
            setEmployees(data);
        } catch (err) {
            setError('Failed to fetch employees');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const terminateEmployment = async (employeeId: string) => {
        try {
            setLoading(true);
            setError(null);
            await humanResourcesApi.endEmployment(employeeId.toString());
            // Refresh the employee list after termination
            await fetchEmployees();
        } catch (err) {
            setError('Failed to terminate employment');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        employees,
        loading,
        error,
        fetchEmployees,
        terminateEmployment
    };
};
