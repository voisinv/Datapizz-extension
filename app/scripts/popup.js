'use strict';

var extensionCtrl = function($http, URLS) {
  var self = this;

  self.tagsSelected = [];
  self.tags = [];
  (function connect() {
    // download the data into a local object
    console.log(URLS.getAll)
    return $http.get(URLS.getAll).then(function (res) {
      console.log(res);
      self.links = res.data.links;
      self.articles = res.data.articles;
      self.tags = _.each( res.data.tags, function ( e ){ e.select = false ; })

      return;
    });
  })();

  self.addTag = function() {
    self.tags.push({
      "value": self.nameNewTag,
      select: true
    });

  };

  self.save = function() {

    var article = {
      value: self.url,
      title: self.title,
      tags: []
    };

    _.each(self.tags.filter(function(e){return e.select}), function(e) {
      var tag = {value: e.value};
      if(e.hasOwnProperty('id')) tag.id = e.id;
      article.tags.push(tag);
    });

    $http.post(URLS.setArticle, article).then(function(res){console.log('resultat', res)})
  };

  self.goApp = function() {
    chrome.tabs.create({url: 'http://datapizz.herokuapp.com'})
  }

  chrome.tabs.getSelected(null,function(onglet){
    console.log('onglet', onglet);
    var url = onglet.url;
    self.url = url.substr(url.indexOf('://')+3)
    self.title=onglet.title;
  });
};

angular.module('datapizz-extension', ['firebase', 'constant'])
.controller('ExtensionCtrl', extensionCtrl);
