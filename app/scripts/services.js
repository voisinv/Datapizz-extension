angular.module('datapizz-extension')
  .service('ServiceArticles', function ($firebaseObject, constants) {
    var existingTags;
    var originalTags;
    var articles;

    /**
     * First call to db
     * Configure and call the database to get tags and articles
     * @returns {PromiseLike<TResult>|Promise<TResult>|Promise.<T>|*}
     */
    this.get = function (URL) {
      var ref = new Firebase(URL);

      self.data = $firebaseObject(ref);
      existingsTags = [];
      originalTags = [];
      articles = [];

      return self.data.$loaded().then(function () {
          articles = _.map(self.data.articles || []);
          var tags = _.map(self.data.tags || [], _.partial(_.pick, _, 'value', 'category'));
          existingTags = tags;
          originalTags = angular.copy(tags);
          return true;
        },
        function () {
        }
      );
    };

    /**
     * Check if the article where the app has been opened already exist in database
     * If true, return it otherwise []
     */
    this.getArticleIfExist = function(title, url) {
      return articles.filter(function(article) {
        return article.title === title || article.url === url;
      })
    };

    /**
     * Check if str exists in existTags
     * @param str - string entered by the user
     * @returns {boolean|*}
     */
    this.isTagExist = function(str) {
      return _.some(existingTags, function(elem) {
        return _.contains((''+elem.value).toLowerCase(), str);
      });
    };

    /**
     * Get all existingTags where str is found in value property
     * @param str
     * @returns [tags] - Array
     */
    this.getExistingTags = function(str) {
      return _.uniq(
        _.filter(existingTags, function(elem) {
          return _.contains((''+elem.value).toLowerCase(), str);
        }),
        function(tag) {
          return tag.value;
        }
      );
    };

    /**
     * Add new tag to existingTags list
     */
    this.addTag = function(tag) {
      existingTags.push(tag);
    };

    /**
     * Return categories
     */
    this.getCategories = function() {
      return _.uniq(_.map(existingTags, 'category'));
    };

    /**
     * Get tags to add in firebase
     * @returns {T[]|Array.<T>}
     */
    this.getTagsToSave = function(tags) {
      var originalTagsValue = _.map(originalTags, 'value');
      return tags.filter(function(tag) {
        return !(originalTagsValue.indexOf(('' + tag.value).toLowerCase()) + 1);
      })
    };

  });

