
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('events').del()
    .then(function () {
      // Inserts seed entries
      return knex('events').insert([
        { title: 'Cam party', description: 'cool party, bro!', admin_id: 1, event_date: '2017-07-19', location: 'Funkytown', event_code: 'uasn2h67'},
        { title: 'George party', description: 'this will be fun!', admin_id: 2, event_date: '2017-07-21', location: 'Flavortown', event_code: '8hfi3dT2'},
        { title: 'Mike party', description: 'Come party with Mike!', admin_id: 3, event_date: '2017-07-29', location: 'Your mom\'s house', event_code: 'I80Lksc4'}
      ]);
    });
};
