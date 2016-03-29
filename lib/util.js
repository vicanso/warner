'use strict';

exports.getDate = function getDate(date) {
  const currentDate = date || new Date();
  let month = currentDate.getMonth() + 1;
  /* istanbul ignore else */
  if (month < 10) {
    month = `0${month}`;
  }
  /* istanbul ignore else */
  let day = currentDate.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  return `${currentDate.getFullYear()}${month}${day}`;
};


exports.getTime = function getTime(date) {
  const currentDate = date || new Date();
  let hours = currentDate.getHours();
  /* istanbul ignore else */
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = currentDate.getMinutes();
  /* istanbul ignore else */
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
};
