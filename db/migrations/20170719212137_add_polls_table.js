
exports.up = function(knex, Promise) {
  return knex.schema.createTable('polls', function (table) {
    table.increments('id');
    table.integer('event_id').unsigned();
    table.foreign('event_id').references('events.id');
    table.string('name');
    table.boolean('time1');
    table.boolean('time2');
    table.boolean('time3');
    table.boolean('time4');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('polls');
};
