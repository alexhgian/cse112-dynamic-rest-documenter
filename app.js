'use strict';
var app = angular.module('plunker', ['ui.bootstrap']);

app.directive('jsonText', function() {

  return {
    restrict: 'A', // only activate on element attribute
    require: 'ngModel', // get a hold of NgModelController
    link: function(scope, element, attrs, ngModelCtrl) {
      function fromUser(text) {
        // Beware: trim() is not available in old browsers
        if (!text || text.trim() === '')
          return {};
        else
        // TODO catch SyntaxError, and set validation error..
          return angular.fromJson(text);
      }

      function toUser(object) {
        // better than JSON.stringify(), because it formats + filters $$hashKey etc.
        return angular.toJson(object, true);
      }

      // push() if faster than unshift(), and avail. in IE8 and earlier (unshift isn't)
      ngModelCtrl.$parsers.push(fromUser);
      ngModelCtrl.$formatters.push(toUser);

      // $watch(attrs.ngModel) wouldn't work if this directive created a new scope;
      // see http://stackoverflow.com/questions/14693052/watch-ngmodel-from-inside-directive-using-isolate-scope how to do it then
      scope.$watch(attrs.ngModel, function(newValue, oldValue) {
        if (newValue != oldValue) {
          ngModelCtrl.$setViewValue(toUser(newValue));
          // TODO avoid this causing the focus of the input to be lost..
          ngModelCtrl.$render();
        }
      }, true); // MUST use objectEquality (true) here, for some reason..
    }
  };
});

app.controller('MainCtrl', function($scope, $http) {


  $scope.getData = function(jsonUrl) {
    $http.get(jsonUrl).success(function(data) {
      $scope.resources = data;
    });
  }
  $scope.getData('api.json');

  $scope.setPage = function(index) {
    $scope.pageSelect = index;
  }
  $scope.message = "Hello";
  $scope.pages = ["businessPage", "employeePage", "checkinPage", "formsPage", "confirmPage", "authPage", "genPage"];
  $scope.pageSelect = 0; //Page at load, good for debugging


});


//Generator
app.controller('genCtrl', function($scope, $http) {
  $scope.jsonUrl = "https://api.myjson.com/bins/3xeq7";
  $scope.resource = {
    "NewResourceName": [{
      "header": "Get a user",
      "description": "",
      "method": "GET",
      "uri": "/api/user/:id",
      "request": null,
      "reqParam": [
        ["id", "String", "user id"]
      ],
      "response": {
        "first": "Alex",
        "last": "Gian",
      },
      "resParam": [
        ["first", "String", "first name"],
        ["last", "String", "last name"]
      ]
    }]

  };

});