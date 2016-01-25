'use strict';

/* global angular, Firebase, _, moment */

var extensionCtrl = function ($scope, $firebaseObject, ServiceArticles, $mdDialog) {
  var self = this;
  var ref = new Firebase('https://test-datapizz.firebaseio.com/');
  //var ref = new Firebase('https://dev-fb.firebaseio.com/');

  self.data = $firebaseObject(ref);
  self.tags = [];
  self.existingTags = [];
  self.loading = true;
  self.pizzaLoader = true;
  self.isNewTag = false;
  self.newTagCategory = '';
  self.mediaTypes = [{
    name: 'video',
    selected: false
  },
    {
      name: 'Image',
      selected: false
    },
    {
      name: 'Text',
      selected: false
    }];

  /**
   * Initialize the app
   * Get existing tags from ServiceArticles
   */
  self.init = function () {
    // getting existing tags from firebase
    ServiceArticles.get().then(function () {
      self.loading = false;

      // Check if this article has already been added
      var article = ServiceArticles.getArticleIfExist(self.title, self.url);

      // If true
      if (article.length) {
        //Iterate over each mediaType of article registered
        _.forEach(_.first(article).mediaTypes || [], function(type) {
          // Automatically update mediaType for current article
          _.findWhere(self.mediaTypes, {name: type}).selected = true;
        });
      }
    });
  };

  /**
   * Search for tags...
   */
  self.querySearch = function (search) {
    return ServiceArticles.getExistingTags(('' + search).toLowerCase());
  };

  /**
   * Return the proper object when the append is called.
   */
  self.transformChip = function (chip, $event) {
    // If it is an object, it's already a known chip
    if (angular.isObject(chip)) {
      return chip;
    }

    // If user tap enter without having selected the autocomplete tag
    // To discuss
    if (ServiceArticles.isTagExist(chip)) {
      return ServiceArticles.getExistingTags(chip)[0];
    }

    // Otherwise, create a new one
    self.openDialog = (function ($event) {
      $mdDialog.show({
        controller: 'DialogCtrl',
        controllerAs: 'ctrll',
        templateUrl: 'dialog.tpl.html',
        parent: angular.element(document.body),
        targetEvent: $event,
        clickOutsideToClose: true,
        locals: {
          categories: ServiceArticles.getCategories()
        }
      })
      .then(function(res) {
        var newTag = {
          value: chip,
          category: res
        };
        ServiceArticles.addTag(newTag);
        self.tags.push(newTag)
      })
    })($event);
    return null;
  };

  self.save = function () {
    var refTags = ref.child('tags');
    var newArticleTags = [];

    // new tags to save in the database
    var tagsToSave = ServiceArticles.getTagsToSave(self.tags);

    // save tags
    tagsToSave.forEach(function(tag) {
      refTags.push({
        value: tag.value,
        category: tag.category
      })
    });

    // save article
    ref.child('articles').push({
      tags: _.map(self.tags, 'value'),
      url: self.url,
      title: self.title,
      date: moment().valueOf(),
      mediaTypes: _.map(_.filter(self.mediaTypes, 'selected'), 'name')
    });
    window.close();
  };

  self.goApp = function () {
    chrome.tabs.create({url: 'http://pizzaaa.herokuapp.com'});
  };

  chrome.tabs.getSelected(null, function (onglet) {
    var url = onglet.url;
    self.url = url.substr(url.indexOf('://') + 3);
    self.title = onglet.title;
  });
};

angular.module('datapizz-extension', ['ngMaterial', 'firebase', 'constant'])
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .backgroundPalette('grey')
      .warnPalette('red')
      .accentPalette('pink');
  })
  .controller('ExtensionCtrl', extensionCtrl)
  .controller('DialogCtrl', function ($timeout, $q, $scope, $mdDialog, categories) {
    var self = this;

    // list of `state` value/display objects
    self.categories = categories;
    self.querySearch = querySearch;
    // ******************************
    // Template methods
    // ******************************
    self.cancel = function ($event) {
      $mdDialog.cancel();
    };
    self.finish = function ($event) {
      $mdDialog.hide(self.searchText);
    };
    // ******************************
    // Internal methods
    // ******************************

    $scope.$watch(function() {
      return self.selectedItem;
    }, function(val) {
      if (!_.isNull(val) && !_.isUndefined(val)) {
        $mdDialog.hide(self.selectedItem);
      }
    });

    /**
     * Search for tags...
     */
    function querySearch(query) {
      var str = ('' + query).toLowerCase();
      return _.filter(categories, function(elem) {
        return _.contains((''+elem).toLowerCase(), str);
      });
    }
  });