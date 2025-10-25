import { Paper, Typography } from '@mui/material'
import { Grid } from '@mui/material'
import type { Asset as AssetType } from '../types'

export const AssetItem = ({ value, type }: AssetType) => {
    return (
        <Grid size={{ xs: 12, md: 6, lg: 3 }} key={type}>
            <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" component="div" sx={{ mb: 0 }}>
                    {type}: {value}
                </Typography>
            </Paper>
        </Grid>
    )
}
