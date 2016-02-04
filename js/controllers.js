'use strict';

/* Controllers */

var appControllers = angular.module('appControllers', []);

/* FOOTER */
appControllers.controller('FooterCtrl', ['$scope', '$sce',
   function ($scope, $sce) {
      $scope.footer = $sce.trustAsHtml('&copy; 2008-' + new Date().getFullYear() + ' Andy Beck');
   }
]);

/* NAVIAGTION auto close on click & set current to active */
appControllers.controller('NavCtrl', ['$scope', '$location', 'sortData', 
   function ($scope, $location, sortData) {

      sortData.getItems().then(function (categories) {
         $scope.categories = categories.categories;
      });
      $scope.$on('$routeChangeSuccess', function () {
         $scope.navShow = true;
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

/* DEFAULT VIEW controller */
appControllers.controller('PageCtrl', ['$scope',
  function ($scope) {
    $scope.page.setDirection('none');
  }
]);

/* SUBSCRIBE VIEW controller */
appControllers.controller("subscribeFormCtrl", ["$scope", "utilities",
  function ($scope, utilities) {
    $scope.change = function () {
      var newName = utilities.splitName($scope.mailchimp.NAME);
      $scope.mailchimp.FNAME = newName.first_name;
      $scope.mailchimp.LNAME = newName.last_name;
    };
  }
]);

/* CONTACT VIEW controller */
appControllers.controller('ContactCtrl', ['$scope', 'utilities', 
  function ($scope, utilities) {
    $scope.page.setDirection('none');
    $scope.change = function () {
      var newName = utilities.splitName($scope.contact.NAME);
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
appControllers.controller('ListCtrl', ['$scope', 'sortData',
   function ($scope, sortData) {

      $scope.page.showSubNav(true);
      $scope.page.setDirection('none');

      sortData.getItems().then(function (categories) {
         $scope.title = categories.categories;
         $scope.page.setTitle($scope.title);
      });
      sortData.getItems().then(function (items) {
         $scope.items = items.items;
      });

   }
]);

/* DETAIL VIEW controller */
appControllers.controller('DetailCtrl', ['$scope', '$routeParams', '$filter', '$location', 'sortData',
   function ($scope, $routeParams, $filter, $location, sortData) {

      $scope.page.showSubNav(true);
      this.shareOpen = false;

      $scope.url = $routeParams.itemUrl;

      sortData.getItems().then(function (items) {
         $scope.items = items;
      });
      $scope.$on('updateCategory', function (events, items) {

         /* get item by matching url with parameters */
         var item = $filter('filter')(items, {
            url: $scope.url
         }, true)[0];

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
            $scope.page.setDirection('forward');
            $location.url('/gallery/' + items[page].category.toLowerCase() + '/' + items[page].url);
         };

         /* view next */
         $scope.getNext = function (page) {
            $scope.page.setDirection('backward');
            $location.url('/gallery/' + items[page].category.toLowerCase() + '/' + items[page].url);
         };

         /* tweet on twitter */
         $scope.tweet = function (item) {
            //console.log();
            window.open('https://twitter.com/intent/tweet?url=http%3A%2F%2Fandybeck.co.uk/gallery/' + item.category.toLowerCase() + '/' + item.url + '%2F&text=' + item.title + '&hashtags=andybeck,painting', '_blank', 'width=600, height=260');
         };

         /* like on facebook */
         $scope.like = function (item) {
            window.open('https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fandybeck.co.uk/gallery/' + item.category.toLowerCase() + '/' + item.url + '%2F', '_blank', 'width=580, height=550');
         };

         /* pin on pinterest */
         $scope.pin = function (item) {
            window.open('http://www.pinterest.com/pin/create/button/?url=http%3A%2F%2Fandybeck.co.uk/gallery/' + item.category.toLowerCase() + '/' + item.url + '&media=http%3A%2F%2Fandybeck.co.uk/images/' + item.image + '.jpg&description=Andy+Beck+-+' + item.title, '_blank', 'width=750, height=540');
         };

      });

   }
]);
