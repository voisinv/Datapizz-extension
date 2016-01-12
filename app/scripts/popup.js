'use strict';

/* global angular, Firebase, _, moment */

var extensionCtrl = function($scope, $firebaseObject) {
    var self = this;
    var ref = new Firebase('https://pizzaaa.firebaseio.com/');
    //var ref = new Firebase('https://test-datapizz.firebaseio.com/');

    self.data = $firebaseObject(ref);
    self.newTags = [];
    self.existingTags = [];
    self.loading = true;
    self.pizzaLoader = true;
    self.isNewTag = false;
    self.newTagCategory = '';
    self.videoMediaType = false;
    self.imageMediaType = false;
    self.textMediaType = false;

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

    self.newVeg = function(tag) {
        if (angular.isObject(tag)) {
            self.isNewTag = false;
            return tag;
        } else if (angular.isString(tag)) {
            self.isExistingChip(tag);
            return {value: tag, category: ''};
        }
    };

    self.isExistingChip = function(tag) {
        for(var i=0; i<self.existingTags.length; i++) {
            if(self.existingTags[i].value === tag) {
                self.isNewTag = false;
                return;
            }
        }
        self.isNewTag = true;
    };

    self.selectedItem = null;
    self.searchText = "";
    self.querySearch = function(search) {
        search = search || "";
        return self.existingTags.filter(function(vO) {
            return !search || vO.value.toLowerCase().indexOf(search.toLowerCase()) >= 0 ;
        })
    };

    self.addCategory = function() {
        _.last(self.newTags).category = self.newTagCategory;
        self.isNewTag = false;
    };

    self.save = function() {
        var refTags = ref.child('tags');
        var newArticleTags = [];
        self.newTags.forEach(function (tag) {
            var index = _.indexOf(_.map(self.existingTags, function(e) { return e.value; }), tag);
            if (index >= 0) {
                refTags
                    .child(self.keys[index])
                    .update({radius: self.existingTags[index].radius + 5});
            } else {
                refTags
                    .push({
                        radius: 5,
                        value: tag.value,
                        category: tag.category
                    });
            }

            newArticleTags.push(tag.value);
        });

        ref.child('articles').push({
            tags: newArticleTags,
            url: self.url,
            title: self.title,
            date: moment().valueOf(),
            video: self.videoMediaType,
            image: self.imageMediaType,
            text: self.textMediaType
        });
    };

    self.goApp = function() {
        chrome.tabs.create({url: 'http://pizzaaa.herokuapp.com'});
    };

    chrome.tabs.getSelected(null,function(onglet) {
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
    .controller('ExtensionCtrl', extensionCtrl)
    .directive('focusMe', function($timeout) {
      return {
        link: function(scope, element, attrs) {
          scope.$watch(attrs.focusMe, function(value) {
            if(value === true) {
              console.log('value=',value);
              //$timeout(function() {
              element[0].focus();
              scope[attrs.focusMe] = false;
              //});
            }
          });
        }
      };
    })/*
    .directive('mdHideAutocompleteOnEnter', function () {
      return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
          if(event.which === 13) {
            scope.$apply(function (){
              $scope.$$childHead.$mdAutocompleteCtrl.hidden = true;
            });

            event.preventDefault();
          }
        });
      };
    })*/
    .directive('ngEnter', function() {
      return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
          if(event.which === 13) {
            scope.$apply(function(){
              scope.$eval(attrs.ngEnter);
            });
            event.preventDefault();
          }
        });
      };
    });