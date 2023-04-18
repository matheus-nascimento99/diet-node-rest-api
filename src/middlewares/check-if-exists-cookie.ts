import { FastifyRequest, FastifyReply } from 'fastify'
import { knexDB } from '../database'

export const checkIfExistsCookie = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const cookie = request.cookies.user_id

  if (!cookie) {
    return reply.status(401).send({
      error: 'Not authorized.',
    })
  }

  const user = await knexDB('users').where({ user_id: cookie }).first()

  if (!user) {
    return reply.status(401).send({
      error: 'Not authorized.',
    })
  }
}
