'use strict'
const CVAGDataHelper = require('./cvag_data_helper');

function SkillHandler() {}

SkillHandler.prototype.GetAttribute = function(key) {
    return null;
    // var directionID = this.attributes['directionID'];
};

SkillHandler.prototype.SetAttribute = function(key, value) {
    return null;
    // this.attributes['directionID'] = directionID;
};

SkillHandler.prototype.GetNextDeparture = function() {
    var cvag = new CVAGDataHelper();
    var stationID = 'CAG-208';
    var directionID = this.GetAttribute('directionID');
	return cvag.requestNextDepartures(stationID).then(
		function(stops) {
			return cvag.formatDeparture(cvag.findFirstDepartureByDirection(stops, directionID));
		}
	);
};

SkillHandler.prototype.SetDirection = function() {
	
};

module.exports = SkillHandler;