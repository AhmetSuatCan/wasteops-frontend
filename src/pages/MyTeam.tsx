import React from 'react';
import { Card } from 'antd';

const MyTeam: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Ekibim</h1>
            <Card>
                <p>Bu sayfada ekibinizle ilgili bilgileri görebileceksiniz.</p>
            </Card>
        </div>
    );
};

export default MyTeam; 