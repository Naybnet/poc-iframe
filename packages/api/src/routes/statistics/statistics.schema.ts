import type { FromSchema, JSONSchema } from 'json-schema-to-ts'

const errorObject = {
  type: 'object',
  properties: {
    error: { type: 'string' },
  },
  additionalProperties: false,
} as const satisfies JSONSchema

const statisticsObject = {
  type: 'object',
  properties: {
    ninter: { type: 'number' },
    ninterWithCompl: { type: 'number' },
    ninterUnplanned: { type: 'number' },
    autonomy: { type: 'number' },
    confidence: { type: 'number' },
  },
  additionalProperties: false,
  required: ['ninter', 'ninterWithCompl', 'ninterUnplanned', 'autonomy', 'confidence'],
} as const satisfies JSONSchema

const semestersStatisticsObject = {
  type: 'object',
  properties: {
    'sem-1': statisticsObject,
    'sem-2': statisticsObject,
    'sem-3': statisticsObject,
    'sem-4': statisticsObject,
  },
  additionalProperties: false,
} as const satisfies JSONSchema

/**
 * get('/')
 */
const countryResponse = {
  '200': semestersStatisticsObject,
  '4xx': errorObject,
}

const getCountryStatisticsSchema = {
  response: countryResponse,
}

/**
 * get('/:uid')
 */
const userParams = {
  type: 'object',
  required: ['uid'],
  properties: {
    uid: { type: 'string' },
  },
} as const satisfies JSONSchema

const userResponse = {
  '200': semestersStatisticsObject,
  '4xx': errorObject,
}

const getUserStatisticsSchema = {
  params: userParams,
  response: userResponse,
} as const

export {
  getCountryStatisticsSchema,
  getUserStatisticsSchema,
}
export interface GetUserStatisticsParams extends FromSchema<typeof userParams> { }
