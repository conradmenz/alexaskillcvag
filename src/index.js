'use strict';

const Alexa = require('alexa-sdk');
const CVAGDataHelper = require('./cvag_data_helper');
const APP_ID = undefined;//'amzn1.ask.skill.4fffdda6-ed4c-46be-b6a5-112ff7d10b8d';

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetNextDeparture');
    },
    'GetNextDeparture': function () {
        var cvag = new CVAGDataHelper();
        var self = this;
        var station_id = 'CAG-208';
        var directionID = this.attributes['directionID'];

        if(directionID == '1') {
            var destinationNames = ['Heimgarten', 'Gablenz', 'Zentralhaltestelle'];
        } else {
            var destinationNames = ['Flemmingstr.', 'Rottluff', 'Talanger'];
        };

        cvag.requestNextDepartures(station_id).then(function (stops) {
            var message = '';
            for (let index = 0; index < stops.length; index++) {
                const stop = stops[index];
                if(destinationNames.indexOf(stop.destination) >= 0) {
                    message = cvag.formatDeparture(stop);
                    break;
                };
            };
            if(message == '') { // no match found
                message = cvag.formatFirstDeparture(stops);
            };
            self.emit(':tell', message);
        });
    },
    'SetDirection': function () {
        var directionName = this.event.request.intent.slots.direction.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        var directionID = this.event.request.intent.slots.direction.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        this.attributes['directionID'] = directionID;
        this.emit(':tell', 'Richtung auf ' + directionName + ' gesetzt');
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':tell', 'Du kannst sagen: Alexa, frage die Haltestelle wann der nächste Bus kommt.');
    }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.dynamoDBTableName = 'alexaSkillWeststrasseChemnitz'
    alexa.registerHandlers(handlers);
    alexa.execute();
};
