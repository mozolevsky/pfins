import {
    Paper,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Snackbar,
    Alert,
    CircularProgress,
    Backdrop,
} from '@mui/material'
import { Grid } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import {
    type Asset as AssetType,
    useUpdateAssetMutation,
    useDeleteAssetMutation,
} from '../generated/graphql-types'

export const AssetItem = ({
    id,
    value,
    type,
    onAssetUpdated,
}: AssetType & { onAssetUpdated: () => void }) => {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [editValue, setEditValue] = useState(value.toString())
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [updateAsset, { loading, error }] = useUpdateAssetMutation()
    const [deleteAsset, { loading: deleteLoading, error: deleteError }] =
        useDeleteAssetMutation()

    useEffect(() => {
        if (error) {
            const message = error.message || 'Failed to update asset'
            setErrorMessage(message)
            setSnackbarOpen(true)
            console.error(error)
        }
    }, [error])

    useEffect(() => {
        if (deleteError) {
            const message = deleteError.message || 'Failed to delete asset'
            setErrorMessage(message)
            setSnackbarOpen(true)
            console.error(deleteError)
        }
    }, [deleteError])

    const handleSnackbarClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return
        }
        setSnackbarOpen(false)
    }

    const handleEditClick = () => {
        setIsEditOpen(true)
    }

    const handleRemoveClick = () => {
        setIsDeleteOpen(true)
    }

    const handleDeleteClose = () => {
        setIsDeleteOpen(false)
    }

    const handleDeleteConfirm = () => {
        if (id) {
            deleteAsset({ variables: { id } })
                .then(() => {
                    onAssetUpdated()
                    handleDeleteClose()
                })
                .catch((error) => {
                    const message =
                        error.message ||
                        'Failed to delete asset. Please try again.'
                    setErrorMessage(message)
                    setSnackbarOpen(true)
                    console.error(error)
                    handleDeleteClose()
                })
        }
    }

    const handleClose = () => {
        setIsEditOpen(false)
        setEditValue(value.toString()) // Reset to original value
    }

    const handleSave = () => {
        updateAsset({ variables: { asset: { id, value: Number(editValue) } } })
            .then(() => {
                onAssetUpdated()
                handleClose()
            })
            .catch((error) => {
                const message =
                    error.message || 'Failed to update asset. Please try again.'
                setErrorMessage(message)
                setSnackbarOpen(true)
                console.error(error)
                handleClose()
            })
    }

    return (
        <>
            <Grid size={{ xs: 12, md: 6, lg: 3 }} key={id}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 2,
                        position: 'relative',
                        opacity: loading || deleteLoading ? 0.6 : 1,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h6" component="div" sx={{ mb: 0 }}>
                            {type}: {value}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton
                                onClick={handleEditClick}
                                size="small"
                                color="primary"
                                disabled={loading || deleteLoading}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                onClick={handleRemoveClick}
                                size="small"
                                color="error"
                                disabled={loading || deleteLoading}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Box>
                    {(loading || deleteLoading) && (
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
            </Grid>

            <Dialog
                open={isEditOpen}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Edit {type}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={type}
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        disabled={loading}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>
                        Close
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={loading}
                        startIcon={
                            loading ? <CircularProgress size={16} /> : null
                        }
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={isDeleteOpen}
                onClose={handleDeleteClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Delete {type}?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete {type} with value{' '}
                        {value}? This action cannot be undone.
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
        </>
    )
}
