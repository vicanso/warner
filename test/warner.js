'use strict';
const assert = require('assert');
const Warner = require('..');
const util = require('../lib/util');

describe('Warner', () => {
  it('new Warner success', done => {
    const warner = new Warner([{
      day: '1-5',
      max: 10,
    }]);
    assert(!warner.timer);
    assert.equal(warner.interval, 60);
    assert.equal(warner.sum, 0);
    done();
  });

  it('start success', done => {
    const warner = new Warner([{
      max: 10,
    }]);
    warner.interval = 1;
    warner.start();
    warner.on('warn', data => {
      assert.equal(data.v, 10);
      assert.equal(data.type, 'upper');
      warner.stop();
      done();
    });
    setTimeout(() => {
      warner.add(10);
    }, 10);
  });

  it('set interval success', done => {
    const warner = new Warner([{
      day: '1-5',
      max: 10,
    }]);
    const interval = 120;
    warner.interval = interval;
    assert.equal(warner.interval, interval);
    assert(!warner.timer);
    done();
  });

  it('after start change interval success', done => {
    const warner = new Warner([{
      day: '1-5',
      max: 10,
    }]);
    warner.start();
    const interval = 120;
    warner.interval = interval;
    assert.equal(warner.interval, interval);
    assert(warner.timer);
    done();
  });

  it('set conditions with day', done => {
    const warner = new Warner([{
      day: (new Date()).getDay(),
      max: 10,
    }]);
    warner.interval = 1;
    warner.start();
    warner.on('warn', data => {
      assert.equal(data.v, 10);
      warner.stop();
      done();
    });
    setTimeout(() => {
      warner.add(10);
    }, 10);
  });

  it('set conditions with day region', done => {
    const warner = new Warner([{
      day: '0-7',
      max: 10,
    }]);
    warner.interval = 1;
    warner.start();
    warner.on('warn', data => {
      assert.equal(data.v, 10);
      warner.stop();
      done();
    });
    setTimeout(() => {
      warner.add(10);
    }, 10);
  });

  it('set conditions with date success', done => {
    const warner = new Warner([{
      date: util.getDate(new Date()),
      time: '00:00-24:00',
      max: 10,
    }]);
    warner.interval = 1;
    warner.start();
    warner.on('warn', data => {
      assert.equal(data.v, 10);
      warner.stop();
      done();
    });
    setTimeout(() => {
      warner.add(10);
    }, 10);
  });

  it('set conditions with date region success', done => {
    const warner = new Warner([{
      date: '20160329-20161231',
      time: '00:00-24:00',
      max: 10,
    }]);
    warner.interval = 1;
    warner.start();
    warner.on('warn', data => {
      assert.equal(data.v, 10);
      warner.stop();
      done();
    });
    setTimeout(() => {
      warner.add(10);
    }, 10);
  });

  it('set min conditions success', done => {
    const warner = new Warner([{
      date: '20160329-20161231',
      time: '00:00-24:00',
      min: 10,
    }]);
    warner.interval = 1;
    warner.start();
    warner.on('warn', data => {
      assert.equal(data.v, 0);
      assert.equal(data.type, 'lower');
      warner.stop();
      done();
    });
  });
});
