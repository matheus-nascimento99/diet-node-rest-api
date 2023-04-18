import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id', { primaryKey: false }).notNullable()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.timestamp('datetime').notNullable()
    table.boolean('inside_diet').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at')

    table.foreign('user_id').references('users.user_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
