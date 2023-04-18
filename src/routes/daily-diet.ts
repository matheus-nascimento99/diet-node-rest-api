import { FastifyInstance } from 'fastify'
import { knexDB } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkIfExistsCookie } from '../middlewares/check-if-exists-cookie'
import { requestGeneric } from '../@types/fastify'

const routes = async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request, reply) => {
    await checkIfExistsCookie(request, reply)
  })

  app.post('/', async (request, reply) => {
    const mealSchema = z.object({
      name: z.string(),
      description: z.string(),
      datetime: z.string().datetime({ offset: true }),
      insideDiet: z.boolean(),
    })

    const data = mealSchema.parse(request.body)

    const { name, description, datetime, insideDiet } = data

    const cookie = request.cookies.user_id

    await knexDB('meals').insert({
      id: randomUUID(),
      user_id: cookie,
      name,
      description,
      datetime: new Date(datetime).toISOString(),
      inside_diet: insideDiet,
    })

    reply.status(201).send()
  })

  app.get('/', async (request) => {
    const cookie = request.cookies.user_id
    const meals = await knexDB('meals').where({ user_id: cookie }).select('*')

    return {
      meals,
    }
  })

  app.get<requestGeneric>('/:id', async (request, reply) => {
    const { id } = request.params
    const cookie = request.cookies.user_id

    if (!id) {
      return reply.status(400).send()
    }

    const meal = await knexDB('meals').where({ id, user_id: cookie }).first()

    if (!meal) {
      return reply.status(404).send()
    }

    return {
      meal,
    }
  })

  app.put<requestGeneric>('/:id', async (request, reply) => {
    const { id } = request.params
    const cookie = request.cookies.user_id

    if (!id) {
      return reply.status(400).send()
    }

    const meal = await knexDB('meals')
      .where({ id, user_id: cookie })
      .select('*')
      .first()

    if (!meal) {
      return reply.status(404).send()
    }

    const mealSchema = z.object({
      name: z.string(),
      description: z.string(),
      datetime: z.string().datetime({ offset: true }),
      insideDiet: z.boolean(),
    })

    const data = mealSchema.parse(request.body)

    const { name, description, datetime, insideDiet } = data

    await knexDB('meals')
      .update({
        name,
        description,
        datetime: new Date(datetime).toISOString(),
        inside_diet: insideDiet,
        updated_at: new Date().toISOString(),
      })
      .where({ id, user_id: cookie })

    reply.status(204).send()
  })

  app.delete<requestGeneric>('/:id', async (request, reply) => {
    const { id } = request.params
    const cookie = request.cookies.user_id

    if (!id) {
      return reply.status(400).send()
    }

    const meal = await knexDB('meals')
      .where({ id, user_id: cookie })
      .select('*')
      .first()

    if (!meal) {
      return reply.status(404).send()
    }

    await knexDB('meals').where({ id, user_id: cookie }).del()

    reply.status(204).send()
  })
}

export default routes
