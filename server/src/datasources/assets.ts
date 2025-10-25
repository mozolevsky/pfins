import Sequelize from 'sequelize'
import Assets from '../sequelize/models/assets'
import { connectSequelize } from '../sequelize/connect'
import { Asset } from '../types'

class AssetsDB {
    db: {
        Assets: any
        sequelize: any
        Sequelize: any
    }

    constructor() {
        const database = this.initDB()
        this.db = database
        this.ensureTablesExist()
    }

    initDB() {
        const sequelize = connectSequelize()

        const db = {
            Assets: Assets(sequelize, Sequelize.DataTypes),
            sequelize: sequelize,
            Sequelize: Sequelize,
        }

        return db
    }

    async ensureTablesExist() {
        try {
            await this.db.sequelize.sync({ force: false })
            console.log('✅ Database tables synchronized successfully.')
        } catch (error) {
            console.error('❌ Error synchronizing database tables:', error)
        }
    }

    async getAssets() {
        return this.db.Assets.findAll({
            attributes: ['id', 'type', 'value'],
        })
    }

    async addAsset(asset: Asset) {
        const created = await this.db.Assets.create(asset)
        console.log(`✅ Asset ${asset.type} added successfully.`)
        return created
    }

    async updateAsset({ id, value }: { id: string; value: number }) {
        try {
            await this.db.Assets.update({ value }, { where: { id } })
            const updated = await this.db.Assets.findByPk(id, {
                attributes: ['id', 'type', 'value'],
            })
            console.log(`✅ Asset ${id} updated successfully.`)
            return updated
        } catch (error) {
            console.error(`❌ Error updating asset ${id}:`, error)
            throw error
        }
    }

    async deleteAsset(id: string) {
        await this.db.Assets.destroy({ where: { id } })
        console.log(`✅ Asset ${id} deleted successfully.`)
        return id
    }

    async getAsset(id: string) {
        return this.db.Assets.findByPk(id, {
            attributes: ['id', 'type', 'value'],
        })
    }

    async getAssetByType(type: string) {
        return this.db.Assets.findAll({
            where: { type },
            attributes: ['id', 'type', 'value'],
        })
    }
}

export default AssetsDB
