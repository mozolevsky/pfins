import AssetsDB from '../datasources/assets'
import PriceHistoryDB from '../datasources/priceHistory'
import db from '../datasources/db'

async function main() {
    // Ensure tables exist (best-effort; db constructor already syncs)
    await db.sequelize.sync({ force: false })

    const assets = (await db.Assets.findAll({
        attributes: ['id', 'type', 'value'],
        raw: true,
    })) as unknown as Array<{ id: string; type?: string; value?: number | null }>

    let createdCount = 0
    for (const asset of assets) {
        if (!asset.id) continue

        const latest = await PriceHistoryDB.getLatestPrice(asset.id)
        if (latest) continue

        if (typeof asset.value !== 'number' || Number.isNaN(asset.value)) {
            console.warn(
                `⚠️ Skipping asset ${asset.id} (${asset.type ?? 'unknown'}): value is not a number`
            )
            continue
        }

        await PriceHistoryDB.addPriceRecord(asset.id, asset.value)
        await AssetsDB.setAssetValue({ id: asset.id, value: asset.value })
        createdCount++

        console.log(
            `✅ Backfilled price history for asset ${asset.id} (${asset.type ?? 'unknown'}) with value ${asset.value}`
        )
    }

    console.log(`✅ Backfill complete. Created ${createdCount} history record(s).`)
}

main().catch((error) => {
    console.error('❌ Backfill failed:', error)
    process.exitCode = 1
})

