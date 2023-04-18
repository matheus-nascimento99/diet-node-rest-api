import { RequestGenericInterface } from 'fastify'

export interface requestGeneric extends RequestGenericInterface {
  Params: {
    id: string
  }
}
