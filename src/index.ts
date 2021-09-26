import express from 'express'
import {scrap, process, Subject} from "./scraper";

const cors = require('cors')
const compression = require('compression');
const app = express()
const port = 5000

app.use(cors({
    origin: '*'
}))

app.use(compression())

let data = ''
let parsedData: Array<Subject> = []
let interval: NodeJS.Timer
let timeout = 1000 * 60 * 60 // 1 hour

app.get('/', async (_, res) => {
    res.status(200).json(parsedData)
})

app.get('/update', async (_, res) => {
    await updateScrap()
    res.status(200).send()
})

const updateScrap = async () => {
    const scrapTmp = await scrap()
    data = scrapTmp.data || ''
    parsedData = process((data))
}

app.listen(port, async () =>{
    await updateScrap()
    interval = setInterval(updateScrap, timeout)

    console.log(`Running on port ${port}`)
})

