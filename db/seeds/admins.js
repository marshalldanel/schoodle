
exports.seed = function(knex, Promise) {
  return knex('admins').del()
    .then(function () {
      return Promise.all([
        knex('admins').insert({id: 1, name: 'Cameron', email: 'camemail@gmail.com', admin_code: ''}),
        knex('admins').insert({id: 2, name: 'George', email: 'example@gmail.com', admin_code:'ikas7g3u'}),
        knex('admins').insert({id: 3, name: 'Mike', email: 'mike_rowe@gmail.com', admin_code:'Lop3j9c1'})
      ]);
    });
};
