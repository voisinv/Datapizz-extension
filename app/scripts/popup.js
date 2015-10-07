'use strict';

/* global angular, Firebase */

var extensionCtrl = function($scope, $firebaseObject) {
  var self = this;
  var ref = new Firebase('https://datapizzz.firebaseio.com/');

  console.log('firebase obj', $firebaseObject(ref));
  self.data = $firebaseObject(ref);

  self.data.$loaded()
    .then(function() {
      self.tags = self.data.tags.map(function(e) {
        return {value: e.value, selected: false};
      });
    });

  self.addTag = function() {
    self.newTag  = {value: self.nameNewTag};
    self.newTag.selected = true;
    self.tags.push(self.newTag);
    self.nameNewTag = '';
  };

  self.selectItem = function(index) {
    self.tags[index].selected = !self.tags[index].selected;
  };

  self.save = function() {
    var tags = self.tags.filter(function(e) {
      return e.selected;
    }).map(function(e) {
      return e.value;
    });

    ref.child('articles')
      .push({
        id: 10,
        tags: tags,
        url: self.url,
        title: self.title
      });
  };

  self.goApp = function() {
    chrome.tabs.create({url: 'http://pizzaaa.herokuapp.com'});
  };

  chrome.tabs.getSelected(null,function(onglet){
    console.log('onglet', onglet);
    var url = onglet.url;
    self.url = url.substr(url.indexOf('://')+3);
    self.title=onglet.title;

  });
};

angular.module('datapizz-extension', ['firebase', 'constant'])
.controller('ExtensionCtrl', extensionCtrl);
