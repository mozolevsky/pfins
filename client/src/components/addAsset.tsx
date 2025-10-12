import { useState } from "react"
import { gql } from '@apollo/client'
import {useMutation} from '@apollo/client/react'
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Input
} from "@mui/material"

const CREATE_ASSET = gql`
  mutation AddAsset($asset: AssetInput) {
    addAsset(asset: $asset) {
      type
      value
    }
}
`

const AddAsset = ({title, onAssetCreated}: {title: string, onAssetCreated: () => {}}) => {
  const [open, setOpen] = useState(false)
  const [assetType, setAssetType] = useState("")
  const [assetValue, setAssetValue] = useState(0)

  const [createAsset, {data, loading, error}] = useMutation(CREATE_ASSET)

  if (loading) {
    return (
      <p>Loading...</p>
    )
  }

  if (error) {
    console.log(error)
  }


  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setAssetType("")
    setAssetValue(0)
  }

  const handleCreate = () => {
    if (!assetType || !assetValue) {
      // TODO: handle validation failure case
      handleClose()
    }

    createAsset({variables: {asset: {type: assetType, value: assetValue}}}).then(() => {
      onAssetCreated()
      handleClose()
    }).catch(() => {
      handleClose()
    })
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
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
            type="number"
            value={assetValue}
            onChange={(e) => setAssetValue(Number(e.target.value))}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={!assetType || !assetValue}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export { AddAsset }