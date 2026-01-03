import { useState } from 'react'
import { useAddAssetMutation } from '../generated/graphql-types'
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material'

const AddAsset = ({
    title,
    onAssetCreated,
}: {
    title: string
    onAssetCreated: () => {}
}) => {
    const [open, setOpen] = useState(false)
    const [assetType, setAssetType] = useState('')
    const [assetValue, setAssetValue] = useState('§')

    const [createAsset, { loading, error }] = useAddAssetMutation()

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        console.log(error)
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setAssetType('')
        setAssetValue('')
    }

    const handleCreate = () => {
        if (!assetType || !assetValue) {
            // TODO: handle validation failure case
            handleClose()
        }

        createAsset({
            variables: {
                // TODO: add validation for asset value
                asset: { type: assetType, value: Number(assetValue) },
            },
        })
            .then(() => {
                onAssetCreated()
                handleClose()
            })
            .catch(() => {
                handleClose()
            })
    }

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
            >
                {title}
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>New asset</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Asset type"
                        fullWidth
                        variant="outlined"
                        value={assetType}
                        onChange={(e) => setAssetType(e.target.value)}
                        sx={{ mb: 2 }}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Asset value"
                        fullWidth
                        variant="outlined"
                        type="text"
                        value={assetValue}
                        onChange={(e) => setAssetValue(e.target.value)}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={handleCreate}
                        variant="contained"
                        disabled={!assetType || !assetValue}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export { AddAsset }
