'use strict';
const internal = require('./internal');
const _ = require('lodash');
const util = require('./util');

class DateValidator {
  constructor() {
    const internalData = internal(this);
    internalData.date = this._getDate();
  }
  _getDate() {
    const date = new Date();
    return {
      date: `${util.getDate(date)}`,
      day: date.getDay(),
      time: `${util.getTime(date)}`,
    };
  }
  isMeets(conditions) {
    const dateInfos = internal(this).date;
    let meets = true;
    _.forEach(['date', 'day', 'time'], key => {
      const currentValue = dateInfos[key];
      const condition = conditions[key];
      if (meets && condition) {
        if (_.isNumber(condition)) {
          meets = currentValue === condition;
          return;
        }
        // ,分隔表示 or
        const splitArr = condition.split(',');
        const reulstList = _.map(splitArr, tmp => {
          // - 表示时间段，由xx - yy
          let arr = tmp.split('-');
          if (key === 'day') {
            arr = _.map(arr, day => parseInt(day, 10));
          }
          if (arr.length === 1) {
            return currentValue === arr[0];
          }
          return currentValue >= arr[0] && currentValue < arr[1];
        });
        meets = _.some(reulstList);
      }
    });
    return meets;
  }
}

module.exports = DateValidator;
