/**
 * Created by Mac-Vincent on 21/04/15.
 */
var URL_SERVER = 'http://localhost';
var PORT_URL = '3000';
var COMPLETE_URL = URL_SERVER + ':' + PORT_URL;


var urlToCall = {
  getAll : COMPLETE_URL + '/tags',
  setArticle : COMPLETE_URL + '/articles'
}

angular.module('constant', []).constant('URLS', urlToCall);