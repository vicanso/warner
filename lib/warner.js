'use strict';
const internal = require('./internal');
const _ = require('lodash');
const DateValidator = require('./date-validator');
const EventEmitter = require('events');
const debug = require('debug')('warner');

class Warner extends EventEmitter {
  constructor(conditions) {
    /* istanbul ignore if */
    if (!conditions) {
      throw new Error('conditions can not be null');
    }
    super();
    const internalData = internal(this);
    internalData.sum = 0;
    internalData.interval = 60;
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
    debug('conditions:%j', internalData.conditions);
  }
  add(v) {
    internal(this).sum += (v || 1);
    return this;
  }
  get sum() {
    return internal(this).sum;
  }
  get interval() {
    return internal(this).interval;
  }
  set interval(v) {
    const internalData = internal(this);
    internalData.interval = v;
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
    internal(this).timer = setInterval(
      this._check.bind(this),
      internal(this).interval * 1000
    ).unref();
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
    const min = _.get(result, 'min');
    debug('sum:%d', internalData.sum);
    /* istanbul ignore else */
    if (max && internalData.sum >= max) {
      this.emit('warn', {
        type: 'upper',
        v: internalData.sum,
      });
    }
    /* istanbul ignore else */
    if (min && internalData.sum <= min) {
      this.emit('warn', {
        type: 'lower',
        v: internalData.sum,
      });
    }
  }
}


module.exports = Warner;
