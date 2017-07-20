
exports.seed = function(knex, Promise) {
   return knex('admins').del()
    .then(function () {
      return Promise.all([
        knex('admins').insert({ name: 'Cameron', email: 'camemail@gmail.com', admin_code: 'oP97g5Qa'}),
        knex('admins').insert({ name: 'George', email: 'example@gmail.com', admin_code:'ikas7g3u'}),
        knex('admins').insert({ name: 'Mike', email: 'mike_rowe@gmail.com', admin_code:'Lop3j9c1'})
      ]);
    })
    // .then(function () {
    //   // Inserts seed entries
    //   return knex('events').insert([
    //     { title: 'Cam party', description: 'cool party, bro!', event_date: '2017-07-19', location: 'Funkytown', event_code: 'uasn2h67'},
    //     { title: 'George party', description: 'this will be fun!', event_date: '2017-07-21', location: 'Flavortown', event_code: '8hfi3dT2'},
    //     { title: 'Mike party', description: 'Come party with Mike!', event_date: '2017-07-29', location: 'Your mom\'s house', event_code: 'I80Lksc4'}
    //   ]);
    // });
};
