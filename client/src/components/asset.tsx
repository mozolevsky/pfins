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
} from '@mui/material'
import { Grid } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useState } from 'react'
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
    const [updateAsset, { loading, error }] = useUpdateAssetMutation()
    const [deleteAsset, { loading: deleteLoading, error: deleteError }] =
        useDeleteAssetMutation()

    if (loading || deleteLoading) {
        return <p>Loading...</p>
    }

    if (error) {
        console.error(error)
    }

    if (deleteError) {
        console.error(deleteError)
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
                console.error(error)
                handleClose()
            })
    }

    return (
        <>
            <Grid size={{ xs: 12, md: 6, lg: 3 }} key={id}>
                <Paper elevation={3} sx={{ p: 2 }}>
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
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                onClick={handleRemoveClick}
                                size="small"
                                color="error"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Box>
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
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={handleSave} variant="contained">
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
                    <Button onClick={handleDeleteClose}>Cancel</Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
