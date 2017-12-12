import { Router } from 'express'
import heroes from './heroes'


const api: Router = Router()

api.use('/hero', heroes)

export default api
