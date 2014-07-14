// Main eduCrud Module
//Declare app level module which depends on filters, and services
var eduGridServices = angular.module('edu-grid.services', []);
var eduGridDirectives = angular.module('edu-grid.directives', []);
var eduGridFilters = angular.module('edu-grid.filters', []);
var eduGridTpl = angular.module('edu-grid.tpl', []);
// initialization of services into the main module
angular.module('eduGrid', [
  'edu-grid.services',
  'edu-grid.directives',
  'edu-grid.filters',
  'edu-grid.tpl',
  'ngResource',
  'ui.bootstrap'
]);
eduGridServices.factory('dataFactory', [
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
eduGridDirectives.directive('eduGrid', function () {
  return {
    restrict: 'A',
    replace: true,
    transclude: false,
    scope: { options: '=' },
    templateUrl: 'directives/edu-grid.tpl.html',
    link: function ($scope, $filter) {
      if (!$scope.hasOwnProperty('options')) {
        throw new Error('\xa1Las optiones son obligatorias!');
      }
      $scope.internalControl = $scope.options.gridControl || {};
      $scope.internalControl.refresh = function () {
        $scope.refresh();
      };
      $scope.internalControl.showOverlayLoading = function (bShow) {
        $scope.options.showOverlayGridLoading = bShow;
      };
      $scope.internalControl.showOverlayFormUser = function (bShow) {
        $scope.options.showOverlayGridFormUser = bShow;
      };
      $scope.internalControl.showButtonsUserPre = function (bShow) {
        $scope.options.showButtonsGridUserPre = bShow;
      };
      $scope.internalControl.showButtonsUserPost = function (bShow) {
        $scope.options.showButtonsGridUserPost = bShow;
      };
      /**
                 * Prepare fields
                 */
      for (var fieldKey in $scope.options.listFields) {
        $scope.options.listFields.sorting = '';
        if (typeof $scope.options.listFields[fieldKey].renderer !== 'function') {
          $scope.options.listFields[fieldKey].orderByValue = $scope.options.listFields[fieldKey].column;
          $scope.options.listFields[fieldKey].renderer = function (input, row, column, type) {
            return input;
          };
        }
      }
      /**
                 * Enable design-elements
                 */
      $scope.showHeadingBar = $scope.options.heading || $scope.showMetaData || $scope.showRefreshButton;
      $scope.showFooterBar = $scope.options.showPagination || $scope.options.showItemsPerPage || $scope.options.showSearch;
      /**
                 * Calculate pagination
                 */
      $scope.currentPage = undefined;
      $scope.$watchCollection('ngModel', function () {
        console.log('changeNgModel ' + $scope.ngModel);
        if (typeof $scope.ngModel !== 'undefined') {
          /**
	                     * Extract list
	                     */
          if ($scope.ngModel.hasOwnProperty('data')) {
            $scope.list = $scope.ngModel.data;
          } else {
            $scope.list = $scope.ngModel;
          }
          /**
	                     * Extract meta data
	                     */
          if ($scope.ngModel.hasOwnProperty('metaData')) {
            $scope.options.metaData = $scope.ngModel.metaData;
          }
          if ($scope.list === undefined) {
            throw new Error('No data provided');
          }
          if ($scope.options.metaData === undefined) {
            throw new Error('No meta data provided');
          }
          $scope.itemPerPageNumber = $scope.options.metaData.limit || 0;
        }
      });
    },
    controller: [
      '$scope',
      '$log',
      'dataFactory',
      function ($scope, $log, dataFactory) {
        $scope.options.selectionRows = [];
        $scope.options.formGridAvancedSearchResult = {};
        $scope.showOverlayGridFormSearch = false;
        $scope.options.gridControl = {};
        $scope.options.metaData.offset = 0;
        //adjust column order
        for (var field in $scope.options.listFields) {
          if ($scope.options.listFields[field].column.toUpperCase() == $scope.options.metaData.orderBy.toUpperCase()) {
            $scope.options.listFields[field].order = $scope.options.metaData.order;
          }
        }
        ;
        $scope.options.showOverlayLoading = false;
        $scope.startLoading = function () {
          $scope.options.showOverlayGridLoading = true;
        };
        $scope.finishLoading = function () {
          console.log('overlay off');
          $scope.options.showOverlayGridLoading = false;
        };
        $scope.gridStyle = {};
        $scope.gridStyle.height = $scope.options.gridHeight + 'px';
        $scope.currentPage = {
          offset: 0,
          label: 1
        };
        $scope.pagination = function () {
          var paginationWidth = $scope.options.paginationWidth || 2;
          var limit = $scope.options.metaData.limit;
          var offset = $scope.options.metaData.offset;
          var total = $scope.options.metaData.total;
          $scope.pages = [];
          if (!(isNaN(limit) || isNaN(offset) || isNaN(total))) {
            var numPages = Math.ceil(total / limit);
            var startPage = Math.floor(offset / limit) - Math.floor(paginationWidth / 2);
            startPage = startPage < 0 ? 0 : startPage;
            var currentPageId = Math.floor(offset / limit);
            for (var i = startPage; i < Math.min(numPages, startPage + paginationWidth); i++) {
              var newPage = {
                  label: i + 1,
                  offset: (i + 0) * limit
                };
              if (i === currentPageId) {
                $scope.currentPage = newPage;
              }
              $scope.pages.push(newPage);
            }
          }
        };
        $scope.api = null;
        $scope.apiCount = null;
        if (typeof $scope.ngModel === 'undefined' && $scope.options.crudUri !== '') {
          $scope.api = dataFactory($scope.options.crudUri);
          $scope.apiCount = dataFactory($scope.options.crudUriCount);
        }
        ;
        $scope.handleButtonClick = function (callback, entry) {
          $scope.selectedRow = entry;
          if (typeof callback === 'function') {
            callback(entry);
          }
        };
        $scope.handleCheckClick = function (callback, entry) {
          $scope.selectedRow = entry;
          if (typeof callback === 'function') {
            callback(entry);
          }
        };
        $scope.onRowClick = function (clickedEntry) {
          if (!$scope.options.hasOwnProperty('listListeners') || typeof $scope.options.listListeners.onRowClick !== 'function')
            return;
          $scope.options.listListeners.onRowClick(clickedEntry);
        };
        /**
				*  Pagination
				*/
        $scope.setPage = function (page) {
          $log.log('setPage:' + angular.toJson(page));
          $scope.options.metaData.offset = page.offset;
          $scope.pagination();
          $scope.refresh();
        };
        $scope.setFirstPage = function () {
          if ($scope.options.metaData === undefined)
            return;
          $scope.options.metaData.offset = 0;
          $scope.pagination();
          $scope.refresh();
        };
        $scope.setPreviousPage = function () {
          if ($scope.options.metaData === undefined)
            return;
          var currentOffset = $scope.currentPage.offset;
          $scope.options.metaData.offset = $scope.currentPage.offset - $scope.options.metaData.limit;
          $scope.pagination();
          $scope.refresh();
        };
        $scope.setNextPage = function () {
          if ($scope.options.metaData === undefined)
            return;
          var currentOffset = $scope.currentPage.offset;
          $scope.options.metaData.offset = $scope.currentPage.offset + $scope.options.metaData.limit;
          $scope.pagination();
          $scope.refresh();
        };
        $scope.setLastPage = function () {
          $log.log('setLastPage');
          if ($scope.options.metaData === undefined)
            return;
          var numPages = Math.ceil($scope.options.metaData.total / $scope.options.metaData.limit);
          $scope.options.metaData.offset = numPages * $scope.options.metaData.limit - $scope.options.metaData.limit;
          $scope.pagination();
          $scope.refresh();
        };
        $scope.isOnFirstPage = function () {
          if ($scope.options.metaData === undefined)
            return;
          return $scope.options.metaData.offset == 0;
        };
        $scope.isOnLastPage = function () {
          if ($scope.options.metaData === undefined)
            return;
          var numPages = Math.ceil($scope.options.metaData.total / $scope.options.metaData.limit);
          return $scope.options.metaData.offset == numPages * $scope.options.metaData.limit - $scope.options.metaData.limit;
        };
        /**
                 * getData
                 */
        $scope.getData = function () {
          var oParams = {};
          if (typeof $scope.options.metaData.limit !== 'undefined' && typeof $scope.options.metaData.offset !== 'undefined') {
            oParams.limit = $scope.options.metaData.limit;
            oParams.filter = $scope.searchQuery;
            oParams.offset = $scope.options.metaData.offset;
            oParams.orderby = $scope.options.metaData.orderBy;
            oParams.order = $scope.options.metaData.order;
          }
          ;
          if ($scope.options.hasOwnProperty('formGridAvancedSearch') && typeof $scope.options.formGridAvancedSearchResult != 'undefined') {
            for (var key in $scope.options.formGridAvancedSearchResult) {
              oParams[key] = $scope.options.formGridAvancedSearchResult[key];
            }
            $scope.options.formGridAvancedSearchResult = {};
            console.log('Avanced Search getData oParams:' + angular.toJson(oParams));
          }
          if ($scope.options.hasOwnProperty('fkField') && typeof $scope.options.fkField != 'undefined') {
            oParams['fkfield'] = $scope.options.fkField;
            oParams['fkvalue'] = $scope.options.fkValue;
            console.log('Avanced Search getData oParams:' + angular.toJson(oParams));
          }
          $scope.api.getAll(oParams, function (data) {
            $scope.list = data;
            for (var i = 0; i < $scope.list.length; i++) {
              var bExists = false;
              for (var j = 0; j < $scope.options.selectionRows.length; j++) {
                //console.log("getData:"+$scope.options.selectionRows[j] + " == " +$scope.list[i][$scope.options.fieldKey])
                if ($scope.options.selectionRows[j] == $scope.list[i][$scope.options.fieldKey]) {
                  $scope.list[i].selected = true;
                  bExists = true;
                  break;
                }
              }
              if (!bExists) {
                $scope.list[i].selected = false;
              }
            }
            $scope.pagination();
            $scope.finishLoading();
          });
        };
        $scope.refresh = function () {
          var oParams = {};
          typeof $scope.searchQuery === 'undefined' ? oParams.filter = '' : oParams.filter = $scope.searchQuery;
          $scope.startLoading();
          $scope.apiCount.getCount(oParams, function (data) {
            $scope.options.metaData.total = data.count;
            $scope.getData();
          });
          if ($scope.options.hasOwnProperty('listListeners') && typeof $scope.options.listListeners.onButtonRefreshClick == 'function') {
            $scope.options.listListeners.onButtonRefreshClick($scope.list);
          }
        };
        setTimeout(function () {
          $scope.refresh();
        }, 500);
        /**
                 * On click extra button
                 */
        $scope.clickExtraButton = function (value) {
          if ($scope.options.hasOwnProperty('listListeners') && typeof $scope.options.listListeners.onExtraButtonClick == 'function') {
            $scope.options.listListeners.onExtraButtonClick();
          }
        };
        /**
                 * On click select all rows checkbox
                 */
        $scope.changeSelectAllRows = function (value) {
          //console.log("checkSelectAllValue:"+value);
          if (value) {
            for (var i = 0; i < $scope.list.length; i++) {
              $scope.list[i].selected = true;
            }
          } else {
            for (var i = 0; i < $scope.list.length; i++) {
              $scope.list[i].selected = false;
            }
          }
        };
        /**
                 * On click select row checkbox
                 */
        $scope.checkSelectRow = function (row) {
          if (!row.selected) {
            var bExists = false;
            for (var i = 0; i < $scope.options.selectionRows.length; i++) {
              if ($scope.options.selectionRows[i] == row[$scope.options.fieldKey]) {
                bExists = true;
                break;
              }
            }
            if (!bExists) {
              $scope.options.selectionRows.push(row[$scope.options.fieldKey]);
            }  //console.log("selectionRows selected:"+angular.toJson($scope.options.selectionRows));
          } else {
            for (var i = 0; i < $scope.options.selectionRows.length; i++) {
              if ($scope.options.selectionRows[i] == row[$scope.options.fieldKey]) {
                $scope.options.selectionRows.splice(i, 1);
                break;
              }
            }  //console.log("selectionRows unselected:"+angular.toJson($scope.options.selectionRows));
          }  //console.log("checkSelectRow:"+row[$scope.options.fieldKey]+ " " + row.selected);
        };
        /**
                 * On Order change
                 */
        $scope.changeOrder = function (field, orderBy, order) {
          console.log('changeOrder:' + orderBy + ' order:' + order);
          $scope.options.metaData.orderBy = orderBy;
          $scope.options.metaData.order = order.toUpperCase();
          $scope.refresh();
          for (var fieldKey in $scope.options.listFields) {
            if ($scope.options.listFields[fieldKey] === field)
              continue;
            $scope.options.listFields[fieldKey].order = '';
          }
          field.order = order;
        };
        /**
                * On change items per page
                */
        var timerOnChangeItemsPerPage = null;
        $scope.onChangeItemsPerPage = function () {
          console.log('onChangeItemsPerPage');
          clearInterval(timerOnChangeItemsPerPage);
          timerOnChangeItemsPerPage = setInterval(function () {
            $scope.refresh();
            clearInterval(timerOnChangeItemsPerPage);
          }, 750);
        };
        /**
                 * On search
                 */
        var timerOnChangeSearchQuery = null;
        $scope.onChangeSearchQuery = function () {
          console.log('onChangeSearchQuery');
          clearInterval(timerOnChangeSearchQuery);
          timerOnChangeSearchQuery = setInterval(function () {
            $scope.refresh();
            clearInterval(timerOnChangeSearchQuery);
          }, 750);
        };
        /**
                 * On avancedSearch
                 */
        $scope.onClickAvancedSearch = function () {
          $scope.showOverlayGridFormAvancedSearch = !$scope.showOverlayGridFormAvancedSearch;
          console.log('onClickAvancedSearch');
        };
        /**
                 * On continue button form avanced search
                 */
        $scope.formGridAvancedSearchEventsContinue = function () {
          console.log('form AvancedSearch continue button result:' + angular.toJson($scope.options.formGridAvancedSearchResult));
          $scope.refresh();
          $scope.showOverlayGridFormAvancedSearch = false;
        };
        /**
                 * On cancel button form avanced search
                 */
        $scope.formGridAvancedSearchEventsCancel = function () {
          console.log('form AvancedSearch cancel button');
          $scope.options.formGridAvancedSearchResult = {};
          $scope.showOverlayGridFormAvancedSearch = false;
        };
      }
    ]
  };
});
angular.module('edu-grid.tpl').run([
  '$templateCache',
  function ($templateCache) {
    'use strict';
    $templateCache.put('directives/edu-grid.tpl.html', '<div><div class=box><div class="panel panel-default"><div class=panel-heading ng-show=showHeadingBar style=heigth:30px><div class=row><div class=col-md-1><a href="" class="btn btn-primary" ng-show=options.showExtraButtonTopLeft ng-click=clickExtraButton()><span class="glyphicon glyphicon-plus-sign"></span> {{options.snippets.extraButtonTop}}</a></div><div class=col-md-7><h4 class=panel-heading>{{options.heading}}</h4></div><div class=col-md-3><span ng-show=options.showMetaData>{{options.snippets.showingItems}} {{options.metaData.offset+1}} - {{(options.metaData.offset+options.metaData.limit > options.metaData.total) ? (options.metaData.total) : (options.metaData.offset + options.metaData.limit)}} {{options.snippets.of || \'/\'}} {{options.metaData.total}}</span></div><div class=col-md-1><a class="glyphicon glyphicon-refresh btn" ng-show=options.showRefreshButton ng-click=refresh()></a> <a href="" class="btn btn-primary" ng-show=options.showExtraButtonTopRight ng-click=clickExtraButton()><span class="glyphicon glyphicon-plus-sign"></span> {{options.snippets.extraButtonTop}}</a></div></div></div><div class=panel-body><div ng-style=gridStyle style=overflow:auto class=panel><table class="table table-condensed table-hover table-striped"><thead><tr><th ng-if=options.showRowNumber></th><th ng-if=options.showButtonsGridUserPre ng-repeat="button in options.buttonsGridUserPre"></th><th ng-if=options.showSelectColumn></th><th ng-repeat="field in options.listFields" width={{field.weight}}%><span ng-show="field.order==\'asc\'"><i class="glyphicon glyphicon-sort-by-alphabet"></i> <a ng-click="changeOrder(field, field.orderByValue, \'desc\')">{{field.label}}</a></span> <span ng-show="field.order==\'desc\'"><i class="glyphicon glyphicon-sort-by-alphabet-alt"></i> <a ng-click="changeOrder(field, field.orderByValue, \'asc\')">{{field.label}}</a></span> <span ng-hide="field.order.length>0"><a ng-click="changeOrder(field, field.orderByValue, \'desc\')">{{field.label}}</a></span></th><th ng-if=options.showButtonsGridUserPost ng-repeat="button in options.buttonsGridUserPost"></th></tr></thead><tbody><tr ng-show="list.length < 1"><td colspan={{options.listFields.length+options.buttons.length}}><span class="glyphicon glyphicon-info-sign"></span> <span>{{options.snippets.emptyGridText || \'No hay datos\'}}</span></td></tr><tr ng-repeat="entry in list" ng-click=onRowClick(entry)><td ng-if=options.showRowNumber><button type=button class="btn btn-primary">{{options.metaData.offset+1+$index}}</button></td><td ng-if=options.showButtonsGridUserPre ng-repeat="button in options.buttonsGridUserPre"><div ng-if=!button.button><div ng-if="button.glyphicon.length>0"><a class=btn ng-click="handleButtonClick(button.onclick, entry)" ng-disabled=button.disabled(entry)><i class="glyphicon glyphicon-{{button.glyphicon}}" title={{button.label}}></i></a></div><div ng-if="button.iconPath.length>0"><img ng-src=button.iconPath alt={{button.label}}></div></div><button ng-if=button.button ng-click="handleButtonClick(button.onclick, entry)" ng-disabled=button.disabled(entry)><i ng-if="button.glyphicon.length>0" class="glyphicon glyphicon-{{button.glyphicon}}" title={{button.label}}></i> <img ng-if="button.iconPath.length>0" ng-src=button.iconPath alt={{button.label}}>{{button.label}}</button></td><td ng-if=options.showSelectColumn><input type=checkbox ng-click=checkSelectRow(entry) ng-model=entry.selected></td><td ng-repeat="field in options.listFields" ng-click=onRowClick()><div ng-if="field.type!=\'date\' && field.type!=\'date-time\'">{{field.renderer(entry[field.column], entry, field.column,field.type)}}</div><div ng-if="field.type==\'date\'">{{entry[field.column] | date:\'dd-MM-yyyy\'}}</div></td><td ng-if=options.showButtonsGridUserPost ng-repeat="button in options.buttonsGridUserPost"><div ng-if=!button.button><div ng-if="button.glyphicon.length>0"><a class=btn ng-click="handleButtonClick(button.onclick, entry)" ng-disabled=button.disabled(entry)><i class="glyphicon glyphicon-{{button.glyphicon}}" title={{button.label}}></i></a></div><div ng-if="button.iconPath.length>0"><img ng-src=button.iconPath alt={{button.label}}></div></div><button ng-if=button.button ng-click="handleButtonClick(button.onclick, entry)" ng-disabled=button.disabled(entry)><i ng-if="button.glyphicon.length>0" class="glyphicon glyphicon-{{button.glyphicon}}" title={{button.label}}></i> <img ng-if="button.iconPath.length>0" ng-src=button.iconPath alt={{button.label}}>{{button.label}}</button></td></tr></tbody></table></div></div><div class=panel-footer ng-show=showFooterBar><div class=row><div class=col-md-5><ul ng-show=options.showPagination class="pagination pagination col" style="margin: 0px 0px; font-weight: bold"><li ng-class="{\'disabled\':isOnFirstPage()}"><span ng-show=isOnFirstPage() class="glyphicon glyphicon-step-backward"></span> <a ng-show=!isOnFirstPage() class="glyphicon glyphicon-step-backward" ng-click=setFirstPage()></a></li><li ng-class="{\'disabled\':isOnFirstPage()}"><span ng-show=isOnFirstPage() class="glyphicon glyphicon-fast-backward"></span> <a ng-show=!isOnFirstPage() class="glyphicon glyphicon-backward" ng-click=setPreviousPage()></a></li><li data-ng-repeat="page in pages" ng-class="{\'disabled\':currentPage.label == page.label}"><a ng-show="currentPage.label != page.label" ng-click=setPage(page)>{{page.label}}</a> <span ng-show="currentPage.label == page.label">{{page.label}}</span></li><li ng-class="{\'disabled\':isOnLastPage()}"><span ng-show=isOnLastPage() class="glyphicon glyphicon-fast-forward"></span> <a ng-show=!isOnLastPage() class="glyphicon glyphicon-forward" ng-click=setNextPage()></a></li><li ng-class="{\'disabled\':isOnLastPage()}"><span ng-show=isOnLastPage() class="glyphicon glyphicon-step-forward"></span> <a ng-show=!isOnLastPage() class="glyphicon glyphicon-step-forward" ng-click=setLastPage()></a></li></ul></div><div class=col-md-3><div ng-show=options.showItemsPerPage><label for=ag_itemsperpage>{{options.snippets.itemsPerPage || \'Items por p\xe1gina:\'}}</label><input id=ag_itemsperpage class=form-inline type=number ng-model=options.metaData.limit ng-change=onChangeItemsPerPage() style="width: 50px"> <a class="glyphicon glyphicon-list-alt"></a></div></div><div class=col-md-3 ng-show=options.showSearch><div><label for=ag_search>{{options.snippets.search || \'Buscar:\'}}</label><input class=form-inline ng-model=searchQuery ng-change=onChangeSearchQuery()> <a class="glyphicon glyphicon-search"></a></div></div><div class=col-md-1 ng-show=options.showAvancedSearch><div><a class="glyphicon glyphicon-search btn" ng-click=onClickAvancedSearch()>{{options.snippets.avancedSearch || \'Buscar avanz.:\'}}</a></div></div></div></div></div><div name=overlay class="dw-loading dw-loading-overlay dw-loading-active" ng-show=options.showOverlayGridLoading><div class=dw-loading-body><div class=dw-loading-spinner><div class=dw-spinner style="position: relative; width: 0px; z-index: 2000000000; left: 26px; top: 0px" role=progressbar><img name="" ng-show=true alt="" src="data:image/gif;base64,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"></div></div><div class=dw-loading-text></div></div></div><div name=overlay class="dw-loading dw-loading-overlay dw-loading-active" ng-show=showOverlayGridFormAvancedSearch><div class=dw-loading-body><div class=dw-loading-spinner><div class="panel panel-default"><form name=formGridAvancedSearch novalidate style=width:400px><div class=panel-heading><h4>{{options.snippets.formGridAvancedSearchTitle}}</h4></div><div class=panel-body><h4>{{options.snippets.formGridAvancedSearchMessage}}</h4><ng-form name=formGridAvancedSearch><div ng-repeat="field in options.formGridAvancedSearch.fields"><div class="form-group {{field.col}}"><label for={{field.key}} class=ng-binding style=align:left>{{field.label}} {{field.required ? \'*\' : \'\'}}</label><input type={{field.type}} class=form-control id={{field.key}} name={{field.key}} ng-model=options.formGridAvancedSearchResult[field.key] placeholder={{field.placeholder}} ng-required=field.required ng-disabled=field.disabled></div></div></ng-form><div><h5>{{options.snippets.formGridAvancedSearchNota}}</h5></div></div><div class=panel-footer><div class=row><div class="col-md-offset-3 col-md-9"><button ng-click=formGridAvancedSearchEventsContinue() ng-disabled=formGridAvancedSearch.$invalid class="btn btn-sm btn-primary">{{options.snippets.formGridAvancedSearchButtonContinue || \'Continuar\'}}</button> <button ng-click=formGridAvancedSearchEventsCancel() class="btn btn-sm">{{options.snippets.formGridAvancedSearchButtonCancel || \'Cancelar\'}}</button></div></div></div></form></div></div><div class=dw-loading-text></div></div></div><div name=overlay class="dw-loading dw-loading-overlay dw-loading-active" ng-show=options.showOverlayGridFormUser><div class=dw-loading-body><div class=dw-loading-spinner><div class="panel panel-default"><form name=formUser novalidate style=width:400px><div class=panel-heading><h4>{{options.snippets.formGridUserTitle}}</h4></div><div class=panel-body><h4>{{options.snippets.formGridUserMessage}}</h4><ng-form name=formUser><div ng-repeat="field in options.formGridUser.fields"><div class="form-group {{field.col}}"><label for={{field.key}} class=ng-binding style=align:left>{{field.label}} {{field.required ? \'*\' : \'\'}}</label><input class=form-control id={{field.key}} name={{field.key}} ng-model=options.formGridUser.result[field.key] placeholder={{field.placeholder}} ng-required=field.required ng-disabled=field.disabled></div></div></ng-form><div><h5>{{options.snippets.formGridUserNota}}</h5></div></div><div class=panel-footer><div class=row><div class="col-md-offset-3 col-md-9"><button ng-click=options.formGridUser.events.continue(selectedRow) ng-disabled=formUser.$invalid class="btn btn-sm btn-primary">{{options.snippets.formGridUserButtonContinue}}</button> <button ng-click=options.formGridUser.events.cancel() class="btn btn-sm">{{options.snippets.formGridUserButtonCancel}}</button></div></div></div></form></div></div><div class=dw-loading-text></div></div></div></div></div>');
  }
]);