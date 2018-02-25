'use strict';
const CVAGDataHelper = require('./cvag_data_helper');
var cvag = new CVAGDataHelper();

for (let index = 0; index < 10; index++) {
	cvag.getDepartureConfiguration('CAG-' + index).then(
		function(configuration) {
			var station = configuration.station;
			if(station != null) {
				console.log('Mandator: ' + station.mandator + ' Number: ' + station.number + ' Name: ' + station.displayName);
			// } else {
			// 	console.log('Not used');
			}
		}
	);
};