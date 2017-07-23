
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('polls', function (table) {
    table.timestamp('deleted_at').defaultTo(null);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('polls', function (table) {
    table.dropColumn('deleted_at');
  });
};