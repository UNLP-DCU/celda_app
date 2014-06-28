define(['app/model'],function(model){

var appView = Backbone.View.extend({

	tagName:'select',
		
	initialize: function() {
	
		console.log('init view with select');
		option = document.createElement('option');
		option.appendChild(document.createTextNode('jj'));
        this.el.appendChild(option);
	},

	render: function(points){
	//x cada punto renders x and y en el canvas 
		console.log('render');
		for(i = 0; i < points.length; i++)
		{
			var obj = points.at(i);
			//obtiene modelos
			console.log(obj.get('nombre'));
			console.log(obj.get('recorrido'));
			//populate select
		}
    }
 });

 view = new appView();
 console.log("MODELO "+this.model);
 return view;


 
});