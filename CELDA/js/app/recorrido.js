define([],function(){

var recorridoModel = Backbone.Model.extend({
	initialize: function(){
		defaults: {
			nombre = 'Undefined',
			alto = 12,
			ancho = 12,
			recorrido = [],
			obstaculos = [],
			inicio = [],
			fin = [];
		
		}
	}
});
	return new recorridoModel();
});	