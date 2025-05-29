import React, { useEffect, useState } from 'react';
import { useJoinCode } from '../hooks/useJoinCode';
import { Button, Card, Container, Grid, Typography, Box, IconButton, Snackbar, Alert } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Code {
    code: string;
    created_at: string;
    expires_at: string;
}

const JoiningCode: React.FC = () => {
    const { generateCode, getCodes, expireCode, isLoading, error } = useJoinCode();
    const [codes, setCodes] = useState<Code[]>([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const fetchCodes = async () => {
        try {
            const response = await getCodes();
            setCodes(response);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Kodlar yüklenirken bir hata oluştu.',
                severity: 'error'
            });
        }
    };

    useEffect(() => {
        fetchCodes();
    }, []);

    const handleGenerateCode = async () => {
        try {
            await generateCode();
            await fetchCodes();
            setSnackbar({
                open: true,
                message: 'Yeni kod başarıyla oluşturuldu.',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Kod oluşturulurken bir hata oluştu.',
                severity: 'error'
            });
        }
    };

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setSnackbar({
            open: true,
            message: 'Kod panoya kopyalandı.',
            severity: 'success'
        });
    };

    const handleExpireCode = async (code: string) => {
        try {
            await expireCode(code);
            await fetchCodes();
            setSnackbar({
                open: true,
                message: 'Kod başarıyla iptal edildi.',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Kod iptal edilirken bir hata oluştu.',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, px: { xs: 2, sm: 4, md: 6 } }}>
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{
                    fontSize: '28px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '8px 0',
                    borderBottom: '3px solid #169976',
                    display: 'inline-block'
                }}>
                    Katılım Kodları
                </h1>
                <Button
                    variant="contained"
                    onClick={handleGenerateCode}
                    disabled={isLoading}
                    sx={{
                        bgcolor: '#169976',
                        px: 3,
                        py: 1.5,
                        '&:hover': {
                            bgcolor: '#138066'
                        }
                    }}
                >
                    Yeni Kod Oluştur
                </Button>
            </div>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {codes.map((code) => (
                    <Card
                        key={code.code}
                        sx={{
                            py: 2.5,
                            px: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            border: '3px solid #169976',
                            bgcolor: '#ffffff',
                            borderRadius: 3,
                            '&:hover': {
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                transform: 'translateY(-2px)',
                                transition: 'all 0.2s ease-in-out',
                                bgcolor: '#fafafa'
                            }
                        }}
                    >
                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="h5"
                                component="div"
                                sx={{
                                    mb: 1,
                                    color: '#169976',
                                    fontWeight: 700,
                                    letterSpacing: '0.5px'
                                }}
                            >
                                {code.code}
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{
                                    fontWeight: 500,
                                    color: '#666'
                                }}
                            >
                                Oluşturulma: {format(new Date(code.created_at), 'dd MMMM yyyy HH:mm', { locale: tr })}
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton
                                onClick={() => handleCopyCode(code.code)}
                                sx={{
                                    mr: 1,
                                    color: '#169976',
                                    '&:hover': {
                                        bgcolor: 'rgba(22, 153, 118, 0.1)'
                                    }
                                }}
                            >
                                <ContentCopyIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => handleExpireCode(code.code)}
                                color="error"
                                sx={{
                                    '&:hover': {
                                        bgcolor: 'rgba(211, 47, 47, 0.1)'
                                    }
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Card>
                ))}
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default JoiningCode;
