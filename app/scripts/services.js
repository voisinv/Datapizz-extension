angular.module('datapizz-extension')
  .service('ServiceArticles', ($firebaseObject) => {
    this.get = () => {
      var ref = new Firebase('https://dev-fb.firebaseio.com/');

      self.data = $firebaseObject(ref);

      return self.data.$loaded().then(() => {
          self.keys = self.data.tags ? _.keys(self.data.tags) : [];
          self.existingTags = self.data.tags ? _.values(self.data.tags).map(function (e, i) {
            e.key = self.keys[i];
            return e;
          }) : [];
          //self.existingTags = _.uniq(_.flatten(_.map(_.values(self.data.articles), 'tags')));

          console.log(self.data.articles);
          self.loading = false;
        },
        () => {
          console.log('error from firebase response');
        }
      );
    };
  }

})
;