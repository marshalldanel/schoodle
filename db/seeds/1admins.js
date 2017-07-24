exports.seed = function(knex, Promise) {
   return knex('admins').del()
    .then(function () {
      return Promise.all([
        knex('admins').insert({ name: 'Cameron', email: 'camemail@gmail.com', admin_code: 'oP97g5Qa'}),
        knex('admins').insert({ name: 'George', email: 'example@gmail.com', admin_code:'ikas7g3u'}),
        knex('admins').insert({ name: 'Mike', email: 'mike_rowe@gmail.com', admin_code:'Lop3j9c1'})
      ]);
    });
};
