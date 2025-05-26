import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/userStore';
import { useOrganization } from '../hooks/useOrganization';
import { toast } from 'react-hot-toast';

interface OrganizationFormData {
    name: string;
    address: string;
    organization_type: 'government' | 'private';
    num_of_facilities: number;
    num_of_cars: number;
    num_of_containers: number;
}

const OrganizationCreate: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { createOrganization, isLoading, error } = useOrganization();
    const [formData, setFormData] = useState<OrganizationFormData>({
        name: '',
        address: '',
        organization_type: 'government',
        num_of_facilities: 0,
        num_of_cars: 0,
        num_of_containers: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: parseInt(value) || 0,
        }));
    };

    const handleOrganizationTypeChange = (type: 'government' | 'private') => {
        setFormData((prev) => ({
            ...prev,
            organization_type: type,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createOrganization(formData);
            toast.success('Organization created successfully!');
            navigate('/dashboard', { replace: true });
        } catch (error) {
            console.error('Error creating organization:', error);
            toast.error('Failed to create organization. Please try again.');
        }
    };

    // Redirect if user is not an admin
    React.useEffect(() => {
        if (user?.role !== 'A') {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Create New Organization
                </h1>
                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                        {error.message}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Organization Name
                        </label>
                        <input
                            required
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandGreen"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Organization Type
                        </label>
                        <div className="flex rounded-md shadow-sm">
                            <button
                                type="button"
                                onClick={() => handleOrganizationTypeChange('government')}
                                className={`flex-1 px-4 py-2 text-sm font-medium rounded-l-md border ${formData.organization_type === 'government'
                                    ? 'bg-brandGreen text-white border-brandGreen'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                Government
                            </button>
                            <button
                                type="button"
                                onClick={() => handleOrganizationTypeChange('private')}
                                className={`flex-1 px-4 py-2 text-sm font-medium rounded-r-md border ${formData.organization_type === 'private'
                                    ? 'bg-brandGreen text-white border-brandGreen'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                Private
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                        </label>
                        <input
                            required
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandGreen"
                        />
                    </div>

                    <div>
                        <label htmlFor="num_of_facilities" className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Facilities
                        </label>
                        <input
                            required
                            type="number"
                            id="num_of_facilities"
                            name="num_of_facilities"
                            min="0"
                            value={formData.num_of_facilities}
                            onChange={handleNumberChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandGreen"
                        />
                    </div>

                    <div>
                        <label htmlFor="num_of_cars" className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Cars
                        </label>
                        <input
                            required
                            type="number"
                            id="num_of_cars"
                            name="num_of_cars"
                            min="0"
                            value={formData.num_of_cars}
                            onChange={handleNumberChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandGreen"
                        />
                    </div>

                    <div>
                        <label htmlFor="num_of_containers" className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Containers
                        </label>
                        <input
                            required
                            type="number"
                            id="num_of_containers"
                            name="num_of_containers"
                            min="0"
                            value={formData.num_of_containers}
                            onChange={handleNumberChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandGreen"
                        />
                    </div>

                    <div className="flex justify-center space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brandGreen"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-brandGreen text-white rounded-md hover:bg-brandGreen/90 focus:outline-none focus:ring-2 focus:ring-brandGreen disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : 'Create Organization'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrganizationCreate;
