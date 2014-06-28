define(['app/model'],function(model){

var appView = Backbone.View.extend({


	el: '#mapas',
		
	initialize: function() {
	
		console.log(model);
		      
	},

	advance: function()	{
	//trigger advance cuando selecciona avanzar en HTML
		alert('ADVANCE CALLED...');
		console.log(this.$('#mapas'));
	},
	loadPath:function() {
	//trigger loadPath cuando selecciona cargar recorrido en el HTML
		alert('loadPath CALLED');
		
	},
	
	render: function(points){
	//x cada punto renders x and y en el canvas 
		console.log('render');
		for(i = 0; i < points.length; i++)
		{
			var obj = points.at(i);
			option = document.createElement('option');
		    option.appendChild(document.createTextNode(obj.get('nombre')));
            this.el.appendChild(option);
	  		
			//obtiene modelos
			//imprimo un modelo, lo bueno q genera ya a partir del json
			console.log(obj);
		//	console.log(obj.get('nombre'));
		//	console.log(obj.get('recorrido'));
			
			
		}
    }
    
 });
 	view = new appView();
 	return view;
 });