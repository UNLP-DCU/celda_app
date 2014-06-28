require(['app/model','app/view'],function(model,view){
   
 
 var App = {
 	//start init app
 	start: function() {
 		//alert('Hello world!');
 	   var c = canvas.getContext('2d');
 	   for (i=0; i<250; i++){
	     for (j=0; j<250; j++){
		//esto genera solo el contorno del rectángulo
	    	c.strokeRect(j*50,i*50,50,50);
	     }
      }	
 	}
 } 
 
 App.start();
   	
});
  
