import type { FastifyReply, FastifyRequest } from 'fastify'
import { getCountryStatistics, getUserStatistics } from './statistics.service.js'
import type { GetUserStatisticsParams } from './statistics.schema.js'

export function getCountryStatisticsHandler(_: unknown, reply: FastifyReply) {
  try {
    const stat = getCountryStatistics()
    reply.code(200).send(stat)
  }
  catch (error: unknown) {
    reply.code(404).send({ error: 'not found' })
  }
}

export function getUserStatisticsHandler(request: FastifyRequest<{ Params: GetUserStatisticsParams }>, reply: FastifyReply) {
  try {
    reply.send(getUserStatistics(request.params.uid))
  }
  catch (error: unknown) {
    reply.code(404).send({ error: 'not found' })
  }
}
