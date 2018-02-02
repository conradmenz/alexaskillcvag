'use strict';
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var CVAGDataHelper = require('../cvag_data_helper');
chai.config.includeStack = true;
var _ = require('lodash');
var moment = require('moment');

describe('CVAGDataHelper', function() {
	var subject = new CVAGDataHelper();
	const currentTestTime = new Date(2018, 1, 1, 9, 0);
	subject.getCurrentTime = function() { return currentTestTime; };
	var station_id;
	describe('#getNextDepartures', function() {
		context('with a valid station id', function() {
			it('returns array of next departures', function() {
				station_id = 'CAG-208';
				var value = subject.requestNextDepartures(station_id).then(function (value) {
					return value;
				});
				return expect(value).to.eventually.be.a('array');
	        });
		});
		context('with an invalid station id', function() {
			it('returns no array of next departures', function() {
				station_id = '4711';
				return expect(subject.requestNextDepartures(station_id)).to.be.rejectedWith(Error);
			});
		});
	});
	describe('#formatDeparture', function() {
		var nowPlus5Minutes = moment(currentTestTime).add(5, 'minutes').add(5, 'seconds');
		var nowMinus10Seconds = moment(currentTestTime).subtract(30, 'seconds');

		var stop = {
			"destination": "Heimgarten",
			"serviceType": "BUS",
			"hasActualDeparture": true,
			"actualDeparture": nowPlus5Minutes,
			"line": "72",
			"platform": null
		};
		context('with an actual departure in 5 minutes', function() {
			it('tells how many minutes left ', function() {
				expect(subject.formatDeparture(stop)).to.eq('In 5 Minuten fährt der nächste Bus der Linie 72 in Richtung Heimgarten');
			});
		});
		context('with an actual departure 30 seconds ago', function() {
			it('tells that the departure is now ', function() {
				stop.actualDeparture = nowMinus10Seconds;
				expect(subject.formatDeparture(stop)).to.eq('Jetzt fährt der nächste Bus der Linie 72 in Richtung Heimgarten');
			});
		});
	});
	describe('#formatFirstDeparture', function() {
		var stops = [{
			"destination": "Heimgarten",
			"serviceType": "BUS",
			"hasActualDeparture": true,
			"actualDeparture": moment(currentTestTime).hour(11).minute(31).toDate(),
			"line": "72",
			"platform": null
		},
		{
			"destination": "Rottluff",
			"serviceType": "BUS",
			"hasActualDeparture": true,
			"actualDeparture": moment(currentTestTime).add(3, 'hours').toDate(),
			"line": "72",
			"platform": null
		}];
		context('with an array containing an actual departure', function() {
			it('formats the first departure as expected', function() {
				expect(subject.formatFirstDeparture(stops)).to.eq('11:31 Uhr fährt der nächste Bus der Linie 72 in Richtung Heimgarten');
			});
		});
		context('with an array containing an actual single digit departure', function() {
			it('formats the first departure as expected', function() {
				var nextHour05 = moment(currentTestTime).add(1, 'hours').add(5, 'minutes').toDate();
				stops[0].actualDeparture = nextHour05;
				expect(subject.formatFirstDeparture(stops)).to.eq('10:05 Uhr fährt der nächste Bus der Linie 72 in Richtung Heimgarten');
			});
		});
		context('with an array containing an actual departure on the next day', function() {
			it('formats the first departure as expected', function() {
				var tomorrow0905 = moment(currentTestTime).add(1, 'days').add(5, 'minutes').toDate();
				stops[0].actualDeparture = tomorrow0905;
				expect(subject.formatFirstDeparture(stops)).to.eq('9:05 Uhr fährt der nächste Bus der Linie 72 in Richtung Heimgarten');
			});
		});
		context('with an array containing a planned departure', function() {
			it('formats the first departure as expected', function() {
				stops[0].hasActualDeparture = false;
				stops[0].plannedDeparture = stops[0].actualDeparture;
				stops[0].actualDeparture = null;
				expect(subject.formatFirstDeparture(stops)).to.eq('9:05 Uhr fährt der nächste Bus der Linie 72 in Richtung Heimgarten');
			});
		});
	});
});