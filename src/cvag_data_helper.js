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
	return _.template('${time} fährt der nächste Bus der Linie ${line} in Richtung ${destination}')({
		time: this.formatTime(this.getTimeFromStop(stop)),
		line: stop.line,
		destination: stop.destination
	});
};

CVAGDataHelper.prototype.getTimeFromStop = function(stop) {
	if (stop.hasActualDeparture) {
		return new Date(stop.actualDeparture);
	} else {
		return new Date(stop.plannedDeparture);
	};
};

CVAGDataHelper.prototype.formatTime = function(time) {
	const thresholdMinutes = 15;
	const thresholdNow = 1;
	var now = this.getCurrentTime();

	if(time < now) {
		return 'Jetzt';
	} else {
		var momentDeparture = moment(time);
		var momentNow = moment(now);
		var minutesDifference = momentDeparture.diff(momentNow, 'minutes');
		if(minutesDifference > thresholdMinutes) {
			return momentDeparture.tz('Europe/Berlin').format('H:mm') + ' Uhr';
		} else {
			if(minutesDifference >= thresholdNow) {
				return 'In ' + minutesDifference + ' Minuten';
			} else {
				return 'Jetzt';
			};
		};
	};
};

CVAGDataHelper.prototype.findFirstDepartureByDirection = function(stops, directionID) {
	var destinationNames = this.getDestinationNamesByDirectionID(directionID);
	for (let index = 0; index < stops.length; index++) {
		var stop = stops[index];
		if(destinationNames.indexOf(stop.destination) >= 0) {
			return stop;
		};
	};
	return stops[0];
};

CVAGDataHelper.prototype.getDestinationNamesByDirectionID = function(directionID) {
	if(directionID == '1') {
		return ['Heimgarten', 'Gablenz', 'Zentralhaltestelle'];
	} else {
		return ['Flemmingstr.', 'Rottluff', 'Talanger'];
	};
}

module.exports = CVAGDataHelper;