'use strict';
const internal = require('./internal');
const _ = require('lodash');

class DateValidator {
  constructor() {
    const internalData = internal(this);
    internalData.date = this._getDate();
  }
  _getDate() {
    const date = new Date();

    let month = date.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    let day = date.getDate();
    if (day < 10) {
      day = `0${day}`;
    }

    let hours = date.getHours();
    if (hours < 10) {
      hours = `0${hours}`;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    return {
      date: `${date.getFullYear()}${month}${day}`,
      day: date.getDay(),
      time: `${hours}:${minutes}`,
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
