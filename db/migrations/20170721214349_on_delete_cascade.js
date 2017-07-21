
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('events', function (table) {
    table.timestamp('deleted_at').defaultTo(null);
    table.unique('admin_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('events', function (table) {
    table.dropColumn('deleted_at');
    table.dropUnique('admin_id');
  });
};