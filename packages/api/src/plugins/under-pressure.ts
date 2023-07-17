import fp from 'fastify-plugin'
import underPressure from '@fastify/under-pressure'
import type { UnderPressureOptions } from '@fastify/under-pressure'

export default fp <UnderPressureOptions>(async (fastify) => {
  fastify.register(underPressure, {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 1000000000,
    maxRssBytes: 1000000000,
    maxEventLoopUtilization: 0.9,
  })

  console.log('under-pressure plugin loaded')
})
