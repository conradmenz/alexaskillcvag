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

SkillHandler.prototype.IsStationDefined = function() {
    return !(typeof this.GetAttribute(STATION_ID_ATTRIBUTE) === 'undefined');
}

SkillHandler.prototype.SetStation = function() {
    var intentObj = this.Alexa.event.request.intent;
    
    var stationSlotDefined;
    if (typeof intentObj === 'undefined' ||
        typeof intentObj.slots === 'undefined' ||
        typeof intentObj.slots.station === 'undefined' ||
        typeof intentObj.slots.station.value === 'undefined') {
        stationSlotDefined = false;
    } else {
        stationSlotDefined = true;
    };

    // Overwrite station or use station from user setting?
    var stationAttributeDefined;
    if (!(typeof intentObj === 'undefined') && intentObj.name == 'SetStation') {
        stationAttributeDefined = false;
    } else {
        stationAttributeDefined = !(typeof this.GetAttribute(STATION_ID_ATTRIBUTE) === 'undefined');
    }

    // Do we have all required information?
    if (!stationSlotDefined && !stationAttributeDefined) {
        console.log('SetStation:beforeDelegate');
        this.Alexa.emit(':delegate');
        console.log('SetStation:afterDelegate');
    };

    var messageBegin = '';
    if (stationSlotDefined) {
        var station = intentObj.slots.station;
        var resolution = station.resolutions.resolutionsPerAuthority[0];
        if (resolution.status.code == 'ER_SUCCESS_NO_MATCH') {
            console.log('SetStation: resolution status code: ' + resolution.status.code);
            this.Alexa.emit(':tell', 'Ich konnte leider keine passende Haltestelle finden.');
            console.log('SetStation:afterTellNotFound');
        } else {
            if (resolution.status.code == 'ER_SUCCESS_MATCH') {
                var stationName = resolution.values[0].value.name;
                var stationID = resolution.values[0].value.id;
                this.SetAttribute(STATION_ID_ATTRIBUTE, stationID);
                var messageBegin = 'Haltestelle auf ' + stationName + ' gesetzt.';
                stationAttributeDefined = true;
                console.log('SetStation: station set to ' + stationID + '(' + stationName + ')');
            } else {
                console.log('SetStation: resolution status code: ' + resolution.status.code);
                this.Alexa.emit(':tell', 'Das Setzen der Haltestelle hat nicht geklappt.');
                console.log('SetStation:afterTellError');
            };
        };
    };
    return {
        stationSet: stationAttributeDefined,
        returnMessage: messageBegin + ' '
    };
};

module.exports = SkillHandler;