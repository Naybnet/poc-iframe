import type { FastifyInstance } from 'fastify'
import { getCountryStatisticsSchema, getUserStatisticsSchema } from './statistics.schema.js'
import { getCountryStatisticsHandler, getUserStatisticsHandler } from './statistics.controller.js'

export default async function (fastify: FastifyInstance) {
  fastify.get('/', { schema: getCountryStatisticsSchema }, getCountryStatisticsHandler)
  fastify.get('/:uid', { schema: getUserStatisticsSchema }, getUserStatisticsHandler)
}
