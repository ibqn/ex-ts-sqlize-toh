import * as Sequelize from 'sequelize'
import { sequelize as db } from '../db'


export const Hero = db.define('hero', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    //defaultValue: null,
  },
  created_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
},
{
  timestamps: true,
  underscored: true,
  paranoid: true,
  freezeTableName: true,
  tableName: 'hero'
})

async function syncHero() {
  await Hero.sync()
  console.log('table is in sync')
}

syncHero().catch(error => {
  console.error(`Failed to create hero table: ${error.stack}`)
  process.exit()
})
