/**
 * HipChat
 *
 * @module      :: Service
 * @description :: Push loger to hipchat
 */

var request = require('request'),
    config = require('../config');

module.exports = {

    roomId: config.roomId,

    token: config.token,

    // https://www.hipchat.com/docs/api/method/rooms/message
    apiMessageURL: 'https://api.hipchat.com/v1/rooms/message',

    // https://www.hipchat.com/docs/api/method/rooms/topic
    apiTopicURL: 'https://api.hipchat.com/v1/rooms/topic',

    normalParam: '?auth_token=',

    from: 'System Logger',

    /**
     * [logger description]
     * @param  {String} message log message
     * @param  {String} level   error, warn, debug, info, verbose
     * @return {Self}
     */
    logger: function(message, level) {
        var loggerLevel = ['error', 'warn'],
            color = 'yellow';
        message = message || '';
        level = level || 'debug';

        if(loggerLevel.indexOf(level.toLowerCase()) >= 0) {
            if(level.toLowerCase() === 'error'){
                color = 'red';
            }

            // log to hipchat
            this.postMessage(null, message, 'text', '0', color, 'json', this.from);
        }

        return this;
    },

    /**
     * [postMessage description]
     * @param  {String} room_id        Required. ID or name of the room
     * @param  {String} message        Required. The message body.
     *                                 10,000 characters max.
     * @param  {String} message_format message format 'html' or 'text'
     * @param  {String} notify         0 = false, 1 = true. default is 0
     * @param  {String} color          default is 'yellow'. "yellow", "red",
     *                                 "green", "purple", "gray", or "random".
     * @param  {String} format         json or xml. default is json
     * @param  {String} from           post form. default is API
     * @return {JSON}                  {status: "sent"}
     */
    postMessage: function(room_id, message, message_format, notify, color, format, from) {
        room_id = room_id || this.roomId;
        message = message || '';
        message_format = message_format || 'text';
        notify = notify || '0';
        color = color || 'yellow';
        format = format || 'json';
        from = from || this.from;

        return this.httpRequest(this.apiMessageURL, {
            room_id: room_id,
            message: message,
            message_format: message_format,
            notify: notify,
            color: color,
            format: format,
            from: from
        }, function(err, body) {
            if(err) {
                return console.log(err);
            }

            return body;
        });
    },

    /**
     * [postTopic description]
     * @param  {String} room_id Required. ID or name of the room
     * @param  {String} topic   Required. The topic body. 250 characters max.
     * @param  {String} from    Name of the service changing the topic. (default: API)
     * @param  {String} format  Desired response format: json or xml. (default: json)
     * @return {JSON}           {status: "ok"}
     */
    postTopic: function(room_id, topic, from, format) {
        room_id = room_id || this.roomId;
        topic = topic || '';
        format = format || 'json';
        from = from || this.from;
        return this.httpRequest(this.apiTopicURL, {
            room_id: room_id,
            topic: topic,
            format: format,
            from: from
        }, function(err, body) {
            if(err) {
                return console.log(err);
            }

            return body;
        });
    },

    /**
     * [httpRequest description]
     * @param  {String}   url      send url
     * @param  {Object}   body     form post object
     * @param  {Function} callback callback(error, responseBody)
     */
    httpRequest: function(url, body, callback) {
        return request({
            method: 'POST',
            url: url + this.normalParam + this.token,
            form: body
        }, function (error, response, body) {
            if(response.statusCode === 200){
                callback(null, body);
            } else {
                callback(error, null);
            }
        });
    }
};
