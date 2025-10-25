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
import { Edit as EditIcon } from '@mui/icons-material'
import { useState } from 'react'
import type { Asset as AssetType } from '../types'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'

const UPDATE_ASSET = gql`
    mutation UpdateAsset($asset: AssetUpdateInput) {
        updateAsset(asset: $asset) {
            type
            value
        }
    }
`

export const AssetItem = ({
    id,
    value,
    type,
    onAssetUpdated,
}: AssetType & { onAssetUpdated: () => void }) => {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editValue, setEditValue] = useState(value.toString())
    const [updateAsset, { loading, error }] = useMutation(UPDATE_ASSET)

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        console.error(error)
    }

    const handleEditClick = () => {
        setIsEditOpen(true)
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
                        <IconButton
                            onClick={handleEditClick}
                            size="small"
                            color="primary"
                        >
                            <EditIcon />
                        </IconButton>
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
        </>
    )
}
