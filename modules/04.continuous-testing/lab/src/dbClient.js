const redis = require('redis')
const configure = require('./configure')

const config = configure()

// En production (Render), on utilise REDIS_URL (Upstash, en rediss://)
// En local et dans la CI, on utilise la config classique (localhost:6379)
const db = process.env.REDIS_URL
  ? redis.createClient(process.env.REDIS_URL, {
      tls: { rejectUnauthorized: false }
    })
  : redis.createClient({
      host: config.redis.host,
      port: config.redis.port,
      retry_strategy: () => {
        return new Error('Retry time exhausted')
      }
    })

process.on('SIGINT', function () {
  db.quit()
})

module.exports = db