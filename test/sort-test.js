var should = require('should');
var async = require('async');
var express = require('express');
var request = require('supertest');
require('./lib/mongoose-connection');

var app = express();

describe('Sort: index', function() {
    var CrudGenerator = require('../index');
    var model = require('./fixtures/model');
    var fixtureData = [];

    var crud = new CrudGenerator(model);

    before(function(done) {
        model.remove(function() {
            async.timesSeries(50, createRandomDocument, done)
        });
    });

    it('should sort by "field" ascending.', function(done) {
        var handler = crud.index();
        app.get('/', handler, function(err, req, res, next) {
            done();

        });

        request(app)
            .get('/?sort=number')
            .expect(200, function(err, res) {
                should.not.exist(err);

                var sorted = res.body.map(function(data){
                    return data.number;
                });

                sorted.forEach(function(number, index){
                    if (index > 1) {
                        (sorted[index-1] <= number).should.be.true;
                    }
                })
                done();
            });
    });

    it('should sort by "field" descending.', function(done) {
        var handler = crud.index();
        app.get('/', handler, function(err, req, res, next) {
            done();

        });

        request(app)
            .get('/?sort=-number')
            .expect(200, function(err, res) {
                should.not.exist(err);

                var sorted = res.body.map(function(data){
                    return data.number;
                });

                sorted.forEach(function(number, index){
                    if (index > 1) {
                        (sorted[index-1] >= number).should.be.true;
                    }
                })
                done();
            });
    });

    function createRandomDocument(n, callback) {
        var data = {
            description: 'nnt, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            number: Math.floor((Math.random() * 99) + 1)
        };
        model.create(data, function cb(err, doc) {
            if (err) { throw err; }
            fixtureData.push(doc);
            callback();
        });
    }


});
