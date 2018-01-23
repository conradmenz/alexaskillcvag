'use strict'
var _ = require('lodash');
var rp = require('request-promise');
var UrlCvag = 'http://www.cvag.de'; //'http://www.cvag.de/eza/mis/stops/station/CAG-208'
var MethodStation = '/eza/mis/stops/station/';

function CVAGDataHelper() {}

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
	if (stops[0].hasActualDeparture) {
		var time = new Date(stops[0].actualDeparture);
	} else {
		var time = new Date(stops[0].plannedDeparture);
	}
	var line = stops[0].line;
	var result = time.getHours() + 1 + ':' + time.getMinutes() + ' Uhr fährt der nächste Bus der Linie ' + line;
	return result;
}

module.exports = CVAGDataHelper;