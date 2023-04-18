import fastify from 'fastify'
import dailyDietRoutes from './routes/daily-diet'
import usersRoutes from './routes/users'
import authRoutes from './routes/auth'
import metricsRoutes from './routes/metrics'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)

app.register(authRoutes, {
  prefix: 'login',
})

app.register(dailyDietRoutes, {
  prefix: 'meals',
})

app.register(usersRoutes, {
  prefix: 'users',
})

app.register(metricsRoutes, {
  prefix: 'metrics',
})

app.setNotFoundHandler(async (request, reply) => {
  reply.status(404)
})
