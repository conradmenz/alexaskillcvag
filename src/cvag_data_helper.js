'use strict'
var _ = require('lodash');
var rp = require('request-promise');
var UrlCvag = 'http://www.cvag.de'; //'http://www.cvag.de/eza/mis/stops/station/CAG-208'
var MethodStation = '/eza/mis/stops/station/';
var moment = require('moment-timezone');

function CVAGDataHelper() {}

CVAGDataHelper.prototype.getCurrentTime = function() {
	return _.now();
};

CVAGDataHelper.prototype.requestNextDepartures = function(stationID) {
	return this.getNextDepartures(stationID).then(
		function(response) {
			console.log('success - received ' + response.stops.length + ' departures for ' + stationID);
			return response.stops;
		}
	);
};

CVAGDataHelper.prototype.getNextDepartures = function(stationID) {

	var options = {
		method: 'GET',
		uri: UrlCvag + MethodStation + stationID,
		json: true,
		headers: {
			'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
		}
	};

	return rp(options);
};

CVAGDataHelper.prototype.formatFirstDeparture = function(stops) {
	return this.formatDeparture(stops[0]);
};

CVAGDataHelper.prototype.formatDeparture = function(stop) {
	var now = this.getCurrentTime();
	
	var formatTime = function(time) {
		if(time < now) {
			return 'Jetzt';
		} else {
			var momentDeparture = moment(time);
			var momentNow = moment(now);
			var minutesDifference = momentDeparture.diff(momentNow, 'minutes');
			if(minutesDifference > 15) {
				return momentDeparture.format('H:mm') + ' Uhr';
			} else {
				if(minutesDifference >= 1) {
					return 'In ' + minutesDifference + ' Minuten';
				} else {
					return 'Jetzt';
				};
			};
		};
	};

	if (stop.hasActualDeparture) {
		var time = new Date(stop.actualDeparture);
	} else {
		var time = new Date(stop.plannedDeparture);
	};

	var result = _.template('${time} fährt der nächste Bus der Linie ${line} in Richtung ${destination}')({
		time: formatTime(time),
		line: stop.line,
		destination: stop.destination
	});
	return result;
};

module.exports = CVAGDataHelper;