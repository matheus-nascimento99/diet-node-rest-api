import { FastifyInstance } from 'fastify'
import { knexDB } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

const routes = async (app: FastifyInstance) => {
  app.post('/', async (request, reply) => {
    const userSchema = z.object({
      name: z.string(),
      age: z.coerce.number(),
      email: z.string().email(),
      password: z.string(),
    })

    const data = userSchema.parse(request.body)

    const { name, age, email, password } = data

    await knexDB('users').insert({
      user_id: randomUUID(),
      name,
      age,
      email,
      password,
    })

    return reply.status(201).send()
  })

  app.get('/', async () => {
    const users = await knexDB('users').select('*')

    return {
      users,
    }
  })
}

export default routes
