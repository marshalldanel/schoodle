
exports.up = function(knex, Promise) {
  return knex.schema.createTable('events', function (table) {
    table.increments('id');
    table.string('title');
    table.string('description');
    table.integer('admin_id').unsigned();
    table.foreign('admin_id').references('admins.id');
    table.string('event_date', 10);
    table.string('location');
    table.string('event_code', 8);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('admins');
};
