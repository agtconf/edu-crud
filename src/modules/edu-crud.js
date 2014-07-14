// Main eduCrud Module

//Declare app level module which depends on filters, and services
var eduCrudServices = angular.module('edu-crud.services', []);
var eduCrudDirectives = angular.module('edu-crud.directives', []);
var eduCrudFilters = angular.module('edu-crud.filters', []);
var eduCrudTpl=angular.module('edu-crud.tpl',[]);
// initialization of services into the main module
angular.module('eduCrud', ['edu-crud.services', 'edu-crud.directives', 'edu-crud.filters','edu-crud.tpl','ngResource','ui.bootstrap','eduField','eduForm','eduGrid']);