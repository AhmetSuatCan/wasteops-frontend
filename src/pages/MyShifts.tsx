import React from 'react';
import { Card } from 'antd';

const MyShifts: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Vardiyalarım</h1>
            <Card>
                <p>Bu sayfada vardiyalarınızı görebileceksiniz.</p>
            </Card>
        </div>
    );
};

export default MyShifts; 