/**
 * Created by Mac-Vincent on 21/04/15.
 */
var URL_SERVER = 'https://datapizz.herokuapp.com';
var PORT_URL = '';
var COMPLETE_URL = URL_SERVER + ':' + PORT_URL;


var urlToCall = {
  getAll : COMPLETE_URL + '/api/tags',
  setArticle : COMPLETE_URL + '/api/articles'
}

angular.module('constant', []).constant('URLS', urlToCall);