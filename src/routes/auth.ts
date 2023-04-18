import { FastifyInstance } from 'fastify'
import { knexDB } from '../database'
import { z } from 'zod'

const routes = async (app: FastifyInstance) => {
  app.post('/', async (request, reply) => {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const data = loginSchema.parse(request.body)

    const { email, password } = data

    const user = await knexDB('users')
      .where({
        email,
        password,
      })
      .select('*')
      .first()

    if (!user) {
      return reply.status(404).send()
    }

    reply.setCookie('user_id', user.user_id, {
      maxAge: 1000 * 60 * 60 * 24 * 5, // 5 days
    })

    reply.status(200).send()
  })
}

export default routes
