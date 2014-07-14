// Main eduCrud Module
//Declare app level module which depends on filters, and services
var eduCrudServices = angular.module('edu-crud.services', []);
var eduCrudDirectives = angular.module('edu-crud.directives', []);
var eduCrudFilters = angular.module('edu-crud.filters', []);
var eduCrudTpl = angular.module('edu-crud.tpl', []);
// initialization of services into the main module
angular.module('eduCrud', [
  'edu-crud.services',
  'edu-crud.directives',
  'edu-crud.filters',
  'edu-crud.tpl',
  'ngResource',
  'ui.bootstrap',
  'eduField',
  'eduForm',
  'eduGrid'
]);
eduCrudServices.factory('dataFactory', [
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
eduCrudDirectives.directive('eduCrud', function () {
  return {
    restrict: 'A',
    replace: true,
    transclude: false,
    scope: {
      ngModel: '=',
      options: '='
    },
    templateUrl: 'directives/edu-crud.tpl.html',
    link: function ($scope, $filter) {
      if (!$scope.hasOwnProperty('options')) {
        throw new Error('options are required!');
      }
      $scope.internalControl = $scope.options.crudControl || {};
      $scope.internalControl.refresh = function () {
        $scope.options.gridControl.refresh();
      };
      $scope.internalControl.showOverlayLoading = function (bShow) {
        $scope.options.gridControl.showOverlayLoading(bShow);
      };
      $scope.internalControl.showOverlayFormDelete = function (bShow) {
        $scope.options.showOverlayCrudFormDelete = bShow;
      };
      $scope.internalControl.showOverlayFormUser = function (bShow) {
        $scope.options.showOverlayFormUser = bShow;
      };
      $scope.internalControl.showButtonsGridUserPre = function (bShow) {
        $scope.options.gridControl.showButtonsUserPre(bShow);
      };
      $scope.internalControl.showButtonsGridUserPost = function (bShow) {
        $scope.options.gridControl.showButtonsUserPost(bShow);
      };
      $scope.internalControl.showButtonsCrudPre = function (bShow) {
        console.log('showButtonsCrudPre' + bShow);
        $scope.options.showButtonsCrudEditPre = bShow;
        $scope.options.showButtonsCrudDeletePre = bShow;
      };
      $scope.internalControl.showButtonsCrudPost = function (bShow) {
        $scope.options.showButtonsCrudEditPost = bShow;
        $scope.options.showButtonsCrudDeletePost = bShow;
      };
      $scope.internalControl.showButtonsCrudEditPre = function (bShow) {
        console.log('showButtonsCrudPre' + bShow);
        $scope.options.showButtonsCrudEditPre = bShow;
      };
      $scope.internalControl.showButtonsCrudEditPost = function (bShow) {
        $scope.options.showButtonsCrudEditPost = bShow;
      };
      $scope.internalControl.showButtonsCrudDeletePre = function (bShow) {
        console.log('showButtonsCrudPre' + bShow);
        $scope.options.showButtonsCrudDeletePre = bShow;
      };
      $scope.internalControl.showButtonsCrudDeletePost = function (bShow) {
        $scope.options.showButtonsCrudDeletePost = bShow;
      };
    },
    controller: [
      '$scope',
      '$log',
      'dataFactory',
      function ($scope, $log, dataFactory) {
        if ($scope.options.hasOwnProperty('showButtonsCrudPre')) {
          $scope.options.showButtonsCrudEditPre = $scope.options.showButtonsCrudPre;
          $scope.options.showButtonsCrudDeletePre = $scope.options.showButtonsCrudPre;
        }
        if ($scope.options.hasOwnProperty('showButtonsCrudPost')) {
          $scope.options.showButtonsCrudEditPost = $scope.options.showButtonsCrudPost;
          $scope.options.showButtonsCrudDeletePost = $scope.options.showButtonsCrudPost;
        }
        if ($scope.options.hasOwnProperty('showAddButtonTopLeft')) {
          $scope.options.showExtraButtonTopLeft = $scope.options.showAddButtonTopLeft;
        }
        if ($scope.options.hasOwnProperty('showAddButtonTopRight')) {
          $scope.options.showExtraButtonTopRight = $scope.options.showAddButtonTopRight;
        }
        if ($scope.options.hasOwnProperty('snippets') && $scope.options.snippets.hasOwnProperty('buttonAdd')) {
          $scope.options.snippets.extraButtonTop = $scope.options.snippets.buttonAdd;
        }
        $scope.options.listListeners.onExtraButtonClick = function () {
          console.log('click extra button:');
          $scope.add();
        };
        $scope.options.crudControl = {};
        $scope.showForm = false;
        $scope.options.buttonsGridUserPre = [];
        $scope.options.buttonsGridUserPost = [];
        $scope.options.showButtonsGridUserPre = true;
        $scope.options.showButtonsGridUserPost = true;
        if ($scope.options.showButtonsUserPre) {
          if ($scope.options.hasOwnProperty('buttonsUserPre')) {
            for (var i = 0; i < $scope.options.buttonsUserPre.length; i++) {
              $scope.options.buttonsGridUserPre.push($scope.options.buttonsUserPre[i]);
            }
          }
        }
        if ($scope.options.showButtonsUserPost) {
          if ($scope.options.hasOwnProperty('buttonsUserPost')) {
            for (var i = 0; i < $scope.options.buttonsUserPost.length; i++) {
              $scope.options.buttonsGridUserPost.push($scope.options.buttonsUserPost[i]);
            }
          }
        }
        if ($scope.options.showButtonsCrudEditPre) {
          $scope.options.buttonsGridUserPre.push({
            label: 'Editar',
            class: '',
            glyphicon: 'edit',
            button: false,
            onclick: function (row) {
              $scope.edit(row);
            }
          });
        }
        ;
        if ($scope.options.showButtonsCrudDeletePre) {
          $scope.options.buttonsGridUserPre.push({
            label: 'Eliminar',
            class: '',
            glyphicon: 'trash',
            button: false,
            onclick: function (row) {
              $scope.selectedRowForDelete = row;
              $scope.keyRowForDelete = $scope.options.fieldKeyLabel + ': ' + row[$scope.options.fieldKey] + '?';
              $scope.options.showOverlayCrudFormDelete = true;
            }
          });
        }
        ;
        if ($scope.options.showButtonsCrudEditPost) {
          $scope.options.buttonsGridUserPost.push({
            label: 'Editar',
            class: '',
            glyphicon: 'edit',
            button: false,
            onclick: function (row) {
              $scope.edit(row);
            }
          });
        }
        if ($scope.options.showButtonsCrudDeletePost) {
          $scope.options.buttonsGridUserPost.push({
            label: 'Eliminar',
            class: '',
            glyphicon: 'trash',
            button: false,
            onclick: function (row) {
              $scope.selectedRowForDelete = row;
              $scope.keyRowForDelete = $scope.options.fieldKeyLabel + ': ' + row[$scope.options.fieldKey] + '?';
              $scope.options.showOverlayCrudFormDelete = true;
            }
          });
        }
        $scope.options.showOverlayLoading = false;
        $scope.startLoading = function () {
          console.log('ovelay on:' + jQuery('#overlayxx').html());
          $scope.options.showOverlayLoading = true;
        };
        $scope.finishLoading = function () {
          console.log('overlay off');
          $scope.options.showOverlayLoading = false;
        };
        $scope.api = null;
        $scope.apiCount = null;
        if (typeof $scope.ngModel === 'undefined' && $scope.options.crudUri !== '') {
          $scope.api = dataFactory($scope.options.crudUri);
          $scope.apiCount = dataFactory($scope.options.crudUriCount);
        }
        ;
        /**
            	 * operation form crud
            	 */
        $scope.options.formListeners = {
          onsave: function (data) {
            console.log('grid form onsave()' + angular.toJson(data));
            $scope.save(data);
          },
          oncancel: function () {
            console.log('grid form oncancel()');
            $scope.cancel();
          }
        };
        $scope.cancel = function () {
          $log.log('click cancel');
          $scope.mode = 'list';
          $scope.showForm = false;
        };
        $scope.edit = function (row) {
          console.log('Edit row:', row);
          var vid = row[$scope.options.fieldKey];
          var oId = {};
          oId[$scope.options.fieldKey] = vid;
          $scope.api.get({ 'id': vid }, function (data) {
            $log.log('homeDataFactory: ' + angular.toJson(data));
            $scope.options.formData = data;
            $scope.options.formFields.tabs[0].active = true;
          });
          $scope.mode = 'edit';
          $scope.showForm = true;
        };
        $scope.save = function (row) {
          if ($scope.mode == 'edit') {
            var vid = row[$scope.options.fieldKey];
            var oId = {};
            oId[$scope.options.fieldKey] = vid;
            $scope.api.update({ 'id': vid }, row, function (data) {
              $log.log('edit dataFactory:' + data.length + ' ' + angular.toJson(data));
            });
          } else if ($scope.mode == 'new') {
            $log.log('click save row:' + angular.toJson(row));
            $scope.api.insert(row, function (data) {
              $log.log('insert dataFactory:' + data.length + ' ' + angular.toJson(data));
            });
          }
          $scope.mode = 'list';
          $scope.options.gridControl.refresh();
          $scope.showForm = false;
        };
        $scope.remove = function (row) {
          var vid = row[$scope.options.fieldKey];
          $log.log('click delete:' + vid);
          var oId = {};
          oId[$scope.options.fieldKey] = vid;
          $scope.api.remove({ 'id': vid }, function (data) {
            $scope.options.gridControl.refresh();
          });
        };
        $scope.add = function () {
          $log.log('click new');
          $scope.mode = 'new';
          $scope.showForm = true;
          for (key in $scope.options.formData) {
            $scope.options.formData[key] = '';
          }
        };
        $scope.options.formData = {};
        $scope.formFieldsError = false;
        $scope.formOptionsError = false;
        $scope.formDeleteContinue = function () {
          $scope.remove($scope.selectedRowForDelete);
          $scope.options.showOverlayCrudFormDelete = false;
        };
        $scope.formDeleteCancel = function () {
          $scope.options.showOverlayCrudFormDelete = false;
        };
      }
    ]
  };
});
angular.module('edu-crud.tpl').run([
  '$templateCache',
  function ($templateCache) {
    'use strict';
    $templateCache.put('directives/edu-crud.tpl.html', '<div><div class=box><div ng-hide=showForm><div class=panel-body><div edu-grid options=options></div></div></div><div ng-show=showForm><div class=panel-heading><div class=row><div class="col-md-11 col-md-offset-1"><h4 class=panel-heading>{{options.heading}}</h4></div></div></div><div class=panel-body><div><div edu-form result=options.formData options=options></div></div></div></div><div name=overlay class="dw-loading dw-loading-overlay dw-loading-active" ng-show=options.showOverlayCrudFormDelete><div class=dw-loading-body><div class=dw-loading-spinner><div class="panel panel-default"><div class=panel-heading><div class=row><div class=col-md-12><h4>{{options.snippets.formDeleteTitle}}</h4></div></div></div><div class=panel-body><h4>{{options.snippets.formDeleteMessage}} {{keyRowForDelete}}</h4></div><div class=panel-footer><div class=row><div class="col-md-offset-6 col-md-6"><button ng-click=formDeleteContinue() class="btn btn-sm btn-primary">{{options.snippets.formDeleteButtonContinue}}</button> <button ng-click=formDeleteCancel() class="btn btn-sm">{{options.snippets.formDeleteButtonCancel}}</button></div></div></div></div></div><div class=dw-loading-text></div></div></div><div name=overlay class="dw-loading dw-loading-overlay dw-loading-active" ng-show=options.showOverlayFormUser><div class=dw-loading-body><div class=dw-loading-spinner><div class="panel panel-default"><form name=formUser novalidate style=width:400px><div class=panel-heading><h4>{{options.snippets.formUserTitle}}</h4></div><div class=panel-body><h4>{{options.snippets.formUserMessage}}</h4><ng-form name=formUser><div ng-repeat="field in options.formUser.fields"><div class="form-group {{field.col}}"><label for={{field.key}} class=ng-binding style=align:left>{{field.label}} {{field.required ? \'*\' : \'\'}}</label><input class=form-control id={{field.key}} name={{field.key}} ng-model=options.formUser.result[field.key] placeholder={{field.placeholder}} ng-required=field.required ng-disabled=field.disabled></div></div></ng-form><div><h5>Nota:</h5><span>{{options.snippets.formUserNota}}</span></div></div><div class=panel-footer><div class=row><div class="col-md-offset-3 col-md-9"><button ng-click=options.formUser.events.continue(selectedRow) ng-disabled=formUser.$invalid class="btn btn-sm btn-primary">{{options.snippets.formUserButtonContinue}}</button> <button ng-click=options.formUser.events.cancel() class="btn btn-sm">{{options.snippets.formUserButtonCancel}}</button></div></div></div></form></div></div><div class=dw-loading-text></div></div></div></div></div>');
  }
]);