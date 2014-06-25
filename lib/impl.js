var miCanvas = (function ($, json, template){

	var contexto,
		elemento,
		funcionDeDibujoPrivada,
		cargarValoresPrivada,
		pintarPrivada,
		avanzarPrivada,
		cargarRecorridoPrivada,
		cargarListaMapasPrivada,
		inicializarPrivada,
		movimientoProximo,
		height,
		width,
		avance,
		posicionX,
		posicionY,
		posicion,
	  cuadrado,
		originalBackgroud,
		cuadradoMovil,
		dibujarObjetos,
		decir,
		obstaculos,
		cargaMapa,
		inicio,
		fin;
	matrix = [];
	cargaMapa = false;
	width = 10;
	height = 10;
	avance = [1, 1, 1, 10, 7, 1, 5, 8, 1, 1, 10, 2, 2, 2, 2, 2, 12, 3, 6, 4, 8, 1, 1, 10, 2, 2, 2, 2];
	posicionX = 0;
	posicionY = 0;
	posicion = 0;
	pintar = true;
	obstaculos = [];
	inicio=[0,0];
	fin=[9,9];
		
	//este seria como el objeto que recorre
	cuadrado = {
		posx : 1,
		posy : 13,
		dimension : 25
	};
	
	inicializarPrivada = function(){		
		elemento = document.getElementById('micanvas');
		funcionDeDibujoPrivada();
		cargarListaMapasPrivada();
	}

	funcionDeDibujoPrivada = function(){
		//ComprobaciÃ³n sobre si encontramos un elemento
		//y podemos extraer su contexto con getContext(), que indica compatibilidad con canvas
		if (elemento && elemento.getContext) {		
		  //Accedo al contesxto de '2d' de este canvas, necesario para dibujar
		  contexto = elemento.getContext('2d');
		  //contexto.width = window.innerWidth;
    	  //contexto.height = window.innerHeight;
		  if (contexto) {
			 //Si tengo el contexto 2d es que todo ha ido bien y puedo empezar a dibujar 
			  contexto.strokeStyle = '#000000';
			  pintarPrivada();
			  contexto.fillStyle = "#B00000";			
				//ESTO POSICIONA EL RECUADO ROJO SEGÃšN DONDE SE DESEA Q SEA EL PUNTO DE INICIO
				//SI O SI DEBE ESTAR SOBRE EL MARGEN IZQUIERDO
				cuadradoMovil = new Image(); 
			  cuadradoMovil.onload = function() {
					contexto.drawImage(cuadradoMovil,12, 12);
				};
				cuadradoMovil.src = 'persona.jpg';
				movimientoProximo(posicion);
		  }
		}
	}
	
	cargarListaMapasPrivada = function(){
		var mapas = document.getElementById('mapas');
		for(i = 0;i < json.cantMapas; i++){
		  var opcion = document.createElement("option");
		  opcion.text = opcion.value = json.mapas[i].nombre;
		  mapas.add(opcion);
		  console.log("El nombre es: " + json.mapas[i].nombre);
		}		
	}	
		
	//GENERA LA MATRIZ DE RECTACGILOS
	pintarPrivada = function(){
		// creamos una matriz de height*width llena de ceros 
		// para simbolizar los casilleros vacios				
		for ( var i = 0; i < height; i++ ) {
     		matrix[i] = []; 
			for( var j = 0; j < width; j++ ) {
				matrix[i][j] = 0;				
			}
		}		
		//TOMA LOS VALORES DEL JSON, PERO NO MARCA EL INICIO Y EL FIN	
		console.log("inicio " + inicio + "fin " + fin);
		matrix[parseInt(inicio[0])][parseInt(inicio[1])] = 97; //INICIO
		matrix[parseInt(fin[0])][parseInt(fin[1])] = 98; //FINAL

		//ITERA SOBRE EL ARRAY DE OBSTÁCULOS DEL JSON
		console.log("len: " + obstaculos.length);
		for ( var k = 0; k < obstaculos.length; k=k+2){		
			console.log("X "+ obstaculos[k] +" Y "+ obstaculos[k + 1]);
			matrix[ parseInt(obstaculos[k]) ][ parseInt(obstaculos[k + 1]) ] = 1;
		}
		contexto.canvas.width  = width * 50;
		contexto.canvas.height = height * 50;
			
		dibujarObjetos();
	}
	
	dibujarObjetos = function (){
		for(var x = 0; x < matrix.length; x++){
			for(var y = 0; y < matrix[x].length; y++){
				if(matrix[x][y] != 0){
					posX = x * 50;
					posY = y * 50;
					contexto.beginPath();
					contexto.rect(posX, posY, 50, 50);				
					if(matrix[x][y] == 1){
						//dibujamos el obstaculo en "x,y"						
						contexto.fillStyle = 'black';											
					} else {
						if(matrix[x][y] == 97){
							//dibujamos el inicio en "x,y
							contexto.fillStyle = 'green';											
						}else{
							if(matrix[x][y] == 98){
								//dibujamos el final en "x,y
								contexto.fillStyle = 'blue';											
							}
						}
					}
					contexto.fill();
				}
				contexto.strokeRect(x*50,y*50,50,50);
			}
		}	
	}	
	
	cargarValoresPrivada = function(){
		width = document.getElementById('width').value;
		height = document.getElementById('height').value;
		pintarPrivada();
	}
	
	movimientoProximo = function(pos){
	  console.log( avance [ pos ] );
		switch ( avance [ pos ] ){
			case 1:
				decir("seguir derecho");
				rotarPrivada(0);
				break;
			case 2:
				decir("seguir derecho");
				rotarPrivada(1.6);
				break;
			case 3:
				decir("seguir derecho");
				rotarPrivada(3.1);
				break;
			case 4:
				decir("seguir derecho");
				rotarPrivada(4.7);
				break;
			/*****************************/
			case 5:
				decir("girar izquierda");
				rotarPrivada(-1.6);
				break;
			case 7:
				decir("girar izquierda");
				rotarPrivada(0);
				break;
			case 9:
				decir("girar izquierda");
				rotarPrivada(1.6);
				break;
			case 11:
				decir("girar izquierda");
				rotarPrivada(0);
				break;
			/*****************************/	
			case 6:
				decir("seguir derecho");
				rotarPrivada(4.7);
				break;
			case 8:
				decir("girar derecha");
				rotarPrivada(0);
				break;		
			case 10:
				decir("girar derecha");
				rotarPrivada(1.6);
				break;
			case 12:
				decir("girar derecha");
				rotarPrivada(3.1);
				break;
		}		
	}
	
	rotarPrivada = function(valor){
		contexto.save();
		contexto.translate(posicionX * 50 + 12, posicionY * 50 + 12);
		contexto.translate(12, 12);
		contexto.rotate(valor);
		contexto.drawImage(cuadradoMovil, -12, -12);
		contexto.restore();
	}
	
	avanzarPrivada = function(){	
		console.log ("x: " + posicionX * 25 + "y: " + posicionY * 25);
		contexto.beginPath();
		contexto.rect(posicionX*50, posicionY*50, 50, 50);
		contexto.fillStyle = 'white';	
		contexto.fill();
		switch ( avance [ posicion ] ) {
			case 1: //MOVIMIENTO IZQUIERDA A DERECHA
			case 7: //MOVIMIENTO ARRIBA Y DERECHA 
			case 8: //MOVIMIENTO ABAJO Y DERECHA			
				console.log("A");
				if ( matrix[posicionX+1][posicionY] != 1) { 					
					posicionX = posicionX + 1;
				} else { pintar = false; }
				break;
			case 2: //MOVIMIENTO ARRIBA A ABAJO
			case 9: //MOVIMIENTO DERECHA Y ABAJO
			case 10://MOVIMIENTO IZQUIERDA Y ABAJO
				console.log("B");
				if ( matrix[posicionX][posicionY+1] != 1) { 					
					posicionY = posicionY + 1;
				} else { pintar = false; }				
				break;
			case 3: //MOVIMIENTO DERECHA A IZQUIERDA
			case 11://MOVIMIENTO ABAJO Y IZQUIERDA
			case 12://MOVIMIENTO ARRIBA Y IZQUIERDA
				console.log("C");
				if ( matrix[posicionX-1][posicionY] != 1) { 					
					posicionX = posicionX - 1;
				} else { pintar = false; }				
				break;
			case 4: //MOVIMIENTO ABAJO A ARRIBA
			case 5: //MOVIMIENTO IZQUIERDA Y ARRIBA 
			case 6: //MOVIMIENTO DERECHA Y ARRIBA
				console.log("D");
				if ( matrix[posicionX][posicionY-1] != 1) { 					
					posicionY = posicionY - 1;
				} else { pintar = false; }				
				break;
		}
		if(pintar) {
			dibujarObjetos();
			posicion++;
			if(pintar){
				movimientoProximo(posicion);
			}			
		}else{ 
			decir("obstaculo!");
		}
		if ( matrix[posicionX][posicionY] == 98) { 
			decir("FELICIDADES! HAS LLEGADO A TU DESTINO!");
			contexto.drawImage(cuadradoMovil, posicionX * 50 + 12, posicionY * 50 + 12);
		}
	}
	
	cargarRecorridoPrivada = function(){
		console.log("carga recorrido de mapa");		
		var mapaSeleccionado = $("#mapas option:selected").text();
		console.log(mapaSeleccionado);
		var mapas = document.getElementById('mapas');
		for(i = 0;i < json.cantMapas; i++){
			if ( json.mapas[i].nombre == mapaSeleccionado ) {
				avance = json.mapas[i].recorrido;
				width = json.mapas[i].ancho;
				height = json.mapas[i].alto;
				obstaculos = json.mapas[i].obstaculos;
				inicio = json.mapas[i].inicio;
				fin = json.mapas[i].fin;
				console.log("ancho: " + width +  "alto: " + height);
				console.log("obstáculos: " + obstaculos + " len " +obstaculos.length);
				posicion = 0;	
			}
		}
		posicionX = 0;
		posicionY = 0;
		posicion = 0;
		pintar = true;
		console.log("Pos: " + posicion);
		funcionDeDibujoPrivada();		
	}
	
	//funcion que dice la palabra pasada como parametro
		decir = function(palabra){
			// Initialize speech synthesis, we use polyfill only when speech synthesis is not available
			var fallbackSpeechSynthesis = window.getSpeechSynthesis();
			var fallbackSpeechSynthesisUtterance = window.getSpeechSynthesisUtterance();

			// To use polyfill directly call
			// var fallbackSpeechSynthesis = window.speechSynthesisPolyfill;
			// var fallbackSpeechSynthesisUtterance = window.SpeechSynthesisUtterancePolyfill;

			var u = new fallbackSpeechSynthesisUtterance(palabra);
			u.lang = 'es-ES';
			//u.volume = 1.0;
			//u.rate = 1.0;
			//u.onend = function(event) { console.log('Finished in ' + event.elapsedTime + ' seconds.'); };
			fallbackSpeechSynthesis.speak(u);
		}
	
	return{
		inicializar: inicializarPrivada,
		funcionDeDibujo: funcionDeDibujoPrivada,
		cargarValores: cargarValoresPrivada,
		avanzar: avanzarPrivada,
		cargarRecorrido: cargarRecorridoPrivada,
		getWitdh: width * 50,
		getHeight: height * 50,
	}
})(jQuery, MAPAS);