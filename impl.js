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
	matrix = [];
	width = 10;
	height = 10;
	avance = [ 1,1,1,7,1,1,1,1,1,1,7,7,7,8,8,5,5,1,1,7,7,7,7,7,7,7];
	posicionX = 0;
	posicionY = 0;
	posicion = 0;
	pintar = true;
	
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
	
	/*setFullscreenPrivada = function(){
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
    }*/

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
				//setFullscreenPrivada();
			  //Si tengo el contexto 2d es que todo ha ido bien y puedo empezar a dibujar 
			  contexto.strokeStyle = '#000000';
			  pintarPrivada();
			  contexto.fillStyle = "#B00000";
				
				//ESTO POSICIONA EL RECUADO ROJO SEGÃšN DONDE SE DESEA Q SEA EL PUNTO DE INICIO
				//SI O SI DEBE ESTAR SOBRE EL MARGEN IZQUIERDO
				// Asumo q esta en la posicion 0 0 
				cuadrado.posy = 12;
				cuadrado.posx = 12;
				contexto.fillRect( cuadrado.posx, cuadrado.posy, cuadrado.dimension, cuadrado.dimension );
				
				cuadradoMovil = contexto.getImageData(cuadrado.posx, cuadrado.posy, cuadrado.dimension, cuadrado.dimension); 
				canvas_arrow((posicionX * 50) - 15, (posicionY * 50) - 15, (posicionX * 50) + 15, (posicionY * 50) - 15);
				console.log("adaad");
				/*switch ( avance [ posicion ] ) {
					case 1: //MOVIMIENTO IZQUIERDA A DERECHA
					case 6: //MOVIMIENTO ARRIBA Y DERECHA 0 ABAJO Y DERECHA
						console.log("A");
						break;
					case 2: //MOVIMIENTO ARRIBA A ABAJO
					case 7: //MOVIMIENTO DERECHA Y ABAJO O IZQUIERDA Y ABAJO
						console.log("B");
						posicionY = posicionY + 1;
						break;
					case 3: //MOVIMIENTO DERECHA A IZQUIERDA
					case 8: //MOVIMIENTO ABAJO Y IZQUIERDA O ARRIBA Y IZQUIERDA
						
						console.log("C");
						posicionX = posicionX - 1;
						break;
					case 4: //MOVIMIENTO ABAJO A ARRIBA
					case 5: //MOVIMIENTO IZQUIERDA Y ARRIBA 0 DERECHA Y ARRIBA
						
						console.log("D");
						posicionY = posicionY - 1;
						break;
				}*/
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
		// creamos una matriz de height*width llena de ceros 
		// para simbolizar los casilleros vacios				
		for ( var i = 0; i < height; i++ ) {
     		matrix[i] = []; 
			for( var j = 0; j < width; j++ ) {
				matrix[i][j] = 0;				
			}
		}		
		// Estarian en el Json segun cada mapa		
		matrix[0][0] = 97; //INICIO
		matrix[9][9] = 98; //FINAL

		matrix[4][0] = 1; //obstaculo
		matrix[7][5] = 1; //obstaculo
		matrix[1][5] = 1; //obstaculo
		matrix[0][6] = 1; //obstaculo
		matrix[5][9] = 1; //obstaculo
				
		contexto.canvas.width  = width * 50;
		contexto.canvas.height = height * 50;
				
		originalBackgroud = contexto.getImageData(0, 0, 200, 200);
		
		dibujarObjetos();
	}
	
	function dibujarObjetos(){
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
		originalBackgroud = contexto.getImageData(0, 0, height*50, width*200);
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
				if ( matrix[posicionX+1][posicionY] != 1) { 					
					posicionX = posicionX + 1;
					decir("derecha");
				} else { decir("obstáculo"); pintar = false; }
				break;
			case 2: //MOVIMIENTO ARRIBA A ABAJO
			case 7: //MOVIMIENTO DERECHA Y ABAJO O IZQUIERDA Y ABAJO
				console.log("B");
				if ( matrix[posicionX][posicionY+1] != 1) { 					
					posicionY = posicionY + 1;
					decir("abajo");
				} else { decir("obstáculo"); pintar = false; }				
				break;
			case 3: //MOVIMIENTO DERECHA A IZQUIERDA
			case 8: //MOVIMIENTO ABAJO Y IZQUIERDA O ARRIBA Y IZQUIERDA
				console.log("C");
				if ( matrix[posicionX-1][posicionY] != 1) { 					
					posicionX = posicionX - 1;
					decir("izquierda");
				} else { decir("obstáculo"); pintar = false; }				
				break;
			case 4: //MOVIMIENTO ABAJO A ARRIBA
			case 5: //MOVIMIENTO IZQUIERDA Y ARRIBA 0 DERECHA Y ARRIBA
				console.log("D");
				if ( matrix[posicionX][posicionY-1] != 1) { 					
					posicionY = posicionY - 1;
					decir("arriba");
				} else { decir("obstáculo"); pintar = false; }				
				break;
		}
				 					
		if(pintar) {
			//contexto.fillRect( posicionX * 25 - 12, posicionY * 25 - 12, cuadrado.dimension, cuadrado.dimension);		
			contexto.putImageData(originalBackgroud, 0, 0);			
			contexto.putImageData(cuadradoMovil, posicionX * 50 + 12, posicionY * 50 + 12);
			posicion++;
			contexto.strokeStyle='#B00000';
			contexto.stroke();				
		}
		if ( matrix[posicionX][posicionY] == 98) { 
			decir("FELICIDADES! HAS LLEGADO A TU DESTINO!");
		}
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
		//funcionDeDibujoPrivada();
	}
	
	//funcion que dice la palabra pasada como parametro
	function decir(palabra){
		if (window.SpeechSynthesisUtterance === undefined) {
			$("#unsupported").show();
			//document.getElementById('unsupported').remove('hidden');
		  } else {
			// funciona sin esto... pero por si acaso estaría bueno tenerlo a mano
			// Workaround for a Chrome issue (#340160 - https://code.google.com/p/chromium/issues/detail?id=340160)			
			/*
			var watch = setInterval(function() {
			  // Load all voices available
			  var voicesAvailable = speechSynthesis.getVoices();
	 
			  if (voicesAvailable.length !== 0) {
				for(var i = 0; i < voicesAvailable.length; i++) {
				  voices.innerHTML += '<option value="' + voicesAvailable[i].lang + '"' +
									  'data-voice-uri="' + voicesAvailable[i].voiceURI + '">' +
									  voicesAvailable[i].name +
									  (voicesAvailable[i].default ? ' (default)' : '') + '</option>';
				}
	 
				clearInterval(watch);
			  }
			}, 1);
			*/
	 
			//esto crea la palabra a decir y speak lo dice... cool hu
			// Create the utterance object setting the chosen parameters
			var utterance = new SpeechSynthesisUtterance(palabra);
			utterance.lang = "es-ES";	 
			window.speechSynthesis.speak(utterance);			
		}
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