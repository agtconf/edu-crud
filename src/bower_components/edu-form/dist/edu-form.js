// Main eduCrud Module
//Declare app level module which depends on filters, and services
var eduFormServices = angular.module('edu-form.services', []);
var eduFormDirectives = angular.module('edu-form.directives', []);
var eduFormFilters = angular.module('edu-form.filters', []);
var eduFormTpl = angular.module('edu-form.tpl', []);
// initialization of services into the main module
angular.module('eduForm', [
  'edu-form.services',
  'edu-form.directives',
  'edu-form.filters',
  'edu-form.tpl',
  'ngResource',
  'ui.bootstrap',
  'eduField'
]);
eduFormServices.factory('dataFactory', [
  '$resource',
  function ($resource) {
    return function (uri) {
      console.log('dataFactory:' + uri);
      return $resource(uri, {}, {
        getAll: {
          method: 'GET',
          params: {},
          headers: { 'Access-Control-Allow-Credentials': true },
          isArray: true
        },
        getCount: {
          method: 'GET',
          params: {},
          headers: { 'Access-Control-Allow-Credentials': true },
          isArray: false
        },
        get: {
          method: 'GET',
          params: {},
          headers: { 'Access-Control-Allow-Credentials': true },
          isArray: false
        },
        insert: {
          method: 'POST',
          params: {},
          headers: { 'Access-Control-Allow-Credentials': true },
          isArray: false
        },
        update: {
          method: 'PUT',
          params: {},
          headers: { 'Access-Control-Allow-Credentials': true },
          isArray: false
        },
        remove: {
          method: 'DELETE',
          params: {},
          headers: { 'Access-Control-Allow-Credentials': true },
          isArray: false
        }
      });
    };
  }
]);
'use strict';
eduFormDirectives.directive('eduForm', function () {
  return {
    restrict: 'AE',
    templateUrl: 'directives/edu-form.html',
    replace: true,
    scope: {
      options: '=options',
      result: '=result'
    },
    controller: [
      '$scope',
      '$element',
      function ($scope, $element) {
        $scope.save = function () {
          if ($scope.options.formListeners.onsave === undefined)
            return;
          console.log('form controller onsave()');
          $scope.options.formListeners.onsave($scope.result);
        };
        $scope.cancel = function () {
          if ($scope.options.formListeners === undefined)
            return;
          console.log('form controller oncancel()');
          $scope.options.formListeners.oncancel();
        };
        console.log('fomrController fin');
      }
    ],
    link: function ($scope, $document) {
    }
  };
});
angular.module('edu-form.tpl').run([
  '$templateCache',
  function ($templateCache) {
    'use strict';
    $templateCache.put('directives/edu-form.html', '<form class=formedu role=form novalidate autocomplete=off name={{options.formMetaData.name}} id={{options.formMetaData.id}}><tabset ng-if=options.formMetaData.tabsShow><tab heading={{tab.tabname}} ng-repeat="tab in options.formFields.tabs"><div ng-repeat="field in tab.fields"><ng-form name={{options.formMetaData.name}}><edu-field options=field form-value=result[field.key||$index] class=formly-field form-id={{options.formMetaData.id}} form-name={{optionx.formMetaData.name}} index={{$index}}></edu-field></ng-form></div></tab></tabset><div ng-if=!options.formMetaData.tabsShow ng-repeat="tab in options.formFields.tabs"><edu-field ng-repeat="field in tab.fields" options=field form-value=result[field.key||$index] class=formly-field form-id={{options.formMetaData.id}} form-name={{options.formMetaData.name}} index={{$index}}></edu-field></div><div class="well form-actions col-md-12"><div class=col-md-offset-2><button ng-click=save() ng-disabled="{{options.formMetaData.name+\'.$invalid\'}}" class="btn btn-primary">Guardar</button> <button ng-click=cancel() class=btn>Cancelar</button></div></div></form>');
  }
]);