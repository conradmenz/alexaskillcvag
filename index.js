/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetNextDeparture');
    },
    'GetNextDeparture': function () {
        
        var http = require('http');
        
        //'http://www.cvag.de/eza/mis/stops/station/CAG-208'
        var options = 
        {
            host: 'www.cvag.de',
            path: '/eza/mis/stops/station/CAG-208',
            headers: {
                'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'}
        };

        var self = this;
        
        http.get(options, (response) => {
            var body = '';
            response.setEncoding('utf8');
            response.on('data', (data) => {
                body += data;
            });
            response.on('end', () => {
                console.log(body);
                var response = JSON.parse(body);        
                var time = new Date(response.stops[0].actualDeparture);
                var line = response.stops[0].line;
                var answer = time.getHours() + 1 + ':' + time.getMinutes() + ' Uhr fährt der nächste Bus der Linie ' + line;
                self.emit(':tell', answer);
                console.log('end');
            })}).on('error', function(e) {
                console.log(e.message);
            });
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':tell', 'Ich kann dir leider nicht helfen.');
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Tschüssi');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Tschüssi');
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
