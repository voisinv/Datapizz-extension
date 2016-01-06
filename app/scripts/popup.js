'use strict';

/* global angular, Firebase, _, moment */

var extensionCtrl = function($scope, $firebaseObject, $http) {
    var self = this;
    var ref = new Firebase('https://pizzaaa.firebaseio.com/');
    //var ref = new Firebase('https://test-datapizz.firebaseio.com/');

    console.log('firebase obj', $firebaseObject(ref));
    self.data = $firebaseObject(ref);
    self.newTags = [];
    self.existingTags = [];
    self.loading = true;
    self.pizzaLoader = true;
    self.isNewTag = false;
    self.newTagCategory = '';
    self.waitForCategory = false;

    self.init = function() {
        // getting existing tags from firebase
        self.data.$loaded().then(
            function() {
                self.keys = self.data.tags ? _.keys(self.data.tags) : [];
                self.existingTags = self.data.tags ? _.values(self.data.tags).map(function(e, i) {
                    e.key = self.keys[i];
                    return e;
                }) : [];
                self.loading = false;
            },
            function() {
                console.log('error from firebase response');
            }
        );
    };

    self.newVeg = function(chip) {
        return {
            name: chip,
            type: 'unknown'
        };
    };

    self.isNewChip = function(newTag) {
        console.log(newTag);
        var isNew = _.indexOf(self.existingTags.value, newTag);
        console.log(isNew);
        self.waitForCategory = true;
        return isNew ? newTag : "";
    };

    self.save = function() {
        var refTags = ref.child('tags');
        self.tags.forEach(function (tag) {
            var index = _.indexOf(_.map(self.existingTags, function(e) { return e.value; }), tag);
            if (index >= 0) {
                refTags
                    .child(self.keys[index])
                    .update({radius: self.existingTags[index].radius + 5});
            } else {
                refTags
                    .push({
                        radius: 5,
                        value: tag
                    });
            }
        });

        ref.child('articles')
            .push({
                tags: self.tags,
                url: self.url,
                title: self.title,
                date: moment().valueOf()
            });
    };

    self.goApp = function() {
        chrome.tabs.create({url: 'http://pizzaaa.herokuapp.com'});
    };

    chrome.tabs.getSelected(null,function(onglet){
        var url = onglet.url;
        self.url = url.substr(url.indexOf('://')+3);
        self.title = onglet.title;
    });
};

angular.module('datapizz-extension', ['ngMaterial', 'firebase', 'constant'])
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .backgroundPalette('grey')
            .warnPalette('red')
            .accentPalette('pink');
    })
    .controller('ExtensionCtrl', extensionCtrl);
