'use strict';
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var CVAGDataHelper = require('../cvag_data_helper');
chai.config.includeStack = true;

describe('CVAGDataHelper', function() {
	var subject = new CVAGDataHelper();
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
	describe('#formatFirstDeparture', function() {
		var stops = [{
			"destination": "Heimgarten",
			"serviceType": "BUS",
			"hasActualDeparture": true,
			"actualDeparture": 1519723860000,
			"line": "72",
			"platform": null
		},
		{
			"destination": "Rottluff",
			"serviceType": "BUS",
			"hasActualDeparture": true,
			"actualDeparture": 1516692745000,
			"line": "72",
			"platform": null
		}];
		context('with an array containing an actual departure', function() {
			it('formats the first departure as expected', function() {
				expect(subject.formatFirstDeparture(stops)).to.eq('11:31 Uhr fährt der nächste Bus der Linie 72');
			});
		});
		context('with an array containing an actual single digit departure', function() {
			it('formats the first departure as expected', function() {
				stops[0].actualDeparture = 1519715100000;
				expect(subject.formatFirstDeparture(stops)).to.eq('9:05 Uhr fährt der nächste Bus der Linie 72');
			});
		});
		context('with an array containing a planned departure', function() {
			it('formats the first departure as expected', function() {
				stops[0].hasActualDeparture = false;
				stops[0].plannedDeparture = 1519723860000;
				stops[0].actualDeparture = null;
				expect(subject.formatFirstDeparture(stops)).to.eq('11:31 Uhr fährt der nächste Bus der Linie 72');
			});
		});
	});
});