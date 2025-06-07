/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("logs_table", function (table) {
    table.increments("id").primary().notNullable();
    table.integer("date_id").unsigned().notNullable();
    table.foreign("date_id").references("id").inTable("date_table").onDelete("CASCADE");

    table.string("session_duration", 255);
    table.string("description", 255);

    table.string("title", 255);
    table.json("tasks");

    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("logs_table");
}
