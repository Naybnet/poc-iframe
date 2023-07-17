import { fastifyAutoload } from '@fastify/autoload'
import type { FastifyPluginAsync } from 'fastify'
import type { AutoloadPluginOptions } from '@fastify/autoload'

const app: FastifyPluginAsync<Partial<AutoloadPluginOptions>> = async (fastify, opts): Promise<void> => {
  await fastify.register(
    fastifyAutoload,
    {
      dir: new URL('plugins', (import.meta.url)).pathname,
      options: opts,
    })

  await fastify.register(
    fastifyAutoload,
    {
      dir: new URL('routes', (import.meta.url)).pathname,
      options: {
        ...opts,
        prefix: '/api',
      },
    })
}

export default app
export { app }
