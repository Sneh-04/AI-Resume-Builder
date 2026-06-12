import express from 'express'
import handler from './api/generate.js'

const app = express()
app.use(express.json())

app.post('/api/generate', (req, res) => handler(req, res))

const port = 3001
app.listen(port, () => {
  console.log(`Local API server running on http://localhost:${port}`)
})
