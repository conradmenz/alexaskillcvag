'use strict';

const Alexa = require('alexa-sdk');
const SkillHandler = require('./skillHandler');
const APP_ID = undefined;//'amzn1.ask.skill.4fffdda6-ed4c-46be-b6a5-112ff7d10b8d';

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetNextDeparture');
    },
    'GetNextDeparture': function () {
        try {
            var skill = new SkillHandler(this);
            if (skill.IsStationDefined())
            {
                var self = this;
                skill.GetNextDeparture().then(
                    function(message) {
                        self.emit(':tell', message);
                    }
                );
            } else {
                this.emit(':tell', 'Setze zuerst deine Haltestelle indem du sagst: Alexa, starte Haltestelle und setze meine Haltestelle auf Hauptbahnhof.');
            };

        } catch (error) {
            console.log('Exception occurred in index.GetNextDeparture. Message: ' + error.message);
            this.emit(':tell', 'Das Abrufen des Fahrplans hat leider nicht geklappt.');
        };
    },
    'SetDirection': function () {
        try {
            var direction = this.event.request.intent.slots.direction;
            if(direction.confirmationStatus == 'NONE') {
                this.emit(':tell', 'Die Richtung kann zum Beispiel auf Stadtwärts oder Landwärts gesetzt werden.');
            } else {
                var resolutions = direction.resolutions;
                var directionName = resolutions.resolutionsPerAuthority[0].values[0].value.name;
                var directionID = resolutions.resolutionsPerAuthority[0].values[0].value.id;
                this.attributes['directionID'] = directionID;
                this.emit(':tell', 'Richtung auf ' + directionName + ' gesetzt');
            };
        } catch (error) {
            this.emit(':tell', 'Beim Ändern der Richtung ist ein Fehler aufgetreten. Eventuell habe ich dich nicht richtig verstanden.');
        }
    },
    'ToggleDirection': function () {
        var skill = new SkillHandler(this);
        var message = skill.ToggleDirection();
        this.emit(':tell', message);
    },
    'SetStation': function () {
        try {
            var skill = new SkillHandler(this);
            var result = skill.SetStation();
            this.emit(':tell', result.returnMessage);
        } catch (error) {
            console.log('SetStation: Exception occurred. ' + error.message);
            this.emit(':tell', 'Beim Einstellen der Haltestelle ist ein Fehler aufgetreten. Eventuell habe ich dich nicht richtig verstanden.');
        }
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':tell', 'Du kannst sagen: Alexa, frage die Haltestelle wann der nächste Bus kommt.');
    },
    'Unhandled': function () {
        this.emit(':tell', 'Ich habe dich leider nicht richtig verstanden. Du kannst sagen: Alexa, frage Haltestelle wann der nächste Bus kommt.');
    }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.dynamoDBTableName = 'alexaSkillWeststrasseChemnitz'
    alexa.registerHandlers(handlers);
    alexa.execute();
};
