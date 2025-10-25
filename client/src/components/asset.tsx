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

export const AssetItem = ({ value, type }: AssetType) => {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editValue, setEditValue] = useState(value.toString())

    const handleEditClick = () => {
        setIsEditOpen(true)
    }

    const handleClose = () => {
        setIsEditOpen(false)
        setEditValue(value.toString()) // Reset to original value
    }

    const handleSave = () => {
        console.log(`Saving ${type}: ${editValue}`)
        setIsEditOpen(false)
    }

    return (
        <>
            <Grid size={{ xs: 12, md: 6, lg: 3 }} key={type}>
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
