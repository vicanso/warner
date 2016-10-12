# warner

A warner for watch anything you want. If meet the required criterion, it will trigger an event


## Installation

```js
$ npm install warner
```

## API

```js
const Warner = require('warner');
const loginFailWarner = new Warner([
  {
    time: '00:00-01:00',
    max: 10,
  },
  {
    time: '01:00-03:00',
    max: 20,
  },
  {
    time: '03:00-07:00',
    max: 30,
  },
  {
    time: '07:00-21:00',
    max: 60,
  },
  {
    time: '21:00-24:00',
    max: 40,
  },
], 60 * 1000);
// every 30s to check whether meet the required criterion
loginFailWarner.interval = 30 * 1000;
loginFailWarner.on('warn', (data) => {
  console.info(data.v);  
});
// simulate every 3s, there is an user login fail
setInterval(function() {
  loginFailWarner.add(1);
}, 3000);
```

## License

MIT
