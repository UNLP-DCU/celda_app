define(['app/view'],function(view){

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
	

//colección de puntos json, recorrido, una colección de puntos en json...
var Points = Backbone.Collection.extend({
	model: recorridoModel,
	url: 'js/init.json',
	initialize: function(){
		
}});
		 
 puntos = new Points();

 puntos.fetch().done(function(){
 	view.render(puntos);
 })



});


//Hay que corregir, para que de aca se invoque a la vista con
// la coleccion...