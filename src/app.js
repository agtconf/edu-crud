'use strict';
// Angular Init
var app = angular.module('app', [
	'eduCrud'
]);

app.controller('appController', ['$scope','$http','dataFactory', function ($scope,$http,dataFactory) {

     

     $scope.field={key: 'vcodcen',type: 'date',col:'col-md-6',label: 'Código',placeholder: 'Denominación',autofocus:'',required: true }
										
	
	
	
	$scope.ciudades=[
																							{   value:'ABANILLA',
																								name: 'Abanilla2'
							
																							}, {
																								value:'MURCIA',
																								name: 'Murcia2'
							
																							}, {
																								value:'ABARÁN',
																								name: 'Abarán2'
																							}
				];
				
	$scope.municipios=[
{
	"value":"ABANILLA",
	"name": "Abanilla",
	"group":"grupo1x"	
},{
	"value":"ABARAN",
	"name": "Abarán2",
	"group":"grupo1x"	
},{
	"value":"MURCIA",
	"name": "Murcia",
	"group":"grupo1x"	
},{
	"value":"CARTAGENA",
	"name": "Cartagena",
	"group":"grupo1x"	
},{
	"value":"ALCANTARILLA",
	"name": "Alcantarilla",
	"group":"grupo2x"	
},
{
	"value":"ABUDEITE",
	"name": "Albudeite",
	"group":"grupo2x"	
}
]			
				
	$scope.userFieldsFormCrud=[	  
					{key: 'campo1',type: 'text',min:100,max:20000,col:'col-md-6',label: 'Código',placeholder: 'Código',autofocus:'autofocus',required: true },
					{key: 'campo2',type: 'text',min:100,max:20000,col:'col-md-6',label: 'Código',placeholder: 'Código',autofocus:'autofocus',required: true },
					{key: 'campo3',type: 'text',min:100,max:20000,col:'col-md-12',label: 'Código',placeholder: 'Código',autofocus:'autofocus',required: true }
				];
  $scope.avancedSearchFieldsFormGrid=[	  
			        {key: 'fecha_ini',type: 'date',col:'col-md-6',label: 'Fecha inicio',placeholder: 'Fecha inicio',autofocus:'',required: false },
					{key: 'fecha_fin',type: 'date',col:'col-md-6',label: 'Fecha fin',placeholder: 'Fecha fin',autofocus:'',required: false },
					{key: 'tipo',type: 'text',col:'col-md-12',label: 'Tipo',placeholder: 'Tipo',autofocus:'',required: false }
				];

	$scope.options = {
		heading: 'Demo eduCrud',
		showOverlayGridLoading:false,
		showOvelayGridFormDelete:false,
		showRefreshButton: true,
		showAddButtonTopLeft:true,
		
		showPagination: true,
		showItemsPerPage: true,
		showSearch: true,
		showAvancedSearch:true,
		showFiltersColumns:true,
		showMetaData: true,
		paginationWidth: 3,
		
		/*showButtonsCrudEditPre:true,
		showButtonsCrudDeletePre:true,
		
		showButtonsCrudEditPost:true,
		showButtonsCrudDeletePost:true,
		*/
		
		
		showButtonsCrudPre:true,
		showButtonsUserPre:false,
		showButtonsCrudPost:true,
		showButtonsUserPost:true,
		
		
		
		showRowNumber:true,
		showSelectColumn:true,
		crudUri:'api/v1/centros/:id',
		crudUriCount:'api/v1/centros/count',
		fkField:'codigo',
		fkValue:'30000018',
		fieldKey:'vcodcen',
		fieldKeyLabel:'código',
		gridHeight:300,
		control:{},
		listFields: [
				{label: 'Código', column: 'vcodcen', weight: '10',type:'text'},
				{label: 'Denominación', column: 'vdencen', weight: '30',type:'text'},
				{label: 'Domicilio', column: 'vdomcen', weight: '20',type:'text'},
				{label: 'Localidad', column: 'vloccen', weight: '10',type:'text'},
				{label: 'Municipio', column: 'vmuncen', weight: '10',type:'text'}
			],
		metaData:{
			limit:5,

			orderBy:'vcodcen',
			order:'asc'
		},
		listListeners: {
			onrowclick:function(row){
				console.log('click row:'+angular.toJson(row));
			}
		},
		
	formMetaData:{
		tabsShow:true,
		name:"myFormName",
		id:"myFormId"
	},
	formFields:{
				tabs:[ 
							{ tabname:"Pestaña 1",
							   fields:[	  
									//{key: 'vcodcen',type: 'text',min:2,max:20,col:'col-md-6',label: 'Código',placeholder: 'Código',autofocus:'autofocus',required: false }, 
										  {key: 'vcodcen',type: 'text',col:'col-md-6',label: 'Código',placeholder: 'Denominación',autofocus:'false',required: true },
										 
										  {key: 'vdencen',type: 'text',col:'col-md-6',label: 'Denominación',placeholder: 'Denominación',autofocus:'',required: true },
										   {key: 'vdomcen',type: 'text',col:'col-md-12',lines: 5,label:'Domicilio',placeholder: 'Domicilio',autofocus:'',required: true}, 
										  //{key: 'fecha',type: 'date',col:'col-md-12',label:'Fecha',placeholder: 'fecha',autofocus:'',required: true,disabled:false},
										  
										]
							},
							{ tabname:"Pestaña 2",
								fields:[	 
									//{key: 'vmuncen',type: 'autocomplete',col:'col-md-2',label: 'Municipio autocomp local',autoclocaldata:$scope.municipios,autocurldata: 'api/v1/municipios?filter=',autocsearchfields:"name",autocminlength:3,autocfieldtitle:"name,group",autocfielddescription:"",autocfieldvalue:"value",autocpause:300},
									{key: 'vmuncen',type: 'autocomplete',col:'col-md-2',label: 'Municipio autocomp remote',autocurldata: 'api/v1/municipios?filter=',autocsearchfields:"name",autocminlength:3,autocfieldtitle:"name,group",autocfielddescription:"",autocfieldvalue:"value",autocpause:300},
																   
								//{key: 'vmuncen',type: 'select',label: 'Municipio',selecttypesource:'array',selectsource: $scope.ciudades,optionname:"name",optionvalue:"value",selectconcatvaluename:true},
									//{key: 'vmuncen',type: 'select',label: 'Municipio',selecttypesource:'url',selectsource: 'json/ciudades.json',optionname:"namexxxx",optionvalue:"valuex",selectconcatvaluename:true},
									{key: 'vloccen',type: 'textarea',col:'col-md-12',rows: 15,label: 'Localidad',placeholder: 'Localidad',autofocus:'',required: true	}
								]
							}
						]
		},

		buttonsUserPre: [
					{label: 'Ejecutar', class: '', glyphicon: 'flash', button: false, onclick: function (row) {
						console.log('ejecutar consulta:', row);
					}}
				
				],
		buttonsUserPost: [
					{label: 'Ejecutar', class: '', glyphicon: 'flash', button: false, onclick: function (row) {
						console.log('ejecutar consulta:', row);
					}}
				],
		formUser:{
			fields:$scope.userFieldsFormCrud,
			events:{
					continue: function () {
						console.log('form User continue button:');
						$scope.options.showOverlayFormUser=false
					},
					cancel: function () {
						console.log('form User cancel button');
						$scope.options.showOverlayFormUser=false
					}
				},
			result:{}
		},
		formGridAvancedSearch:{
			fields:$scope.avancedSearchFieldsFormGrid
		},
		snippets: {
			showingItems: 'Filas',
			of: 'de',
			itemsPerPage: 'Filas por página:',
			search: 'Buscar:',
			avancedSearch:'Avanz.',
			buttonAdd: 'Nuevo',
			buttonChangeItemsPerPage: 'Filas por página',
			buttonSearch: 'Buscar',
			
			formGridAvancedSearchMessage:'mensage',
			formGridAvancedSearchTitle:'Búsqueda Avanzada',
			formGridAvancedSearchNota:'Nota: esto es una nota',
			formGridAvancedSearchButtonCancel:'Cancelar',
			formGridAvancedSearchButtonContinue:'Continuar',
			
			formDeleteMessage:'¿Está seguro que quiere ELIMINAR el registro',
			formDeleteTitle:'Por favor confirme',
			formDeleteButtonCancel:'Cancelar',
			formDeleteButtonContinue:'Continuar',
			
			formUserMessage:'Esto es un mensaje',
			formUserNota:'Esto es una nota',
			formUserTitle:'Párametros de la consulta',
			formUserButtonCancel:'Cancelar',
			formUserButtonContinue:'Continuar'
		}
	};
}])

