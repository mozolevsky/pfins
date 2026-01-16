import { useParams } from 'react-router'
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
} from '@mui/material'
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Check as CheckIcon,
    Close as CloseIcon,
} from '@mui/icons-material'
import { LineChart } from '@mui/x-charts/LineChart'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import {
    useGetAssetWithHistoryQuery,
    useAddPriceRecordMutation,
    useUpdatePriceRecordMutation,
    useDeletePriceRecordMutation,
} from '../generated/graphql-types'

export const AssetPage = () => {
    const { type } = useParams<{ type: string }>()
    const [isAddPriceOpen, setIsAddPriceOpen] = useState(false)
    const [manualPrice, setManualPrice] = useState('')
    const [manualDate, setManualDate] = useState<Date | null>(new Date())
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [editingHistoryId, setEditingHistoryId] = useState<number | null>(
        null
    )
    const [editingHistoryPrice, setEditingHistoryPrice] = useState('')
    const [editingHistoryDate, setEditingHistoryDate] = useState<Date | null>(
        null
    )
    const [savingHistoryId, setSavingHistoryId] = useState<number | null>(null)
    const [deletingHistoryId, setDeletingHistoryId] = useState<number | null>(null)
    const [isDeleteHistoryOpen, setIsDeleteHistoryOpen] = useState(false)

    const { data, loading, error, refetch } = useGetAssetWithHistoryQuery({
        variables: {
            type: type || '',
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
        },
        skip: !type,
    })

    const [addPriceRecord, { loading: addPriceLoading }] =
        useAddPriceRecordMutation()
    const [updatePriceRecord] = useUpdatePriceRecordMutation()
    const [deletePriceRecord, { loading: deleteHistoryLoading }] =
        useDeletePriceRecordMutation()

    // Get current asset (should be a single asset now)
    const currentAsset = useMemo(() => {
        if (!data?.assetByType || data.assetByType.length === 0) return null
        // Take the first (and should be only) asset
        return data.assetByType[0]
    }, [data])

    // Prepare chart data from price history
    const chartData = useMemo(() => {
        if (
            !currentAsset?.priceHistory ||
            currentAsset.priceHistory.length === 0
        ) {
            return { dates: [], values: [], dateLabels: [] }
        }

        const history = [...currentAsset.priceHistory]
            .filter((record) => record != null)
            .sort((a, b) => {
                if (!a?.timestamp || !b?.timestamp) return 0
                return (
                    new Date(a.timestamp).getTime() -
                    new Date(b.timestamp).getTime()
                )
            })

        const dates = history.map((record) =>
            new Date(record.timestamp!).getTime()
        )
        const values = history.map((record) => record.price as number)
        const dateLabels = history.map((record) => {
            const date = new Date(record.timestamp!)
            return date.toLocaleDateString()
        })

        return { dates, values, dateLabels }
    }, [currentAsset])

    const historyRows = useMemo(() => {
        if (
            !currentAsset?.priceHistory ||
            currentAsset.priceHistory.length === 0
        )
            return []

        return [...currentAsset.priceHistory]
            .filter((record) => record != null)
            .sort((a, b) => {
                if (!a?.timestamp || !b?.timestamp) return 0
                return (
                    new Date(a.timestamp).getTime() -
                    new Date(b.timestamp).getTime()
                )
            })
            .map((record) => ({
                id: record!.id as number,
                price: record!.price as number,
                timestamp: record!.timestamp as string,
            }))
    }, [currentAsset])

    useEffect(() => {
        if (error) {
            const message = error.message || 'Failed to load asset'
            setErrorMessage(message)
            setSnackbarOpen(true)
        }
    }, [error])

    // Asset-level edit/delete controls removed per requirement

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

    const handleHistoryEditStart = (row: {
        id: number
        price: number
        timestamp: string
    }) => {
        setEditingHistoryId(row.id)
        setEditingHistoryPrice(String(row.price))
        setEditingHistoryDate(new Date(row.timestamp))
    }

    const handleHistoryEditCancel = () => {
        setEditingHistoryId(null)
        setEditingHistoryPrice('')
        setEditingHistoryDate(null)
    }

    const handleHistoryDeleteClick = (id: number) => {
        setDeletingHistoryId(id)
        setIsDeleteHistoryOpen(true)
    }

    const handleHistoryDeleteClose = () => {
        setIsDeleteHistoryOpen(false)
        setDeletingHistoryId(null)
    }

    const handleHistoryDeleteConfirm = async () => {
        if (deletingHistoryId == null) return

        try {
            await deletePriceRecord({ variables: { id: deletingHistoryId } })
            await refetch()
            if (editingHistoryId === deletingHistoryId) {
                handleHistoryEditCancel()
            }
            handleHistoryDeleteClose()
        } catch (error: any) {
            const message =
                error?.message ||
                'Failed to delete price record. Please try again.'
            setErrorMessage(message)
            setSnackbarOpen(true)
            handleHistoryDeleteClose()
        }
    }

    const toDateOnlyIsoString = (date: Date) => {
        const localMidnight = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        )
        return localMidnight.toISOString()
    }

    const handleHistoryEditSave = async () => {
        if (
            editingHistoryId == null ||
            !editingHistoryPrice ||
            !editingHistoryDate
        ) {
            return
        }

        setSavingHistoryId(editingHistoryId)
        try {
            await updatePriceRecord({
                variables: {
                    id: editingHistoryId,
                    price: Number(editingHistoryPrice),
                    timestamp: toDateOnlyIsoString(editingHistoryDate),
                },
            })
            await refetch()
            handleHistoryEditCancel()
        } catch (error: any) {
            const message =
                error?.message ||
                'Failed to update price record. Please try again.'
            setErrorMessage(message)
            setSnackbarOpen(true)
        } finally {
            setSavingHistoryId(null)
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
                    opacity: 1,
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
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6" color="text.secondary">
                            Value History
                        </Typography>
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
                                    actionBar: { actions: ['clear'] },
                                }}
                            />
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                slotProps={{
                                    textField: { size: 'small' },
                                    actionBar: { actions: ['clear'] },
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
                                    valueFormatter: (value) =>
                                        new Date(value).toLocaleDateString(),
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
                            margin={{
                                left: 70,
                                right: 20,
                                top: 20,
                                bottom: 70,
                            }}
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
                                No history data available. Add price records to
                                see the chart.
                            </Typography>
                        </Box>
                    )}

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 2,
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleAddPriceClick}
                            size="small"
                        >
                            Add Price Record
                        </Button>
                    </Box>
                </Box>

                {/* History Table */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        History
                    </Typography>

                    {historyRows.length > 0 ? (
                        <TableContainer
                            component={Paper}
                            variant="outlined"
                            sx={{ overflow: 'hidden' }}
                        >
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell align="right">
                                                Value
                                            </TableCell>
                                            <TableCell align="right">
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {historyRows.map((row) => {
                                            const isEditing =
                                                editingHistoryId === row.id
                                            const isSaving =
                                                savingHistoryId === row.id
                                            const isDeleting =
                                                deleteHistoryLoading &&
                                                deletingHistoryId === row.id

                                            return (
                                                <TableRow key={row.id}>
                                                    <TableCell
                                                        sx={{ width: 220 }}
                                                    >
                                                        {isEditing ? (
                                                            <DatePicker
                                                                value={
                                                                    editingHistoryDate
                                                                }
                                                                onChange={(
                                                                    newValue
                                                                ) =>
                                                                    setEditingHistoryDate(
                                                                        newValue
                                                                    )
                                                                }
                                                                slotProps={{
                                                                    textField: {
                                                                        size: 'small',
                                                                        fullWidth:
                                                                            true,
                                                                    },
                                                                }}
                                                            />
                                                        ) : (
                                                            new Date(
                                                                row.timestamp
                                                            ).toLocaleDateString()
                                                        )}
                                                    </TableCell>
                                                    <TableCell
                                                        align="right"
                                                        sx={{ width: 200 }}
                                                    >
                                                        {isEditing ? (
                                                            <TextField
                                                                value={
                                                                    editingHistoryPrice
                                                                }
                                                                onChange={(e) =>
                                                                    setEditingHistoryPrice(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                type="number"
                                                                size="small"
                                                                fullWidth
                                                                disabled={
                                                                    isSaving
                                                                }
                                                            />
                                                        ) : (
                                                            row.price.toLocaleString()
                                                        )}
                                                    </TableCell>
                                                    <TableCell
                                                        align="right"
                                                        sx={{ width: 140 }}
                                                    >
                                                        {isEditing ? (
                                                            <>
                                                                <Tooltip title="Save">
                                                                    <span>
                                                                        <IconButton
                                                                            onClick={
                                                                                handleHistoryEditSave
                                                                            }
                                                                            size="small"
                                                                            disabled={
                                                                                isSaving ||
                                                                                !editingHistoryPrice ||
                                                                                !editingHistoryDate
                                                                            }
                                                                        >
                                                                            {isSaving ? (
                                                                                <CircularProgress
                                                                                    size={
                                                                                        18
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <CheckIcon fontSize="small" />
                                                                            )}
                                                                        </IconButton>
                                                                    </span>
                                                                </Tooltip>
                                                                <Tooltip title="Cancel">
                                                                    <span>
                                                                        <IconButton
                                                                            onClick={
                                                                                handleHistoryEditCancel
                                                                            }
                                                                            size="small"
                                                                            disabled={
                                                                                isSaving
                                                                            }
                                                                        >
                                                                            <CloseIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </span>
                                                                </Tooltip>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Tooltip title="Edit">
                                                                    <span>
                                                                        <IconButton
                                                                            onClick={() =>
                                                                                handleHistoryEditStart(
                                                                                    row
                                                                                )
                                                                            }
                                                                            size="small"
                                                                            disabled={
                                                                                savingHistoryId !=
                                                                                    null ||
                                                                                deleteHistoryLoading
                                                                            }
                                                                        >
                                                                            <EditIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </span>
                                                                </Tooltip>
                                                                <Tooltip title="Delete">
                                                                    <span>
                                                                        <IconButton
                                                                            onClick={() =>
                                                                                handleHistoryDeleteClick(
                                                                                    row.id
                                                                                )
                                                                            }
                                                                            size="small"
                                                                            color="error"
                                                                            disabled={
                                                                                savingHistoryId !=
                                                                                    null ||
                                                                                deleteHistoryLoading
                                                                            }
                                                                        >
                                                                            {isDeleting ? (
                                                                                <CircularProgress
                                                                                    size={18}
                                                                                />
                                                                            ) : (
                                                                                <DeleteIcon fontSize="small" />
                                                                            )}
                                                                        </IconButton>
                                                                    </span>
                                                                </Tooltip>
                                                            </>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </LocalizationProvider>
                        </TableContainer>
                    ) : (
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                borderStyle: 'dashed',
                                borderColor: 'divider',
                            }}
                        >
                            <Typography color="text.secondary">
                                No history records yet.
                            </Typography>
                        </Paper>
                    )}
                </Box>

                {/* Loading Backdrop */}
                {addPriceLoading && (
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
                    <Button
                        onClick={handleAddPriceClose}
                        disabled={addPriceLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddPriceSave}
                        variant="contained"
                        disabled={
                            addPriceLoading || !manualPrice || !manualDate
                        }
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

            {/* Delete History Record Dialog */}
            <Dialog
                open={isDeleteHistoryOpen}
                onClose={handleHistoryDeleteClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Delete history record?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this history record? This
                        action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleHistoryDeleteClose}
                        disabled={deleteHistoryLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleHistoryDeleteConfirm}
                        variant="contained"
                        color="error"
                        disabled={deleteHistoryLoading}
                        startIcon={
                            deleteHistoryLoading ? (
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
