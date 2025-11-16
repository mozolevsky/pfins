import { useMemo } from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import type { Asset } from '../generated/graphql-types'

export const TotalChart = ({ assets }: { assets: Asset[] }) => {
    const titles = useMemo(() => {
        return assets.map((asset) => asset.type)
    }, assets)

    const total = useMemo(() => {
        return assets.reduce((acc, asset) => acc + asset.value, 0)
    }, assets)

    const data = useMemo(() => {
        return assets.map((asset) => (asset.value / total) * 100)
    }, assets)

    return (
        <BarChart
            xAxis={[
                {
                    id: 'barCategories',
                    data: titles,
                },
            ]}
            yAxis={[
                {
                    valueFormatter: (value: number | null) =>
                        `${(value ?? 0).toFixed(0)}%`,
                },
            ]}
            series={[
                {
                    data: data,
                    label: 'share',
                    valueFormatter: (value: number | null) =>
                        `${(value ?? 0).toFixed(0)}%`,
                },
            ]}
            height={300}
        />
    )
}
