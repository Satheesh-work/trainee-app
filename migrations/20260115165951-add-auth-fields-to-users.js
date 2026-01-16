'use strict';

var dbm;
var type;
var seed;

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.addColumn('users', 'password', {
    type: 'string',
    length: 255,
    notNull: true
  })
  .then(() => {
    return db.addColumn('users', 'role', {
      type: 'string',
      length: 20,
      notNull: true,
      defaultValue: 'user'
    });
  });
};

exports.down = function(db) {
  return db.removeColumn('users', 'role')
    .then(() => {
      return db.removeColumn('users', 'password');
    });
};

exports._meta = {
  "version": 1
};