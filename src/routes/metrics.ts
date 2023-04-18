import { FastifyInstance } from 'fastify'
import { knexDB } from '../database'
import { checkIfExistsCookie } from '../middlewares/check-if-exists-cookie'

const routes = async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request, reply) => {
    await checkIfExistsCookie(request, reply)
  })

  app.get('/', async (request, reply) => {
    const cookie = request.cookies.user_id

    const totalMealsAmount = await knexDB('meals')
      .where({ user_id: cookie })
      .count('id', { as: 'count' })
      .first()

    const totalMealsInsiteDietAmount = await knexDB('meals')
      .where({ user_id: cookie, inside_diet: true })
      .count('id', { as: 'count' })
      .first()

    const totalMealsOutsiteDietAmount = await knexDB('meals')
      .where({ user_id: cookie, inside_diet: false })
      .count('id', { as: 'count' })
      .first()

    const bestMealsInsiteDietAmount = await knexDB('meals')
      .where({
        user_id: cookie,
        inside_diet: true,
      })
      .groupBy('datetime')

    return {
      totalMealsAmount,
      totalMealsInsiteDietAmount,
      totalMealsOutsiteDietAmount,
      bestMealsInsiteDietAmount,
    }
  })
}

export default routes
