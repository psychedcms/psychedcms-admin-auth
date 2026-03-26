import { useState } from 'react';
import { useTranslate } from 'react-admin';
import { Box, Card, CardContent, TextField, Button, Typography, Link as MuiLink, Alert } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';

export function SetPasswordPage() {
    const translate = useTranslate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') ?? '';
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const validatePassword = (pwd: string): boolean => {
        return pwd.length >= 8 && /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError(translate('psyched.auth.passwords_mismatch'));
            return;
        }

        if (!validatePassword(password)) {
            setError(translate('psyched.auth.password_requirements'));
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL.replace(/\/api$/, '')}/api/accept-invitation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            if (response.status === 429) {
                setError(translate('psyched.auth.too_many_attempts'));
            } else if (response.ok) {
                setSuccess(true);
            } else {
                setError(translate('psyched.auth.invalid_invitation'));
            }
        } catch {
            setError(translate('psyched.auth.invalid_invitation'));
        }

        setLoading(false);
    };

    if (!token) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            }}>
                <Card sx={{ minWidth: 400, maxWidth: 450 }}>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="error">{translate('psyched.auth.invalid_invitation')}</Typography>
                        <Box sx={{ mt: 2 }}>
                            <MuiLink component={Link} to="/login">
                                {translate('psyched.auth.back_to_login')}
                            </MuiLink>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        }}>
            <Card sx={{ minWidth: 400, maxWidth: 450 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom align="center">
                        {translate('psyched.auth.set_password_title')}
                    </Typography>

                    {success ? (
                        <>
                            <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
                                {translate('psyched.auth.set_password_success')}
                            </Alert>
                            <Box sx={{ textAlign: 'center' }}>
                                <MuiLink component={Link} to="/login">
                                    {translate('psyched.auth.back_to_login')}
                                </MuiLink>
                            </Box>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            <Typography sx={{ mt: 1, mb: 2 }} color="text.secondary" variant="body2">
                                {translate('psyched.auth.password_requirements')}
                            </Typography>
                            <TextField
                                fullWidth
                                label={translate('psyched.auth.new_password')}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label={translate('psyched.auth.confirm_password')}
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                sx={{ mb: 3 }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading}
                                size="large"
                            >
                                {translate('psyched.auth.set_password_submit')}
                            </Button>
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <MuiLink component={Link} to="/login">
                                    {translate('psyched.auth.back_to_login')}
                                </MuiLink>
                            </Box>
                        </form>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
