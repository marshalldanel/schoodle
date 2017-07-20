
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('times').del()
    .then(function () {
      // Inserts seed entries
      return knex('times').insert([
        {event_id: 1, time1: '11:20', time2: '12:20', time3: '13:50', time4: '15:30'},
        {event_id: 2, time1: '09:20', time2: '12:45', time3: '14:50', time4: '16:30'},
        {event_id: 3, time1: '10:20', time2: '12:00', time3: '12:50', time4: '18:30'}
      ]);
    });
};
