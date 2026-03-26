import { Login, LoginForm, useTranslate } from 'react-admin';
import { Box, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

export function PsychedLoginPage() {
    const translate = useTranslate();

    return (
        <Login>
            <LoginForm />
            <Box sx={{ px: 2, pb: 2, textAlign: 'center' }}>
                <MuiLink component={Link} to="/forgot-password" variant="body2">
                    {translate('psyched.auth.forgot_password')}
                </MuiLink>
            </Box>
        </Login>
    );
}
