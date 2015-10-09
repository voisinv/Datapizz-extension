'use strict';

var extensionCtrl = function($scope, $firebaseObject) {
  var self = this;
  var ref = new Firebase("https://test-datapizz.firebaseio.com/");

  console.log('firebase obj', $firebaseObject(ref))
  self.data = $firebaseObject(ref);

  self.data.$loaded()
    .then(function() {
      self.keys = self.data.tags ? _.keys(self.data.tags) : [];
      self.tags = self.data.tags ? _.values(self.data.tags).map(function(e, i) {
        e.key = self.keys[i];
        return e;
      }) : [];

    });

  self.addTag = function() {

    var index = _.indexOf(_.map(self.tags, function(e) {return e.value}), self.nameNewTag)
    if (index >= 0) {self.tags[index].selected = true; return;}
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
    });

    var refTags = ref.child('tags');
    tags.forEach(function(tag) {
      if (tag.hasOwnProperty('key')) {
        refTags
          .child(tag.key)
          .update({radius: tag.radius + 5})
      } else {
        refTags
          .push({
            radius: 5,
            value: tag.value
          });
      }
    });

    ref.child('articles')
      .push({
        tags: tags,
        url: self.url,
        title: self.title
      });

  };

  self.goApp = function() {
    chrome.tabs.create({url: 'http://pizzaaa.herokuapp.com'})
  };

  chrome.tabs.getSelected(null,function(onglet){
    console.log('onglet', onglet);
    var url = onglet.url;
    self.url = url.substr(url.indexOf('://')+3)
    self.title=onglet.title;
  });
};

angular.module('datapizz-extension', ['firebase', 'constant'])
.controller('ExtensionCtrl', extensionCtrl);
