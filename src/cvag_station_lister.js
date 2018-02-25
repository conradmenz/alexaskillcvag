'use strict';
const CVAGDataHelper = require('./cvag_data_helper');
var cvag = new CVAGDataHelper();

for (let index = 0; index < 10; index++) {
	cvag.getDepartureConfiguration('CAG-' + index).then(
		function(configuration) {
			var station = configuration.station;
			if(station != null) {
				console.log('{"id": "' + station.mandator + '-' + station.number + '","name": { "value": "' + station.displayName + '","synonyms": []}},');
			}
		}
	);
};