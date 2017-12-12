import { Router } from 'express'
import { Hero } from '../models/hero'
import { asyncMiddleware } from '../tools'
import { Request, Response, /*NextFunction*/ } from 'express'
import * as Sequelize from 'sequelize'


const heroes: Router = Router()

// define the mongobd ObjectId filter once for all routes
const objectIdFilter = "[0-9,a-f,-]*"

// GET all heroes
heroes.get('/', asyncMiddleware(async (req: Request, res: Response) => {
  const heroesList = await Hero.findAll({ attributes: ['id', 'name'] })
  //console.log(`heroes '${heroesList}'`)
  res.json({
    status: 'success',
    result: heroesList
  })
}))

const Op = Sequelize.Op

heroes.get('/search/:term', asyncMiddleware(async (req: Request, res: Response) => {
  const searchList = await Hero.findAll({
    where: { name: { [Op.like]: `%${req.params.term}%` } },
    attributes: ['id', 'name']
  })
  res.json({
    status: 'success',
    result: searchList
  })
}))

// GET: get one hero by its ID
heroes.get(`/:heroId(${objectIdFilter})`, asyncMiddleware(async (req: Request, res: Response) => {
  const hero = await Hero.findOne({
    where: { id: req.params.heroId },
    attributes: ['id', 'name']
  })
  if (hero === null) throw new Error('Get: Item does not exist')
  res.json({
    status: 'success',
    result: hero
  })
}))

// POST: add new hero
heroes.post('/', asyncMiddleware(async (req: Request, res: Response) => {
  const hero = await Hero.create(req.body)
  res.status(201).json({
    status: 'success',
    result: hero
  })
}))

// PUT: update an existing hero by ID
heroes.put(`/:heroId(${objectIdFilter})`, asyncMiddleware(async (req: Request, res: Response) => {
  const [count, ] = await Hero.update(req.body, { where: { id: req.params.heroId } })
  if (count !== 1) throw new Error('Update: Item does not exist')
  const hero = await Hero.findOne({
    where: { id: req.params.heroId },
    attributes: ['id', 'name']
  })
  res.json({
    status: 'success',
    result: hero
  })
}))

// DELETE: remove an existing hero by ID
heroes.delete(`/:heroId(${objectIdFilter})`, asyncMiddleware(async (req: Request, res: Response) => {
  const count = await Hero.destroy({ where: { id: req.params.heroId } })
  if (count !== 1) throw new Error('Delete: Item does not exist')
  res.status(204).json()
}))

export default heroes
