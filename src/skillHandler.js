'use strict'
const CVAGDataHelper = require('./cvag_data_helper');
const STATION_ID_ATTRIBUTE = 'stationID';
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
    var stationID = this.GetAttribute(STATION_ID_ATTRIBUTE);
    var directionID = this.GetAttribute(DIRECTION_ID_ATTRIBUTE);
    if(stationID == null) {
        throw new Error('stationID is null')
    };
    if(directionID == null) {
        directionID = 0;
    };
	return cvag.requestNextDepartures(stationID).then(
		function(stops) {
            if(stops.length > 0) {
                return cvag.formatDeparture(cvag.findFirstDepartureByDirection(stops, directionID));
            } else {
                return 'Keine Abfahrt innerhalb der nächsten Stunde.';
            }
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