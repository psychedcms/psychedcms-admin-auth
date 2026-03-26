import { useState } from 'react';
import { useTranslate } from 'react-admin';
import { Alert, Box, Card, CardContent, TextField, Button, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

export function ForgotPasswordPage() {
    const translate = useTranslate();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL.replace(/\/api$/, '')}/api/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.status === 429) {
                setError(translate('psyched.auth.too_many_attempts'));
                setLoading(false);
                return;
            }
        } catch {
            // Silently ignore — always show success (anti-enumeration)
        }

        setLoading(false);
        setSubmitted(true);
    };

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
                        {translate('psyched.auth.forgot_password_title')}
                    </Typography>

                    {submitted ? (
                        <>
                            <Typography sx={{ mt: 2, mb: 3 }} align="center">
                                {translate('psyched.auth.forgot_password_success')}
                            </Typography>
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
                            <Typography sx={{ mt: 1, mb: 3 }} color="text.secondary">
                                {translate('psyched.auth.forgot_password_instructions')}
                            </Typography>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                {translate('psyched.auth.forgot_password_submit')}
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
