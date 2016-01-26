'use strict';

/* Controllers */

var appControllers = angular.module('appControllers', []);

/* DATE */
appControllers.controller('DateCtrl', ['$scope',
  function ($scope) {
    $scope.date = new Date();
  }
]);

/* NAVIAGTION auto close on click & set current to active */
appControllers.controller('NavCtrl', ['$scope', '$location',
  function ($scope, $location) {
    $scope.isCollapsed = true;
    $scope.$on('$routeChangeSuccess', function () {
      $scope.isCollapsed = true;
    });
    $scope.getClass = function (path) {
      if (path === '/') {
        if ($location.path() === '/') {
          return "active";
        } else {
          return "";
        }
      }
      if ($location.path().substr(0, path.length) === path) {
        return "active";
      } else {
        return "";
      }
    }
  }
]);

/* SOCIAL LINKS controller */
appControllers.controller('SocialCtrl', ['$scope',
  function ($scope) {
    $scope.socialUrl = function (url) {
      //console.log(link);
      window.open(url, '_blank');
    };
  }
]);

/* SUBSCRIBE DIALOG controller */
appControllers.controller('subscribeCtrl', ['$scope', '$mdDialog',
  function ($scope, $mdDialog) {
    $scope.subscribe = function ($event) {
      $mdDialog.show({
        targetEvent: $event,
        controller: DialogCtrl,
        templateUrl: 'partials/subscribe.html',
        openFrom: '#subscribe',
        closeTo: '#subscribe',
        clickOutsideToClose: true
      });
    };
    function DialogCtrl($scope, $mdDialog) {
      $scope.closeDialog = function () {
        $mdDialog.cancel();
      };
    };    
  }
]);

/* HOME PAGE VIEW controller */
appControllers.controller('HomeCtrl', ['$scope', '$rootScope',
  function ($scope, $rootScope) {
    /* title is set in $routeProvider */
    $scope.page.setTitle('Home');
    //$scope.pageClass = 'view home';
    $rootScope.direction = 'none';
  }
]);

/* PAGE VIEW controller */
appControllers.controller('PageCtrl', ['$scope', '$rootScope',
  function ($scope, $rootScope) {
    /* title is set in $routeProvider */
    //$scope.pageClass = 'view';
    $rootScope.direction = 'none';
  }
]);

/* CONTACT VIEW controller */
appControllers.controller('ContactCtrl', ['$scope', '$rootScope',
  function ($scope, $rootScope) {
    /* title is set in $routeProvider */
    //$scope.pageClass = 'view';
    $rootScope.direction = 'none';
    $scope.splitName = function (fullName) {
      var formData = {},
          nameArr = fullName.split(' ');
      if (nameArr.length == 1) {
        formData.first_name = nameArr[0];
        formData.last_name = '';
      } else if (nameArr.length > 2) {
        formData.last_name = nameArr.pop();
        formData.first_name = nameArr.join(' ');
      } else {
        formData.first_name = nameArr[0];
        formData.last_name = nameArr[nameArr.length - 1];
      }
      return formData;
    };
    $scope.change = function () {
      var newName = $scope.splitName($scope.contact.NAME);
      $scope.contact.FNAME = newName.first_name;
      $scope.contact.LNAME = newName.last_name;
    };
    //$scope.data = {
    //  full_name: 'Joe Middle Name Smith',
    //  first_name: '',
    //  last_name: '',
    //}
    //var example = $scope.splitName($scope.data.full_name);
  }
]);

/* LIST VIEW controller */
appControllers.controller('ListCtrl', ['$scope', '$rootScope', '$routeParams', '$http', '$filter',
  function ($scope, $rootScope, $routeParams, $http, $filter) {
    //$scope.pageClass = 'view';
    $rootScope.direction = 'none';
    $http.get('data/gallery.json').success(function (data) {

      /* filter items by category from parameters */
      var items = $filter('filter')(data, {
        genre: $routeParams.itemCategory
      });

      /* sort items by date in descending order */
      items.sort(function (a, b) {
        return b.date.localeCompare(a.date);
      });
      $scope.items = items;

      /* page title */
      $scope.page.setTitle(items[0].genre);

    });

  }
]);

/* DETAIL VIEW controller */
appControllers.controller('DetailCtrl', ['$scope', '$rootScope', '$routeParams', '$http', '$filter', '$location', '$mdDialog', 
  function ($scope, $rootScope, $routeParams, $http, $filter, $location, $mdDialog) {

    this.isOpen = false;
    //this.hover = false;

    //$scope.pageClass = 'view detail';
    $scope.url = $routeParams.itemUrl;
    $http.get('data/gallery.json').success(function (data) {

      /* filter items by genre from parameters */
      var items = $filter('filter')(data, {
        genre: $routeParams.itemCategory
      });

      /* sort items by date in descending order */
      items.sort(function (a, b) {
        return b.date.localeCompare(a.date);
      });
      $scope.items = items;

      /* get item by matching url with parameters */
      var item = $filter('filter')(items, {
        url: $scope.url
      }, true)[0];
      //var item = data.filter(function (entry) {
      //  return entry.url === $scope.url;
      //})[0];

      $scope.item = item;

      /* page title */
      $scope.page.setTitle($scope.item.title);

      /* the index of the selected item in the array */
      var currentIndex = items.indexOf(item);

      /* find previous item */
      if (currentIndex > 0)
        $scope.prevItem = Number(currentIndex) - 1;
      else
        $scope.prevItem = items.length - 1;

      /* find next item */
      if (currentIndex < items.length - 1)
        $scope.nextItem = Number(currentIndex) + 1;
      else
        $scope.nextItem = 0;

      /* view previous */
      $scope.getPrev = function (page) {
        $rootScope.direction = 'ltr';
        $location.url('/gallery/' + items[page].genre.toLowerCase() + '/' + items[page].url);
      };

      /* view next */
      $scope.getNext = function (page) {
        $rootScope.direction = 'rtl';
        $location.url('/gallery/' + items[page].genre.toLowerCase() + '/' + items[page].url);
      };

      /* tweet on twitter */
      $scope.tweet = function (item) {
        //console.log();
        window.open('https://twitter.com/intent/tweet?url=http%3A%2F%2Fandybeck.co.uk/gallery/' + item.genre.toLowerCase() + '/' + item.url + '%2F&text=' + item.title + '&hashtags=andybeck,painting', '_blank', 'width=600, height=260');
      };

      /* like on facebook */
      $scope.like = function (item) {
        window.open('https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fandybeck.co.uk/gallery/' + item.genre.toLowerCase() + '/' + item.url + '%2F', '_blank', 'width=580, height=550');
      };

      /* pin on pinterest */
      $scope.pin = function (item) {
        window.open('http://www.pinterest.com/pin/create/button/?url=http%3A%2F%2Fandybeck.co.uk/gallery/' + item.genre.toLowerCase() + '/' + item.url + '&media=http%3A%2F%2Fandybeck.co.uk/images/' + item.image + '.jpg&description=Andy+Beck+-+' + item.title, '_blank', 'width=750, height=540');
      };

    });

  }
]);
