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
	});
});