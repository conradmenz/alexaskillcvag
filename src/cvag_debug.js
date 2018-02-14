'use strict';
const CVAGDataHelper = require('./cvag_data_helper');
var moment = require('moment');

var currentTestTime = new Date(2018, 1, 1, 9, 0);
var cvag = new CVAGDataHelper();
var stop = {
    "destination": "Heimgarten",
    "serviceType": "BUS",
    "hasActualDeparture": true,
    "actualDeparture": moment(currentTestTime).add(61, 'seconds'),
    "line": "72",
    "platform": null
};
cvag.getCurrentTime = function() { return currentTestTime; };
var message = cvag.formatDeparture(stop);
console.log('Message: ' + message);