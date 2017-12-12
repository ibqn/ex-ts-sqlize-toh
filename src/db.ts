import * as Sequelize from 'sequelize'
import * as path from 'path'


export const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'sqlite',
  database: 'heroes',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  operatorsAliases: false,
  logging: console.log,
  //logging: false,

  storage: path.join(path.dirname(path.dirname(__filename)), 'heroes.sqlite')
})

export const initDb = async () => {
  await sequelize.authenticate()
  console.log('successfully connected to the database')
}
