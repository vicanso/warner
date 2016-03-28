'use strict';
const internal = require('./internal');
const _ = require('lodash');
const DateValidator = require('./date-validator');
const EventEmitter = require('events');

class Warner extends EventEmitter {
  constructor(conditions) {
    super();
    const internalData = internal(this);
    internalData.sum = 0;
    internalData.internal = 60 * 1000;
    internalData.timer = null;
    internalData.conditions = _.sortBy(conditions, item => {
      let weight = 0;
      let unit = 1;
      _.forEach(['time', 'day', 'date'], key => {
        if (item[key]) {
          weight += unit;
        }
        unit = unit << 1;
      });
      return -weight;
    });
  }
  add(v) {
    internal(this).sum += (v || 1);
    return this;
  }
  set interval(v) {
    if (v < 60) {
      throw new Error('interval can not less than 60');
    }
    const internalData = internal(this);
    internalData.interval = v * 1000;
    if (internalData.timer) {
      this.start();
    }
    return this;
  }
  get timer() {
    return internal(this).timer;
  }
  start() {
    this.stop();
    internal(this).timer = setInterval(this._check.bind(this), internal(this).interval).unref();
    return this;
  }
  stop() {
    if (internal(this).timer) {
      clearInterval(internal(this).timer);
    }
    internal(this).timer = null;
    return this;
  }
  _check() {
    const internalData = internal(this);
    const conditions = internalData.conditions;
    const validator = new DateValidator();
    const result = _.find(conditions, item => validator.isMeets(item));
    const max = _.get(result, 'max');
    if (max && internalData.sum > max) {
      this.emit('warn', internalData.sum);
    }
  }
}


module.exports = Warner;
// const warner = new Warner([{
//   day: '1-5',
//   max: 10
// },{
//   time: '12:00-15:00,18:00-24:00',
//   max: 10
// },{
//   date: '20160328',
//   time: '00:00-12:00,15:00-18:00',
//   max: 300
// }]);
// warner.interval = 60;
// warner.start();
// warner.on('warn', sum => {
//   console.dir(sum);
// });

// setInterval(() => {
//   warner.add();
// }, 1000);
