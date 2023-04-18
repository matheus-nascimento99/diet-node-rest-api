import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.dropColumn('session_id')
    table.uuid('user_id').references('users.user_id').notNullable()
  })

  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('session_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.uuid('session_id')
    table.dropColumn('user_id')
  })

  await knex.schema.alterTable('users', (table) => {
    table.uuid('session_id')
  })
}
