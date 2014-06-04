var miCanvas = (function (){

	var contexto,
		elemento,
		funcionDeDibujoPrivada,
		setFullscreenPrivada,
		cargarValoresPrivada,
		pintarPrivada,
		avanzarPivada,
		cargarRecorridoPrivada,
		cargarListaMapasPrivada,
		inicializarPrivada,
		height,
		width,
		avance,
		posicionX,
		posicionY,
		posicion,
	  cuadrado,
		originalBackgroud,
		cuadradoMovil;
	width = 2;
	height = 2;
	avance = [ 1, 7, 6 ];
	posicionX = 1;
	posicionY = 1;
	posicion = 0;
	
	//este seria como el objeto que recorre
	cuadrado = {
		posx : 1,
		posy : 13,
		dimension : 25
	};
	
	inicializarPrivada = function(){
		funcionDeDibujoPrivada();
		cargarListaMapasPrivada();
	}
	
	setFullscreenPrivada = function(){
		var w=window.innerWidth/elemento.width;
    var h=window.innerHeight/elemento.height;
    var scale=Math.min(h,w);
    elemento.style.width=(elemento.width*scale)+'px';
		elemento.style.height=(elemento.height*scale)+'px';
    elemento.style.position='fixed';
    elemento.style.left='50%';
    elemento.style.top='50%';
    elemento.style.marginLeft=-(elemento.width*scale)/2+'px';
    elemento.style.marginTop=-(elemento.height*scale)/2+'px';
  }
	
	
	funcionDeDibujoPrivada = function(){
		elemento = document.getElementById('micanvas');

		//ComprobaciÃ³n sobre si encontramos un elemento
		//y podemos extraer su contexto con getContext(), que indica compatibilidad con canvas
		if (elemento && elemento.getContext) {
			
		  //Accedo al contesxto de '2d' de este canvas, necesario para dibujar
		  contexto = elemento.getContext('2d');
		  //contexto.width = window.innerWidth;
    	//contexto.height = window.innerHeight;
		  if (contexto) {
				setFullscreenPrivada();
			  //Si tengo el contexto 2d es que todo ha ido bien y puedo empezar a dibujar 
			  contexto.strokeStyle = '#000000';
			  pintarPrivada();
			  contexto.fillStyle = "#B00000";
				
				//ESTO POSICIONA EL RECUADO ROJO SEGÃšN DONDE SE DESEA Q SEA EL PUNTO DE INICIO
				//SI O SI DEBE ESTAR SOBRE EL MARGEN IZQUIERDO
				cuadrado.posy = (( posicionY - 1) * 50 ) + cuadrado.posy;
				contexto.fillRect( cuadrado.posx, cuadrado.posy, cuadrado.dimension, cuadrado.dimension );
				
				cuadradoMovil = contexto.getImageData(cuadrado.posx, cuadrado.posy, cuadrado.dimension, cuadrado.dimension); 
				canvas_arrow((posicionX * 50) - 15, (posicionY * 50) - 15, (posicionX * 50) + 15, (posicionY * 50) - 15);
				console.log("adaad");
				switch ( avance [ posicion ] ) {
					case 1: //MOVIMIENTO IZQUIERDA A DERECHA
					case 6: //MOVIMIENTO ARRIBA Y DERECHA 0 ABAJO Y DERECHA
						console.log("A");
						break;
					case 2: //MOVIMIENTO ARRIBA A ABAJO
					case 7: //MOVIMIENTO DERECHA Y ABAJO O IZQUIERDA Y ABAJO
						console.log("B");
						posicionY = posicionY + 2;
						break;
					case 3: //MOVIMIENTO DERECHA A IZQUIERDA
					case 8: //MOVIMIENTO ABAJO Y IZQUIERDA O ARRIBA Y IZQUIERDA
						
						console.log("C");
						posicionX = posicionX - 2;
						break;
					case 4: //MOVIMIENTO ABAJO A ARRIBA
					case 5: //MOVIMIENTO IZQUIERDA Y ARRIBA 0 DERECHA Y ARRIBA
						
						console.log("D");
						posicionY = posicionY - 2;
						break;
				}
		  }
		}
	}
	
	canvas_arrow = 	function(fromx, fromy, tox, toy){
		var headlen = 20;	// length of head in pixels
		var dx = tox-fromx;
		var dy = toy-fromy;
		var angle = Math.atan2(dy,dx);
		contexto.moveTo(fromx, fromy);
		contexto.lineTo(tox, toy);
		contexto.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
		contexto.moveTo(tox, toy);
		contexto.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
		console.log("crea");
	}
	
	cargarListaMapasPrivada = function(){
		$.getJSON('file.json', function(json) {
			var mapas = document.getElementById('mapas');
			for(i = 0;i < json.cantMapas; i++){
				var opcion = document.createElement("option");
			  opcion.text = opcion.value = json.mapas[i].nombre;
			  mapas.add(opcion);
			  console.log("El nombre es: " + json.mapas[i].nombre);
			}
		});
	}	
		
	//GENERA LA MATRIZ DE RECTACGILOS
	pintarPrivada = function(){
		contexto.canvas.width  = width * 50;
		contexto.canvas.height = height * 50;
		for ( i=0; i<height; i++ ){
			for ( j=0; j<width; j++ ){
				if ( i == 0 && j == 0 ){
				
					//en realidad estos valores los debería levantar del json
					contexto.fillStyle = "#00FF00";
					contexto.fillRect( 1, 1, 49, 49 );
				}else{
					if ( i == (height-1) && j == (width - 1)) {
			
						//en realidad estos valores los debería levantar del json
					  contexto.fillStyle = "#FF0000";
						contexto.fillRect( i*50, j*50, 49, 49 );
					}
				}			
				//esto genera solo el contorno del rectÃ¡ngulo
				contexto.strokeRect(j*50,i*50,50,50);
			}
		}
		originalBackgroud	= contexto.getImageData(0, 0, 200, 200);
	}
	
	
	cargarValoresPrivada = function(){
		width = document.getElementById('width').value;
		height = document.getElementById('height').value;
		pintarPrivada();
	}
	
	avanzarPivada = function(){	
		//aqui podrÃ­a tomar los valores del json para saber q tipo de linea tiene q dibujar y el audio a escuchar
		console.log ("x: " + posicionX * 25 + "y: " + posicionY * 25);
		switch ( avance [ posicion ] ) {
			case 1: //MOVIMIENTO IZQUIERDA A DERECHA
			case 6: //MOVIMIENTO ARRIBA Y DERECHA 0 ABAJO Y DERECHA
				console.log("A");
				posicionX = posicionX + 2;
				break;
			case 2: //MOVIMIENTO ARRIBA A ABAJO
			case 7: //MOVIMIENTO DERECHA Y ABAJO O IZQUIERDA Y ABAJO
				console.log("B");
				posicionY = posicionY + 2;
				break;
			case 3: //MOVIMIENTO DERECHA A IZQUIERDA
			case 8: //MOVIMIENTO ABAJO Y IZQUIERDA O ARRIBA Y IZQUIERDA
				console.log("C");
				posicionX = posicionX - 2;
				break;
			case 4: //MOVIMIENTO ABAJO A ARRIBA
			case 5: //MOVIMIENTO IZQUIERDA Y ARRIBA 0 DERECHA Y ARRIBA
				console.log("D");
				posicionY = posicionY - 2;
				break;
		}
		//contexto.fillRect( posicionX * 25 - 12, posicionY * 25 - 12, cuadrado.dimension, cuadrado.dimension);
		contexto.putImageData(originalBackgroud, 0, 0);
		contexto.putImageData(cuadradoMovil, posicionX * 25 - 12, posicionY * 25 - 12);
		posicion++;
		contexto.strokeStyle='#B00000';
		contexto.stroke();		
	}
	
	cargarRecorridoPrivada = function(){
		console.log("carga recorrido de mapa");
		$.getJSON('file.json', function(json) {
			var mapaSeleccionado = $("#mapas option:selected").text();
			console.log(mapaSeleccionado);
			var mapas = document.getElementById('mapas');
			for(i = 0;i < json.cantMapas; i++){
				if ( json.mapas[i].nombre == mapaSeleccionado ) {
					console.log("LO ENCONTRO!!");
					avance = json.mapas[i].recorrido;
					posicion = 0;	
					//faltarÃ­a tomar las dimensiones del mapa
				}
			}
		});
	//	pintarPrivada();
	}
	
	return{
		inicializar: inicializarPrivada,
		funcionDeDibujo: funcionDeDibujoPrivada,
		cargarValores: cargarValoresPrivada,
		avanzar: avanzarPivada,
		cargarRecorrido: cargarRecorridoPrivada,
		getWitdh: width * 50,
		getHeight: height * 50,
	}
})();