import { registerPlugin } from '@psychedcms/admin-core';
import { RolePermissionsPage } from './components/RolePermissionsPage.tsx';
import { frMessages } from './i18n/fr.ts';
import { enMessages } from './i18n/en.ts';

import SecurityIcon from '@mui/icons-material/Security';

registerPlugin({
    adminPages: [{
        path: 'permissions',
        component: RolePermissionsPage,
        menuLabel: 'psyched.menu.permissions',
        menuIcon: SecurityIcon,
    }],
    i18nMessages: { fr: frMessages, en: enMessages },
});

export { RolePermissionsPage } from './components/RolePermissionsPage.tsx';
export { ForgotPasswordPage } from './components/ForgotPasswordPage.tsx';
export { ResetPasswordPage } from './components/ResetPasswordPage.tsx';
export { PsychedLoginPage } from './components/PsychedLoginPage.tsx';
