import { useState, useEffect, useCallback } from 'react';
import { useNotify, useTranslate } from 'react-admin';
import {
    Box,
    Card,
    CardContent,
    Button,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { PageHeader } from '@psychedcms/admin-core';

const entrypoint = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface PermissionsData {
    definitions: Record<string, string[]>;
    matrix: Record<string, string[]>;
}

const ROLES = ['ROLE_ADMIN', 'ROLE_EDITOR', 'ROLE_USER'] as const;

async function fetchPermissions(): Promise<PermissionsData> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${entrypoint}/role-permissions`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) throw new Error('Failed to load permissions');
    return response.json();
}

async function savePermissions(matrix: Record<string, string[]>): Promise<PermissionsData> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${entrypoint}/role-permissions`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(matrix),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Save failed' }));
        throw new Error(error.error ?? 'Save failed');
    }
    return response.json();
}

export function RolePermissionsPage() {
    const translate = useTranslate();
    const notify = useNotify();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [definitions, setDefinitions] = useState<Record<string, string[]>>({});
    const [matrix, setMatrix] = useState<Record<string, string[]>>({});
    const [initialMatrix, setInitialMatrix] = useState<Record<string, string[]>>({});

    const load = useCallback(async () => {
        try {
            const data = await fetchPermissions();
            setDefinitions(data.definitions);
            setMatrix(data.matrix);
            setInitialMatrix(data.matrix);
        } catch {
            notify('psyched.permissions.load_failed', { type: 'error', messageArgs: { _: 'Failed to load permissions' } });
        } finally {
            setLoading(false);
        }
    }, [notify]);

    useEffect(() => { load(); }, [load]);

    const hasChanges = JSON.stringify(matrix) !== JSON.stringify(initialMatrix);

    const togglePermission = (role: string, permission: string) => {
        setMatrix((prev) => {
            const current = prev[role] ?? [];
            const has = current.includes(permission);
            return {
                ...prev,
                [role]: has
                    ? current.filter((p) => p !== permission)
                    : [...current, permission],
            };
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const data = await savePermissions(matrix);
            setMatrix(data.matrix);
            setInitialMatrix(data.matrix);
            notify('psyched.permissions.saved', { type: 'success', messageArgs: { _: 'Permissions saved' } });
        } catch (err) {
            notify('psyched.permissions.save_failed', { type: 'error', messageArgs: { _: err instanceof Error ? err.message : 'Save failed' } });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <PageHeader
                title={translate('psyched.permissions.title', { _: 'Role Permissions' })}
                actions={
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        disabled={!hasChanges || saving}
                    >
                        {saving
                            ? translate('psyched.settings.saving', { _: 'Saving...' })
                            : translate('psyched.settings.save', { _: 'Save' })}
                    </Button>
                }
            />

            <Card variant="outlined">
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>
                                        {translate('psyched.permissions.permission', { _: 'Permission' })}
                                    </TableCell>
                                    {ROLES.map((role) => (
                                        <TableCell key={role} align="center" sx={{ fontWeight: 600 }}>
                                            {translate(`psyched.permissions.roles.${role}`, { _: role })}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(definitions).map(([group, permissions]) => (
                                    <>
                                        <TableRow key={`group-${group}`}>
                                            <TableCell
                                                colSpan={ROLES.length + 1}
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: '0.75rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.08em',
                                                    color: 'text.secondary',
                                                    bgcolor: 'action.hover',
                                                    py: 0.75,
                                                }}
                                            >
                                                {translate(`psyched.permissions.groups.${group}`, { _: group })}
                                            </TableCell>
                                        </TableRow>
                                        {permissions.map((permission) => (
                                            <TableRow key={permission}>
                                                <TableCell sx={{ pl: 3 }}>
                                                    {translate(`psyched.permissions.items.${permission}`, { _: permission })}
                                                </TableCell>
                                                {ROLES.map((role) => (
                                                    <TableCell key={role} align="center" sx={{ py: 0 }}>
                                                        <Switch
                                                            size="small"
                                                            checked={(matrix[role] ?? []).includes(permission)}
                                                            onChange={() => togglePermission(role, permission)}
                                                        />
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </>
    );
}
