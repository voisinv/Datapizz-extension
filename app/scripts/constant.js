/**
 * Created by Mac-Vincent on 21/04/15.
 */

/* global angular */

//var URL_SERVER = 'https://datapizz.herokuapp.com';
var URL_SERVER = 'https://localhost:3000';
var PORT_URL = '';
var COMPLETE_URL = URL_SERVER + ':' + PORT_URL;
var BDD_URL = 'https://test-datapizz.firebaseio.com/';


var urlToCall = {
  getAll : COMPLETE_URL + '/api/tags',
  setArticle : COMPLETE_URL + '/api/articles',
  getBddUrl : BDD_URL
};

angular.module('constant', []).constant('URLS', urlToCall);