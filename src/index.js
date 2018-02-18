'use strict';

const Alexa = require('alexa-sdk');
const SkillHandler = require('./skillHandler');
const APP_ID = undefined;//'amzn1.ask.skill.4fffdda6-ed4c-46be-b6a5-112ff7d10b8d';

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetNextDeparture');
    },
    'GetNextDeparture': function () {
        var self = this;
        var skill = new SkillHandler(this);
        skill.GetNextDeparture().then(
            function(message) {
                self.emit(':tell', message);
            });
    },
    'SetDirection': function () {
        var resolutions = this.event.request.intent.slots.direction.resolutions;
        var directionName = resolutions.resolutionsPerAuthority[0].values[0].value.name;
        var directionID = resolutions.resolutionsPerAuthority[0].values[0].value.id;
        this.attributes['directionID'] = directionID;
        this.emit(':tell', 'Richtung auf ' + directionName + ' gesetzt');
    },
    'ToggleDirection': function () {
        var skill = new SkillHandler(this);
        var message = skill.ToggleDirection();
        this.emit(':tell', message);
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
