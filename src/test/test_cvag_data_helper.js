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
		var stop = {
			"destination": "Heimgarten",
			"serviceType": "BUS",
			"hasActualDeparture": true,
			"actualDeparture": moment(currentTestTime).add(5, 'minutes').add(5, 'seconds'),
			"line": "72",
			"platform": null
		};
		context('with an actual departure in 5 minutes', function() {
			it('tells how many minutes left ', function() {
				expect(subject.formatDeparture(stop)).to.eq('In 5 Minuten fährt der nächste Bus der Linie 72 in Richtung Heimgarten');
			});
		});
		context('with an actual departure in 61 seconds', function() {
			it('tells how many minutes left', function() {
				stop.actualDeparture = moment(currentTestTime).add(100, 'seconds');
				expect(subject.formatDeparture(stop)).to.eq('In 1 Minuten fährt der nächste Bus der Linie 72 in Richtung Heimgarten');
			});
		});
		context('with an actual departure in 59 seconds', function() {
			it('tells that the departure is now', function() {
				stop.actualDeparture = moment(currentTestTime).add(59, 'seconds');
				expect(subject.formatDeparture(stop)).to.eq('Jetzt fährt der nächste Bus der Linie 72 in Richtung Heimgarten');
			});
		});
		context('with an actual departure now', function() {
			it('tells that the departure is now ', function() {
				stop.actualDeparture = currentTestTime;
				expect(subject.formatDeparture(stop)).to.eq('Jetzt fährt der nächste Bus der Linie 72 in Richtung Heimgarten');
			});
		});
		context('with an actual departure 30 seconds ago', function() {
			it('tells that the departure is now ', function() {
				stop.actualDeparture = moment(currentTestTime).subtract(30, 'seconds');
				expect(subject.formatDeparture(stop)).to.eq('Jetzt fährt der nächste Bus der Linie 72 in Richtung Heimgarten');
			});
		});
		context('with an actual departure 5 minutes ago', function() {
			it('tells that the departure is now ', function() {
				stop.actualDeparture = moment(currentTestTime).subtract(5, 'minutes');
				expect(subject.formatDeparture(stop)).to.eq('Jetzt fährt der nächste Bus der Linie 72 in Richtung Heimgarten');
			});
		});
		context('with an actual single digit departure', function() {
			it('formats the first departure as expected', function() {
				var nextHour05 = moment(currentTestTime).add(1, 'hours').add(5, 'minutes').toDate();
				stop.actualDeparture = nextHour05;
				expect(subject.formatDeparture(stop)).to.eq('10:05 Uhr fährt der nächste Bus der Linie 72 in Richtung Heimgarten');
			});
		});
		context('with an actual departure on the next day', function() {
			it('formats the first departure as expected', function() {
				var tomorrow0905 = moment(currentTestTime).add(1, 'days').add(5, 'minutes').toDate();
				stop.actualDeparture = tomorrow0905;
				expect(subject.formatDeparture(stop)).to.eq('9:05 Uhr fährt der nächste Bus der Linie 72 in Richtung Heimgarten');
			});
		});
		context('with a planned departure', function() {
			it('formats the first departure as expected', function() {
				stop.hasActualDeparture = false;
				stop.plannedDeparture = stop.actualDeparture;
				stop.actualDeparture = null;
				expect(subject.formatDeparture(stop)).to.eq('9:05 Uhr fährt der nächste Bus der Linie 72 in Richtung Heimgarten');
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
	});
});