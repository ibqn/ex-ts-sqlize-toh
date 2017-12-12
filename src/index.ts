import * as http from 'http'
import * as express from 'express'
import { Request, Response, /* NextFunction */ } from "express"
import * as morgan from 'morgan'
import * as bodyParser from 'body-parser'
import api from './routes/api'
import { initDb } from './db'
import * as nconf from 'nconf'


const app: express.Application = express()
const server: http.Server = http.createServer(app)

nconf.argv()
  .env()
  .file({ file: './config.json' });

async function run() {
  app.use(morgan('dev'))

  app.use(bodyParser.json({
    limit: nconf.get('bodyLimit')
  }))

  initDb().catch(error => {
    console.error(`Database connection error: ${error.stack}`)
    //process.exit()
  })


  app.get('/', async (req: Request, res: Response) => {
    res.json({
      status: 'success',
      result: `Express js is running on port ${nconf.get('port')}`
    })
  })

  app.use('/api', api)

  app.use(async (req: Request, res: Response, /*next: NextFunction*/) => {
    res.status(404).format({
      default: () => res.json({
        status: 'failure',
        message: 'Not found'
      })
    })
  })

  server.listen(nconf.get('port'), async () => {
    console.log(`Started on port ${server.address().port}`)
  })
}

run().catch(error => console.error(error.stack))
