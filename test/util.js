'use strict';
const assert = require('assert');
const util = require('../lib/util');

describe('util', () => {
  it('get date string success', () => {
    assert.equal(util.getDate(), util.getDate(new Date()));
  });

  it('get time string success', () => {
    assert.equal(util.getTime(), util.getTime(new Date()));
  });

  it('get date(20160101) string success', () => {
    const date = new Date('2016-01-01T13:20:50.051Z');
    assert.equal(util.getDate(date), '20160101');
  });

  it('get time(00:00) string success', () => {
    const date = new Date('2016-01-01T16:00:00.000Z');
    assert.equal(util.getTime(date), '00:00');
  })
});
