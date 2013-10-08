node-hipchat
============

Nodejs push log to hipchat room


# how to use
- setup your api token and room number

```javascript
// open config file (config.js)
module.exports = {
    token: 'YOUR_TOKEN',
    roomId: 'YOUR_ROOM_ID'
}

```

- use it

```javascript
var hipchat = require('./node-hipchat/index');

// log warn
hipchat.logger('Hello hipchat logger - warn', 'warn');

// log error
hipchat.logger('Hello hipchat logger - error', 'error');

```
