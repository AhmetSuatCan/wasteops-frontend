import React from 'react';
import { Card } from 'antd';
import { useAuthStore } from '../store/userStore';

const MyOrganization: React.FC = () => {
    const { organization } = useAuthStore();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Organizasyonum</h1>
            <Card>
                {organization ? (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold">Organizasyon Adı</h2>
                            <p>{organization.name}</p>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Adres</h2>
                            <p>{organization.address}</p>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Organizasyon Tipi</h2>
                            <p>{organization.organization_type === 'government' ? 'Kamu' : 'Özel'}</p>
                        </div>
                    </div>
                ) : (
                    <p>Organizasyon bilgileri yüklenemedi.</p>
                )}
            </Card>
        </div>
    );
};

export default MyOrganization; 