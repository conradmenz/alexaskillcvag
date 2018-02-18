'use strict'
const CVAGDataHelper = require('./cvag_data_helper');
const DIRECTION_ID_ATTRIBUTE = 'directionID';
var Alexa;

function SkillHandler(alexa) {
    this.Alexa = alexa;
};

SkillHandler.prototype.GetAttribute = function(key) {
    return this.Alexa.attributes[key];
};

SkillHandler.prototype.SetAttribute = function(key, value) {
    this.Alexa.attributes[key] = value;
};

SkillHandler.prototype.GetNextDeparture = function() {
    var cvag = new CVAGDataHelper();
    var stationID = 'CAG-208';
    var directionID = this.GetAttribute(DIRECTION_ID_ATTRIBUTE);
	return cvag.requestNextDepartures(stationID).then(
		function(stops) {
			return cvag.formatDeparture(cvag.findFirstDepartureByDirection(stops, directionID));
		}
	);
};

SkillHandler.prototype.SetDirection = function() {
	
};

SkillHandler.prototype.ToggleDirection = function() {
    var directionID;
	if (this.GetAttribute(DIRECTION_ID_ATTRIBUTE) == 1) {
        directionID = 0;
    } else {
        directionID = 1;
    };
    this.SetAttribute(DIRECTION_ID_ATTRIBUTE, directionID);
    var cvag = new CVAGDataHelper();
    return 'Richtung auf ' + cvag.getDirectionNameByDirectionID(directionID) + ' geändert';
};

module.exports = SkillHandler;