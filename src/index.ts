import express from 'express'
import { scrap, process as htmlProcess, Subject } from './scraper'

const cors = require('cors')
const compression = require('compression')
const app = express()
const port = process.env.PORT || 5000

app.use(
  cors({
    origin: '*',
  })
)

app.use(compression())

let data = ''
let parsedData: Array<Subject> = []
let interval: NodeJS.Timer
let timeout = 1000 * 60 * 60 // 1 hour

// Запрос на получение кэша
app.get('/', async (_, res) => {
  res.status(200).json(parsedData)
})

// Запрос на обновление кэша, если вдруг понадобится вне промежутка 1 часа
app.get('/update', async (_, res) => {
  await updateScrap()
  res.status(200).send()
})

const updateScrap = async () => {
  const scrapTmp = await scrap()
  data = scrapTmp.data || ''
  parsedData = htmlProcess(data)
}

app.listen(port, async () => {
  updateScrap()
  interval = setInterval(updateScrap, timeout)

  console.log(`Running on port ${port}`)
})
