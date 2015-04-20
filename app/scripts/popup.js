'use strict';

var extensionCtrl = function($firebaseObject) {
  var self = this;
  var ref = new Firebase('https://datapizzz.firebaseio.com/');
  var data = $firebaseObject(ref);
  self.tagsSelected = [];
  self.tags = [];
  (function connect() {
    // download the data into a local object
    return data.$loaded().then(function (res) {
      console.log(res);
      self.tags = res.tags
      self.links = res.links;
      self.articles = res.articles;
      self.tags = _.each( res.tags, function ( e ){ e.select = false ; })
      console.log(self)
      return;
    });
  })();

  self.addTag = function() {
    self.tags.push({
      "articleId": [self.articles.length],
      "id": self.tags.length,
      "radius": 5,
      "value": self.nameNewTag,
      select: true
    });
    console.log(self.tags);
  };

  self.save = function() {
    console.log(self.tags, self.tags.filter(function(e){console.log(e.select); return e.select}))
  }

  chrome.tabs.getSelected(null,function(onglet){self.url = onglet.url});
};

angular.module('datapizz-extension', ['firebase'])
.controller('ExtensionCtrl', extensionCtrl);
