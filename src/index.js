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
        cvag.requestNextDepartures(station_id).then(function (stops) {
            self.emit(':tell', cvag.formatFirstDeparture(stops));
        });
    },
    // 'SetDirection': function () {
    //     var direction = this.event.request.intent.slots.direction.value;
    //     this.emit(':tell', 'Richtung auf ' + direction + ' gesetzt');
    // },
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
