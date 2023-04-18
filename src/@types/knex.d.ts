// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      user_id: string
      name: string
      age: number
      email: string
      password: string
      created_at: Date
      updated_at?: Date | string
    }
    meals: {
      id: string
      user_id: string
      name: string
      description: string
      datetime: Date | string
      inside_diet: boolean
      created_at: Date
      updated_at?: Date | string
    }
  }
}
