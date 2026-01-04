import { useParams, useNavigate } from 'react-router'
import { useState, useEffect, useMemo } from 'react'
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
    CircularProgress,
    Backdrop,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { LineChart } from '@mui/x-charts/LineChart'
import {
    useGetAssetsByTypeQuery,
    useUpdateAssetMutation,
    useDeleteAssetMutation,
} from '../generated/graphql-types'

export const AssetPage = () => {
    const { type } = useParams<{ type: string }>()
    const navigate = useNavigate()
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [editValue, setEditValue] = useState('')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)

    const { data, loading, error, refetch } = useGetAssetsByTypeQuery({
        variables: { type: type || '' },
        skip: !type,
    })

    const [updateAsset, { loading: updateLoading }] = useUpdateAssetMutation()
    const [deleteAsset, { loading: deleteLoading }] = useDeleteAssetMutation()

    // Get current asset (most recent one)
    const currentAsset = useMemo(() => {
        if (!data?.assetByType || data.assetByType.length === 0) return null
        // Assuming the last one in the array is the most recent
        return data.assetByType[data.assetByType.length - 1]
    }, [data])

    // Prepare chart data
    const chartData = useMemo(() => {
        if (!data?.assetByType || data.assetByType.length === 0) {
            return { dates: [], values: [] }
        }

        // Sort by id (assuming id represents order) or use index as time
        const sortedAssets = [...data.assetByType]
            .filter((asset) => asset != null)
            .sort((a, b) => {
                if (!a?.id || !b?.id) return 0
                return a.id.localeCompare(b.id)
            })

        // Filter and convert values to numbers, ensuring no NaN
        const validData = sortedAssets
            .map((asset, index) => {
                const value = asset?.value
                const numValue =
                    value != null && !isNaN(Number(value))
                        ? Number(value)
                        : null
                return { index, value: numValue }
            })
            .filter((item) => item.value !== null)

        return {
            dates: validData.map((item) => item.index),
            values: validData.map((item) => item.value as number),
        }
    }, [data])

    useEffect(() => {
        if (error) {
            const message = error.message || 'Failed to load asset'
            setErrorMessage(message)
            setSnackbarOpen(true)
        }
    }, [error])

    const handleEditClick = () => {
        if (currentAsset?.value) {
            setEditValue(currentAsset.value.toString())
            setIsEditOpen(true)
        }
    }

    const handleDeleteClick = () => {
        setIsDeleteOpen(true)
    }

    const handleEditClose = () => {
        setIsEditOpen(false)
        if (currentAsset?.value) {
            setEditValue(currentAsset.value.toString())
        }
    }

    const handleDeleteClose = () => {
        setIsDeleteOpen(false)
    }

    const handleEditSave = () => {
        if (currentAsset?.id) {
            updateAsset({
                variables: {
                    asset: {
                        id: currentAsset.id,
                        value: Number(editValue),
                    },
                },
            })
                .then(() => {
                    refetch()
                    handleEditClose()
                })
                .catch((error) => {
                    const message =
                        error.message ||
                        'Failed to update asset. Please try again.'
                    setErrorMessage(message)
                    setSnackbarOpen(true)
                    handleEditClose()
                })
        }
    }

    const handleDeleteConfirm = () => {
        if (currentAsset?.id) {
            deleteAsset({ variables: { id: currentAsset.id } })
                .then(() => {
                    navigate('/')
                })
                .catch((error) => {
                    const message =
                        error.message ||
                        'Failed to delete asset. Please try again.'
                    setErrorMessage(message)
                    setSnackbarOpen(true)
                    handleDeleteClose()
                })
        }
    }

    const handleSnackbarClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return
        }
        setSnackbarOpen(false)
    }

    if (loading) {
        return (
            <Container>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh',
                    }}
                >
                    <CircularProgress />
                </Box>
            </Container>
        )
    }

    if (error || !currentAsset) {
        return (
            <Container>
                <Paper sx={{ p: 4, mt: 4 }}>
                    <Typography variant="h6" color="error">
                        {error?.message || 'Asset not found'}
                    </Typography>
                </Paper>
            </Container>
        )
    }

    return (
        <Container sx={{ py: 4 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    position: 'relative',
                    opacity: updateLoading || deleteLoading ? 0.6 : 1,
                }}
            >
                {/* Header - Asset Type */}
                <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
                    {currentAsset.type || type}
                </Typography>

                {/* Current Asset Value */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                    >
                        Current Value
                    </Typography>
                    <Typography variant="h3" color="primary">
                        {currentAsset.value?.toLocaleString() || '0'}
                    </Typography>
                </Box>

                {/* Graph with Asset Changes History */}
                <Box sx={{ mb: 4, minHeight: 300 }}>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        Value History
                    </Typography>
                    {chartData.values.length > 0 ? (
                        <LineChart
                            xAxis={[
                                {
                                    data: chartData.dates,
                                    label: 'Time',
                                },
                            ]}
                            yAxis={[
                                {
                                    label: 'Value',
                                },
                            ]}
                            series={[
                                {
                                    data: chartData.values,
                                    label: 'Asset Value',
                                    curve: 'linear',
                                },
                            ]}
                            height={300}
                        />
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 300,
                                border: '1px dashed',
                                borderColor: 'divider',
                            }}
                        >
                            <Typography color="text.secondary">
                                No history data available
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Action Buttons */}
                <Box
                    sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={handleEditClick}
                        disabled={updateLoading || deleteLoading}
                    >
                        Edit Asset Value
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={handleDeleteClick}
                        disabled={updateLoading || deleteLoading}
                    >
                        Delete Asset
                    </Button>
                </Box>

                {/* Loading Backdrop */}
                {(updateLoading || deleteLoading) && (
                    <Backdrop
                        open={true}
                        sx={{
                            position: 'absolute',
                            zIndex: 1,
                            borderRadius: 1,
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        }}
                    >
                        <CircularProgress />
                    </Backdrop>
                )}
            </Paper>

            {/* Edit Dialog */}
            <Dialog
                open={isEditOpen}
                onClose={handleEditClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Edit {currentAsset.type}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Asset Value"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        disabled={updateLoading}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} disabled={updateLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEditSave}
                        variant="contained"
                        disabled={updateLoading || !editValue}
                        startIcon={
                            updateLoading ? (
                                <CircularProgress size={16} />
                            ) : null
                        }
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                open={isDeleteOpen}
                onClose={handleDeleteClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Delete {currentAsset.type}?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete {currentAsset.type} with
                        value {currentAsset.value}? This action cannot be
                        undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleDeleteClose}
                        disabled={deleteLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        color="error"
                        disabled={deleteLoading}
                        startIcon={
                            deleteLoading ? (
                                <CircularProgress size={16} />
                            ) : null
                        }
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Error Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="error"
                    sx={{ width: '100%' }}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Container>
    )
}
