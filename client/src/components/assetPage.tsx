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
    Stack,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import { LineChart } from '@mui/x-charts/LineChart'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import {
    useGetAssetWithHistoryQuery,
    useUpdateAssetMutation,
    useDeleteAssetMutation,
    useAddPriceRecordMutation,
} from '../generated/graphql-types'

export const AssetPage = () => {
    const { type } = useParams<{ type: string }>()
    const navigate = useNavigate()
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isAddPriceOpen, setIsAddPriceOpen] = useState(false)
    const [editValue, setEditValue] = useState('')
    const [manualPrice, setManualPrice] = useState('')
    const [manualDate, setManualDate] = useState<Date | null>(new Date())
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)

    const { data, loading, error, refetch } = useGetAssetWithHistoryQuery({
        variables: { 
            type: type || '',
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
        },
        skip: !type,
    })

    const [updateAsset, { loading: updateLoading }] = useUpdateAssetMutation()
    const [deleteAsset, { loading: deleteLoading }] = useDeleteAssetMutation()
    const [addPriceRecord, { loading: addPriceLoading }] = useAddPriceRecordMutation()

    // Get current asset (should be a single asset now)
    const currentAsset = useMemo(() => {
        if (!data?.assetByType || data.assetByType.length === 0) return null
        // Take the first (and should be only) asset
        return data.assetByType[0]
    }, [data])

    // Prepare chart data from price history
    const chartData = useMemo(() => {
        if (!currentAsset?.priceHistory || currentAsset.priceHistory.length === 0) {
            return { dates: [], values: [], dateLabels: [] }
        }

        const history = [...currentAsset.priceHistory]
            .filter((record) => record != null)
            .sort((a, b) => {
                if (!a?.timestamp || !b?.timestamp) return 0
                return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            })

        const dates = history.map(record => new Date(record.timestamp!).getTime())
        const values = history.map(record => record.price as number)
        const dateLabels = history.map(record => {
            const date = new Date(record.timestamp!)
            return date.toLocaleDateString()
        })

        return { dates, values, dateLabels }
    }, [currentAsset])

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

    const handleAddPriceClick = () => {
        setManualPrice('')
        setManualDate(new Date())
        setIsAddPriceOpen(true)
    }

    const handleAddPriceClose = () => {
        setIsAddPriceOpen(false)
    }

    const handleAddPriceSave = () => {
        if (currentAsset?.id && manualPrice && manualDate) {
            addPriceRecord({
                variables: {
                    assetId: currentAsset.id,
                    price: Number(manualPrice),
                    timestamp: manualDate.toISOString(),
                },
            })
                .then(() => {
                    refetch()
                    handleAddPriceClose()
                })
                .catch((error) => {
                    const message =
                        error.message ||
                        'Failed to add price record. Please try again.'
                    setErrorMessage(message)
                    setSnackbarOpen(true)
                    handleAddPriceClose()
                })
        }
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
                <Box sx={{ mb: 4, minHeight: 400 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                        >
                            Value History
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleAddPriceClick}
                            size="small"
                        >
                            Add Price Record
                        </Button>
                    </Box>
                    
                    {/* Date Range Filters */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                slotProps={{ 
                                    textField: { size: 'small' },
                                    actionBar: { actions: ['clear'] }
                                }}
                            />
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                slotProps={{ 
                                    textField: { size: 'small' },
                                    actionBar: { actions: ['clear'] }
                                }}
                            />
                        </Stack>
                    </LocalizationProvider>

                    {chartData.values.length > 0 ? (
                        <LineChart
                            xAxis={[
                                {
                                    data: chartData.dates,
                                    label: 'Date',
                                    scaleType: 'time',
                                    valueFormatter: (value) => new Date(value).toLocaleDateString(),
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
                                    showMark: true,
                                },
                            ]}
                            height={300}
                            margin={{ left: 70, right: 20, top: 20, bottom: 70 }}
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
                                No history data available. Add price records to see the chart.
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
                {(updateLoading || deleteLoading || addPriceLoading) && (
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

            {/* Add Price Record Dialog */}
            <Dialog
                open={isAddPriceOpen}
                onClose={handleAddPriceClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Add Price Record</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <TextField
                                autoFocus
                                label="Price"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={manualPrice}
                                onChange={(e) => setManualPrice(e.target.value)}
                                disabled={addPriceLoading}
                            />
                            <DatePicker
                                label="Date"
                                value={manualDate}
                                onChange={(newValue) => setManualDate(newValue)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        variant: 'outlined',
                                    },
                                }}
                            />
                        </Stack>
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddPriceClose} disabled={addPriceLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddPriceSave}
                        variant="contained"
                        disabled={addPriceLoading || !manualPrice || !manualDate}
                        startIcon={
                            addPriceLoading ? (
                                <CircularProgress size={16} />
                            ) : null
                        }
                    >
                        Add
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
