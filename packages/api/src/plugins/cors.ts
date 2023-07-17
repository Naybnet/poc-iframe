import fp from 'fastify-plugin'
import cors from '@fastify/cors'
import type { FastifyCorsOptions } from '@fastify/cors'

export default fp<FastifyCorsOptions>(async (fastify) => {
  fastify.register(cors, { origin: '*' })

  console.debug('cors plugin loaded')
})
