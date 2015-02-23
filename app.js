var app = angular.module('plunker', ['ui.bootstrap']);

app.directive('jsonText', function() {
  return {
    restrict: 'A', // only activate on element attribute
    require: 'ngModel', // get a hold of NgModelController
    link: function(scope, element, attrs, ngModelCtrl) {
      function fromUser(text) {
        // Beware: trim() is not available in old browsers
        if (!text || text.trim() === '')
          return {}
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

   $scope.message = "Hello";

   $scope.pages = ["businessPage", "employeePage", "checkinPage", "formsPage", "confirmPage", "authPage", "genPage"];
   $scope.pageSelect = $scope.pages[1]; //Page at load, good for debugging
});

//Business API
app.controller('businessCtrl', function($scope, $http) {
   $scope.resource = [{
      header: "View Business Configuration",
      description: "",
      method: "GET",
      uri: "/api/office/:id/config",
      request: null,
      reqParam: [
         ["id", "integer", "business id"]
      ],
      response: {
         fields: [{
            companyName: "GoldTeam",
            username: "Golds",
            password: "hello123",
            email: "johndoe@johndoe.com",
            phone: "934-034-3494",
            logo: "/path/.jpg",
            walkins: true
         }]
      },
      resParam: [
         ["fields", "array", "array of fieldObjects"]
      ]
   }, {
      header: "Update/Modify Business Configuration",
      method: "PUT",
      uri: "/api/office/:id/config",
      request: {
         fields: [{
            companyName: "GoldTeam",
            username: "Golds",
            password: "hello123",
            email: "johndoe@johndoe.com",
            phone: "934-034-3494",
            logo: "/path/.jpg",
            walkins: true
         }]
      },
      reqParam: [
         ["companyName", "string", "name of the company"],
         ["username", "string", "password for login"],
         ["password", "string", "password for login"],
         ["email", "string", "email of the company"],
         ["phone", "string", "phone number to connect"],
         ["logo", "string", "logo of the company an path to the image"],
         ["walkins", "boolean", "are walkins allowed"]
      ],
      response: null,
      resParam: null
   }, {
      header: "Sign-up Business",
      description: "Not Implemented for Mobile"
   }];
});

//Employee API
app.controller('employeeCtrl', function($scope, $http) {
   $scope.bMessage = "Employee Hello";
   $scope.resource = [{
      header: "View Account",
      method: "GET",
      uri: "/api/office/:id",
      request: null,
      reqParam: [
         ["id", "integer", "business id"]
      ],
      response: {
         fields: [{
            email: "johndoe@johndoe.com",
            fname: "John",
            lname: "Doe",
            password: "hello123",
            registerToken: "jd-123"

         }]
      },
      resParam: [
         ["fields", "array", "array of fieldObjects (See DB Schema)"]
      ]
   }, {
      header: "Update/Modify Account",
      method: "PUT",
      uri: "/api/office/:id",
      request: {
         fields: [{
            email: "johndoe@johndoe.com",
            fname: "John",
            lname: "Doe",
            password: "hello123",
            registerToken: "jd-123"

         }]
      },
      reqParam: [
         ["fields", "array", "array of fieldObjects (See DB Schema)"]
      ],
      response: "200(OK)",
      resParam: null
   }, {
      header: "Create Account",
      method: "POST",
      uri: "/api/office/:id",
      request: {
         fields: [{
            email: "johndoe@johndoe.com",
            fname: "John",
            lname: "Doe",
            password: "hello123",
            registerToken: "jd-123"

         }]
      },
      reqParam: [
         ["fields", "array", "array of fieldObjects (See DB Schema)"]
      ],
      response: "201(CREATED)",
      resParam: null
   }, {
      header: "Delete Account",
      method: "DELETE",
      uri: "/api/",
      request: {},
      reqParam: [],
      response: "200(OK)",
      resParam: []
   }];
});

//Checkin API
//Confirm Identity
//Sign Disclosure Agreements
app.controller('checkinCtrl', function($scope, $http) {
   $scope.bMessage = "Check-in Hello";
   $scope.resource = [{
      header: "Submit Identifying Details",
      method: "GET",
      uri: "/api/office/:id/appointments?fname={string}&lname={string}",
      request: {
         fields: [{
            fname: "John",
            lname: "Doe",
            dob: "05/13/1965",
         }]
      },
      reqParam: [
         ["id", "ObjectId", "bussiness id"],
         ["fields", "array", "array of fieldObjects"]
      ],
      response: {},
      resParam: []
   }, {
      header: "Sign Disclosure Agreements",
      method: "POST",
      uri: "/api/business/:id/appointments/signature",
      request: {
         signature: "John Doe",
      },
      reqParam: [
         ["id", "ObjectId", "bussiness id"],
         ["signature", "string", "signature of user"]
      ],
      response: {},
      resParam: []
   }];
});

//Form API
app.controller('formsCtrl', function($scope, $http) {
   $scope.resource = [{
      header: "Request a form",
      method: "GET",
      uri: "/api/office/:bid/form/",
      request: null,
      reqParam: null,
      response: {
         fields: "[fieldObject]"
      },
      resParam: [
         ["fields", "array", "array of fieldObjects"]
      ]
   }, {
      header: "Send a form response",
      method: "POST",
      uri: "/api/office/:id/formResponses/form",
      request: {
         answers: [{
            label: "Name",
            response: "John Doe"
         }, {
            label: "Gender",
            response: "Female"
         }, {
            label: "Email",
            response: "john.doe@example.com"
         }, {
            label: "Favorite Color",
            response: "Blue"
         }]
      },
      reqParam: [
         ["answers", "array", "array of answersObject"],

      ],
      response: "200(OK)",
      resParam: null
   }, {
      header: "Modify a form response",
      method: "PUT",
      uri: "/api/office/:id/formResponse/form/",
      request: {
         answers: [{
            label: "Name",
            response: "John Doe The Great"
         }]
      },
      reqParam: [
         ["answers", "array", "array of answersObject"],

      ],
      response: {
         fields: {
            employee: 9585938934,
            appointment: 438398498294,
            answers: [{
               label: "Name",
               response: "John Doe The Great"
            }, {
               label: "Gender",
               response: "Female"
            }, {
               label: "Email",
               response: "john.doe@example.com"
            }, {
               label: "Favorite Color",
               response: "Blue"
            }]
         }
      },
      resParam: [
         ["employee", "ObjectId", "employee id"],
         ["id", "ObjectId", "appointment id"]
      ]
   },{
      header: "Confirm Appointment",
      method: "GET",
      uri: "/api/office/appointment/:id",
      request: null,
      reqParam: null,
      response: {
         fields: "[fieldObject]"
      },
      resParam: [
         ["fields", "array", "array of fieldObjects"]
      ]
   },{
      header: "Reject Appointment",
      method: "GET",
      uri: "/api/office/:bid/form/",
      request: null,
      reqParam: null,
      response: {
         fields: "[fieldObject]"
      },
      resParam: [
         ["fields", "array", "array of fieldObjects"]
      ]
   }
   ];

});

//Confirmation API
app.controller('confirmCtrl', function($scope, $http) {
   $scope.bMessage = "confirm Hello";
   $scope.resource = [{
      header: "Confrimation Stuff",
      method: "GET",
      uri: "/api/...",
      request: {},
      reqParam: [],
      response: {},
      resParam: []
   }];

});

//Auth API
app.controller('authCtrl', function($scope, $http) {
   $scope.bMessage = "Auth Hello";
   $scope.resource = [{
      header: "Get Authentication",
      method: "GET",
      uri: "/api/...",
      request: {},
      reqParam: [],
      response: {},
      resParam: []
   }];

});

//Generator
app.controller('genCtrl', function($scope, $http) {
   $scope.resource = [{
      header: "Get Data from generator",
      method: "GET",
      uri: "/api/generator/:id",
      request: { "key" : "value" },
      reqParam: [["var","type","description"]],
      response: { "key" : "value" },
      resParam: [["var","type","description"]]
   }];

});