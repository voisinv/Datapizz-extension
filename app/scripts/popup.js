'use strict';

var extensionCtrl = function($scope, $http, URLS) {
  var self = this;

  self.tagsSelected = [];
  self.tags = [];
  (function connect() {
    // download the data into a local object
    console.log(URLS.getAll)
    return $http.get(URLS.getAll).then(function (res) {
      self.tags = res.data || []
      self.tagsSelected = [];
      console.log('res', res);
    });
  })();

  self.addTag = function() {
    self.tagsSelected.push(self.nameNewTag);
    self.tagsSelected = _.uniq(self.tagsSelected);
    self.nameNewTag = '';
  };

  self.save = function() {
    var article = {
      value: self.url,
      title: self.title,
      tagsToUpdate: {},
      tagsToCreate: [],
      articlesIds: _.sortBy(_.uniq(self.tagsSelected))
    };

    for(var i = 0, length = self.tagsSelected.length; i < length ; i++) {
      var currentValue = self.tagsSelected[i];

      var o = _.findWhere(self.tags, {value: currentValue});
      debugger;
      if( o ) {
        var key = _.findKey(self.tags, o);
        article.tagsToUpdate[key] = o;
      } else {
        article.tagsToCreate.push(currentValue);
      }
    }

    //article.tags = _.reject(self.tags, function(e) {return e.select == false})
    console.log('save', self.tags, article.tags)
    $http.post(URLS.setArticle, article).then(function(res){console.log('resultat', res);})
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
