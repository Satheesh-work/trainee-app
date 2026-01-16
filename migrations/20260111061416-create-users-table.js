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
  return db.createTable('users', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      notNull: true
    },
    name: {
      type: 'string',
      length: 100,
      notNull: true
    },
    email: {
      type: 'string',
      length: 100,
      notNull: true,
      unique: true
    },
    age: {
      type: 'int',
      notNull: false
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    }
  });
};


exports.down = function(db) {
  return db.dropTable('users');
};

exports._meta = {
  "version": 1
};