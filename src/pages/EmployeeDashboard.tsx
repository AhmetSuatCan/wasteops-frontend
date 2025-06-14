import { Card, Table, Row, Col, Tag, Typography, Avatar, Space, Divider, Statistic, Empty, Button } from 'antd';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngTuple } from 'leaflet';
import { UserOutlined, TeamOutlined, CalendarOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, CarOutlined, GlobalOutlined } from '@ant-design/icons';
import { useEmployee } from '../hooks/useEmployee';
import { useAuthStore } from '../store/userStore';
import { useState } from 'react';
import { mapApi } from '../services/api/map';

const { Title, Text } = Typography;

interface RouteNode {
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
}

interface Route {
    id: number;
    name: string;
    organization: number;
    created_by: string;
    created_at: string;
    nodes: RouteNode[];
}

const EmployeeDashboard = () => {
    const { team, teamMembers, shifts, loading, error, hasTeam } = useEmployee();
    const { organization } = useAuthStore();
    const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

    // Find active shift and its route
    const activeShift = shifts.find(shift => !shift.end_time);
    const activeRoute = activeShift?.routeDetails;

    // Calculate map center based on selected or active route
    const getMapCenter = (): LatLngTuple => {
        const routeToUse = selectedRoute || activeRoute;
        if (routeToUse?.nodes && routeToUse.nodes.length > 0) {
            // Sort nodes by order and get the first node's coordinates
            const firstNode = routeToUse.nodes.sort((a: RouteNode, b: RouteNode) => a.order - b.order)[0];
            return [
                Number(firstNode.container.latitude),
                Number(firstNode.container.longitude)
            ];
        }
        // Default to Istanbul if no route is available
        return [41.0082, 28.9784];
    };

    const handleShowRoute = async (shift: any) => {
        try {
            const routeDetails = await mapApi.getRoute(shift.route.toString());
            setSelectedRoute(routeDetails);
        } catch (err) {
            console.error('Error fetching route details:', err);
        }
    };

    const handleClearRoute = () => {
        setSelectedRoute(null);
    };

    const teamColumns = [
        {
            title: 'Çalışan',
            dataIndex: 'user',
            key: 'user',
            render: (user: any) => (
                <Space>
                    <Avatar icon={<UserOutlined />} />
                    <div>
                        <div>{user.name}</div>
                        <Text type="secondary">{user.email}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Pozisyon',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => {
                const roleMap: { [key: string]: string } = {
                    'Driver': 'Sürücü',
                    'Collector': 'Toplayıcı',
                    'TeamLeader': 'Takım Lideri'
                };
                return <Tag color="blue">{roleMap[role] || role}</Tag>;
            }
        },
        {
            title: 'İletişim',
            dataIndex: ['user', 'phone_number'],
            key: 'phone',
            render: (phone: string) => (
                <Space>
                    <PhoneOutlined />
                    <Text>{phone}</Text>
                </Space>
            )
        },
        {
            title: 'Atanma Tarihi',
            dataIndex: 'assigned_at',
            key: 'assigned_at',
            render: (date: string) => new Date(date).toLocaleDateString('tr-TR'),
        }
    ];

    const shiftColumns = [
        {
            title: 'Vardiya Adı',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Başlangıç',
            dataIndex: 'start_time',
            key: 'start_time',
            render: (date: string) => (
                <Space>
                    <CalendarOutlined />
                    <Text>{new Date(date).toLocaleString('tr-TR')}</Text>
                </Space>
            )
        },
        {
            title: 'Bitiş',
            dataIndex: 'end_time',
            key: 'end_time',
            render: (date: string | null) => (
                <Space>
                    <CalendarOutlined />
                    <Text>{date ? new Date(date).toLocaleString('tr-TR') : 'Devam Ediyor'}</Text>
                </Space>
            )
        },
        {
            title: 'Rota',
            key: 'route',
            render: (_: any, record: any) => (
                <Button
                    type="primary"
                    icon={<GlobalOutlined />}
                    onClick={() => handleShowRoute(record)}
                    className="bg-brandGreen hover:bg-brandGreen/90"
                >
                    Rotayı Göster
                </Button>
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brandGreen"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Card>
                    <Empty
                        description={
                            <Text type="danger">
                                {error}
                            </Text>
                        }
                    />
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            {/* Organization Info Section */}
            <section>
                <Title level={2}>
                    <Space>
                        <TeamOutlined />
                        Organizasyon Bilgileri
                    </Space>
                </Title>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Card>
                            <Space direction="vertical" size="large" className="w-full">
                                <div className="flex items-center space-x-4">
                                    <Avatar size={64} icon={<TeamOutlined />} />
                                    <div>
                                        <Title level={3} className="m-0">{organization?.name}</Title>
                                        <Text type="secondary">{organization?.address}</Text>
                                    </div>
                                </div>
                                <Divider />
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Space>
                                            <PhoneOutlined />
                                            <Text>{organization?.phone_number}</Text>
                                        </Space>
                                    </Col>
                                    <Col span={12}>
                                        <Space>
                                            <EnvironmentOutlined />
                                            <Text>{organization?.address}</Text>
                                        </Space>
                                    </Col>
                                </Row>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Card>
                                    <Statistic
                                        title="Takım"
                                        value={team?.name || 'Takım Yok'}
                                        prefix={<TeamOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card>
                                    <Statistic
                                        title="Takım Durumu"
                                        value={team?.status === 'onShift' ? 'Görevde' : 'Pasif'}
                                        prefix={<CalendarOutlined />}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </section>

            {/* Team Info Section */}
            {hasTeam ? (
                <section>
                    <Title level={2}>
                        <Space>
                            <TeamOutlined />
                            Ekibim
                        </Space>
                    </Title>
                    <Card>
                        <Table
                            columns={teamColumns}
                            dataSource={teamMembers}
                            loading={loading}
                            pagination={false}
                        />
                    </Card>
                </section>
            ) : (
                <section>
                    <Card>
                        <Empty
                            description={
                                <Text>
                                    Henüz bir takıma atanmadınız.
                                </Text>
                            }
                        />
                    </Card>
                </section>
            )}

            {/* Shifts Info Section */}
            {hasTeam && (
                <section>
                    <Title level={2}>
                        <Space>
                            <CalendarOutlined />
                            Vardiyalarım
                        </Space>
                    </Title>
                    <div className="space-y-4">
                        <Card>
                            <Table
                                columns={shiftColumns}
                                dataSource={shifts}
                                loading={loading}
                                pagination={false}
                            />
                        </Card>
                        {(selectedRoute || activeRoute) && (
                            <Card
                                title={
                                    <Space>
                                        <GlobalOutlined />
                                        {selectedRoute ? 'Seçili Vardiya Rotası' : 'Aktif Vardiya Rotası'}
                                    </Space>
                                }
                            >
                                <div className="h-[400px]">
                                    <MapContainer
                                        center={getMapCenter()}
                                        zoom={13}
                                        style={{ height: '100%', width: '100%' }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        {(selectedRoute || activeRoute) && (
                                            <>
                                                {/* Draw route line */}
                                                <Polyline
                                                    positions={((selectedRoute || activeRoute)?.nodes
                                                        .sort((a: RouteNode, b: RouteNode) => a.order - b.order)
                                                        .map((node: RouteNode) => [
                                                            Number(node.container.latitude),
                                                            Number(node.container.longitude)
                                                        ]) || []) as LatLngTuple[]}
                                                    color="#DC2626"
                                                    weight={3}
                                                    opacity={0.7}
                                                />
                                                {/* Draw route nodes */}
                                                {(selectedRoute || activeRoute)?.nodes.map((node: RouteNode) => (
                                                    <Marker
                                                        key={node.id}
                                                        position={[
                                                            Number(node.container.latitude),
                                                            Number(node.container.longitude)
                                                        ]}
                                                        icon={new Icon({
                                                            iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
                                                            iconSize: [35, 51],
                                                            iconAnchor: [17, 51],
                                                            popupAnchor: [0, -35]
                                                        })}
                                                    >
                                                        <Popup>
                                                            <div className="p-3 min-w-[200px]">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                                                                        {node.order}
                                                                    </div>
                                                                    <h3 className="font-semibold text-lg">{node.container.name}</h3>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <p className="text-sm text-gray-600">
                                                                        <span className="font-medium">Address:</span> {node.container.address}
                                                                    </p>
                                                                    <p className="text-sm text-gray-600">
                                                                        <span className="font-medium">Coordinates:</span><br />
                                                                        Lat: {Number(node.container.latitude).toFixed(6)}<br />
                                                                        Lng: {Number(node.container.longitude).toFixed(6)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Popup>
                                                    </Marker>
                                                ))}
                                            </>
                                        )}
                                    </MapContainer>
                                </div>
                            </Card>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
};

export default EmployeeDashboard; 