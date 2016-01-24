angular.module('datapizz-extension')
  .service('ServiceArticles', function ($firebaseObject) {
    var existingTags = ['foot', 'rugby', 'hand'];

    /**
     * First call to db
     * Configure and call the database to get tags and articles
     * @returns {PromiseLike<TResult>|Promise<TResult>|Promise.<T>|*}
     */
    this.get = function () {
      var ref = new Firebase('https://dev-fb.firebaseio.com/');

      self.data = $firebaseObject(ref);

      return self.data.$loaded().then(function () {
          self.keys = self.data.tags ? _.keys(self.data.tags) : [];
          existingTags = self.data.tags ? _.uniq(_.flatten(_.map(self.data.articles, 'tags'))) : [];
          //self.existingTags = _.uniq(_.flatten(_.map(_.values(self.data.articles), 'tags')));

          console.log('existingTags', existingTags);
          return {
            existingTags: existingTags
          }
        },
        function () {
          console.log('error from firebase response');
        }
      );
    };

    /**
     * Check if str exists in existTags
     * @param str - string entered by the user
     * @returns {boolean|*}
     */
    this.isTagExist = function(str) {
      return _.some(existingTags, _.partial(_.contains, _, str))
    }

    /**
     * Get all existingTags where str is found
     * @param str
     * @returns [tags] - Array
     */
    this.getExistingTags = function(str) {
      return _.filter(existingTags, function(elem) {
        return _.contains((''+elem).toLowerCase(), str);
      });
    }
  });