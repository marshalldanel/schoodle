
exports.up = function(knex, Promise) {
  return knex.schema.createTable('times', function (table) {
    table.integer('event_id').unsigned()
    table.foreign('event_id').references('events.id')
    table.string('time1', 10)
    table.string('time2', 10)
    table.string('time3', 10)
    table.string('time4', 10)
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('times');
};
