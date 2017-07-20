
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('polls').del()
    .then(function () {
      // Inserts seed entries
      return knex('polls').insert([
        {event_id: 1, name: 'Paul', time1: 'TRUE', time2: 'FALSE', time3: 'FALSE', time4: 'FALSE'},
        {event_id: 1, name: 'Ringo', time1: 'TRUE', time2: 'TRUE', time3: 'FALSE', time4: 'TRUE'},
        {event_id: 1, name: 'George', time1: 'FALSE', time2: 'FALSE', time3: 'TRUE', time4: 'FALSE'},
        {event_id: 2, name: 'Cam', time1: 'FALSE', time2: 'FALSE', time3: 'TRUE', time4: 'FALSE'},
        {event_id: 3, name: 'Cam', time1: 'TRUE', time2: 'TRUE', time3: 'TRUE', time4: 'FALSE'}
      ]);
    });
};
