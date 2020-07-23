const http = require('http')
const Koa = require('koa')
const Router = require('koa-router')
const cors = require('koa2-cors')
// Fake News Generator
const faker = require('faker')

// Init the app on Koa
const app = new Koa()
app.use(cors())

// Set counter for ID
let nextId = 1

// Set the length of the news feed in items
const latestCount = 3

// Create initial news feed
const news = [
  { id: nextId++, content: faker.lorem.sentence() },
  { id: nextId++, content: faker.lorem.sentence() },
  { id: nextId++, content: faker.lorem.sentence() },
]

// Set frequency of feed update (on server)
setInterval(() => {
  news.push({ id: nextId++, content: faker.lorem.sentence() })
}, 1 * 1000) // 1 sec is set for demonstration only

// Create a new router
const router = new Router()

// Set an endpoint for this REST API and
// the length of the news feed to be sent
router.get('/news/latest', async (ctx, next) => {
  ctx.response.body = news
    .slice(news.length - latestCount, news.length)
    .reverse()
})

// Init the router on this server on port 7070 by default
app.use(router.routes()).use(router.allowedMethods())
http.createServer(app.callback()).listen(process.env.PORT || 7070)
