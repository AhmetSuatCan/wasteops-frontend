import React from 'react';

export const Facilities = () => {
    const exampleFacilities = [
        { id: 1, name: 'Main Recycling Center', location: 'New York', status: 'Active' },
        { id: 2, name: 'Westside Processing', location: 'Los Angeles', status: 'Active' },
        { id: 3, name: 'East Coast Facility', location: 'Boston', status: 'Maintenance' },
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Facilities</h1>
                <p className="text-gray-600 mt-2">Manage and monitor your waste management facilities</p>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold">Facility List</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {exampleFacilities.map((facility) => (
                                <tr key={facility.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{facility.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{facility.location}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${facility.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {facility.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Facilities;
