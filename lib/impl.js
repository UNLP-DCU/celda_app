var miCanvas = (function ($, json){

	var
		//**FUNCIONES**
		inicializarPrivada,
		funcionDeDibujoPrivada,
		pintarPrivada,
		avanzarPrivada,
		cargarRecorridoPrivada,
		cargarListaMapasPrivada,
		inicializarPrivada,
		movimientoProximo,
		dibujarObjetos,
		decir,
		rotarPrivada,
		descargarMapasPrivada,
	
		//**VARIABLES**
		contexto,
		elemento,
		height,
		width,
		avance,
		posicionX,
		posicionY,
		posicion,
		direccionActual,	    
		cuadradoMovil,
		obstaculos,
		auxWidth,
		girarC = false,
		mapas,
		fs,
		errores = false,
		//peer;
 		peer = new Peer('celda_app_peer654', {key: 'ino3l998li60f6r', debug: 3});
	
	matrix = [];
	width = 10;
	height = 10;
	orientacion_inicio = 2;
	avance = [2, 7, 1, 1, 1, 10, 2, 2, 2, 2, 2, 2, 2, 7, 1, 1, 1, 1, 1];
	posicionX = 0;
	posicionY = 0;
	posicion = 0;
	pintar = true;
	obstaculos = [[4,0], [7,5], [1,5], [0,6]];
	inicio=[0,0];
	fin=[9,9];
	
	inicializarPrivada = function(){			
		elemento = document.getElementById('micanvas');
		funcionDeDibujoPrivada();
		cargarListaMapasPrivada();
		if (is_touch_device()) { canvasTactil(); }
	}

	// elemento se seteo como "micanvas" aca arriba, asi q le adhiero el evento touch
	// el cual responde disparando handleStart, q llama a avanzarPrivada
	function canvasTactil() {	
	  elemento.addEventListener("touchstart", handleStart, false);
	}	
	function handleStart(evt) {	  
	  var ctx = elemento.getContext("2d");	  
	  avanzarPrivada();	  
	}	
	//detecta si el dispositivo es tactil
	function is_touch_device() {
	 return (('ontouchstart' in window)
		  || (navigator.MaxTouchPoints > 0)
		  || (navigator.msMaxTouchPoints > 0));
	}
	
	//devuelve el valor en radianes correspondiente a el valor en grados pasado
	function getRadianAngle(degreeValue) {
		return degreeValue * Math.PI / 180;
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
			  contexto.fillStyle = "#789000";			
				//ESTO POSICIONA LA IMAGEN SEGUN DONDE SE DESEA Q SEA EL PUNTO DE INICIO
				//SI O SI DEBE ESTAR SOBRE EL MARGEN IZQUIERDO
				cuadradoMovil = new Image(); 
			  cuadradoMovil.onload = function() {
					var str = inicio.toString();					
					var vec = str.split(",");										
					contexto.drawImage(cuadradoMovil,(parseInt(vec[1])*50)+12, (parseInt(vec[0])*50)+12);
					movimientoProximo(posicion);	
				};				
				cuadradoMovil.src = 'flecha.png';									
				console.log("pos" + posicion);				
			}
		}
	}
	
	cargarListaMapasPrivada = function(){
		mapas = document.getElementById('mapas');
		mapas.length = 0;
		for(i = 0;i < json.cantMapas; i++){
		  var opcion = document.createElement("option");
		  opcion.text = opcion.value = json.mapas[i].nombre;
		  mapas.add(opcion);
		  console.log("El nombre es: " + json.mapas[i].nombre);
		}			
	}	
		
	generarMatriz = function(){
		// creamos una matriz de height*width llena de ceros 
		// para simbolizar los casilleros vacios
		matrix = [];
		for ( var i = 0; i < width; i++ ) {
     		matrix[i] = []; 			
			for( var j = 0; j < height; j++ ) {
				matrix[i][j] = 0;				
			}
		}		
		//TOMA LOS VALORES DEL JSON Y MARCA EL INICIO Y EL FIN		
		var str = inicio.toString();		
		var vec = str.split(",");
		console.log("Inicio X "+ vec[1] + " Inicio Y " + vec[0]);
		matrix[ parseInt(vec[1]) ][ parseInt(vec[0]) ] = 97; //INICIO
		inicio[0] = parseInt(vec[1]); inicio[1] = parseInt(vec[0]);
		
		str = fin.toString();		
		vec = str.split(",");
		console.log("Fin X "+ vec[1] + " Fin Y " + vec[0]);
		matrix[ parseInt(vec[1]) ][ parseInt(vec[0]) ] = 98; //FIN
		fin[0] = parseInt(vec[1]); fin[1] = parseInt(vec[0]);
						
		//ITERA SOBRE EL ARRAY DE OBSTÁCULOS DEL JSON		
		for ( var k = 0; k < obstaculos.length; k++){					
			str = obstaculos[k].toString();
			vec = str.split(",");
			console.log("X "+ vec[1] + "Y " + vec[0]);
			matrix[ parseInt(vec[1]) ][ parseInt(vec[0]) ] = 1;
		}					
	}
		
	//GENERA LA MATRIZ DE RECTANGULOS
	pintarPrivada = function(){
			
		generarMatriz();
		
		contexto.canvas.width  = width * 50;
		contexto.canvas.height = height * 50;
		
			// Orientacion especial del canvas al principio segun la orientacion inicial		
			switch ( orientacion_inicio ){
				case 1:					
					auxWidth = contexto.canvas.width;
					contexto.canvas.width  = contexto.canvas.height;
					contexto.canvas.height = auxWidth;
					contexto.translate(0, contexto.canvas.height);										
					contexto.rotate(getRadianAngle(270));			
					break;
				case 2:
					contexto.translate(contexto.canvas.width, contexto.canvas.height);
					contexto.rotate(getRadianAngle(180));
					break;
				case 3:					
					auxWidth = contexto.canvas.width;
					contexto.canvas.width  = contexto.canvas.height;
					contexto.canvas.height = auxWidth;
					contexto.translate(contexto.canvas.width, 0);				
					contexto.rotate(getRadianAngle(90));
					break;
				case 4:				
					break;
			}
		
		dibujarObjetos();		
	}
	
	dibujarObjetos = function (){	
		// ahora si es derecho no hay necesidad de reorientar el canvas
		// solo cuando se gira rotamos segun		
		//if(girarC){rotarCanvas();}
		// necesito q ignore el girar 1 vez... y es la mejor manera q se me ocurrio...
		//girarC = true;
		for(var x = 0; x < width; x++){
			for(var y = 0; y < height; y++){				
				posX = x * 50;
				posY = y * 50;  				
				//contexto.rotate(90 * (Math.PI / 180));				
				contexto.beginPath();
				//contexto.rotate(90 * (Math.PI / 180)); 
				contexto.rect(posX, posY, 48, 48);				
				if(matrix[x][y] != 0){									
					if(matrix[x][y] == 1){
						//dibujamos el obstaculo en "x,y" ROJO						
						contexto.fillStyle = '#DC381F';											
					} else {
						if(matrix[x][y] == 97){
							//dibujamos el inicio en "x,y" VERDE														
							contexto.fillStyle = '#6AA121';											
						}else{
							if(matrix[x][y] == 98){
								//dibujamos el final en "x,y" AZUL								
								contexto.fillStyle = '#4863A0';											
							}
						}
					}
			
				}else{
					//dibujo el cudrado GRIS comun (pos donde no hay nada)
					contexto.fillStyle = '#B6B6B4';
				}
				contexto.fill();
			}			
			contexto.strokeStyle = 'white';
			contexto.strokeRect(x*50,y*50,50,50);
		}		
	}
	//------------------------------ Rotacion de Canvas
	rotarCanvas = function() {
					
		switch ( avance [ posicion + 1 ] ){			
			case 5:				
			case 7:				
			case 11:
			case 9:		
				
				rotarCanvasIzquierda();				
				break;
			/*****************************/	
			case 6:				
			case 8:		
			case 12:
			case 10:				
				rotarCanvasDerecha();
				break;
		}		
	}
	
	rotarCanvasIzquierda = function(){
		console.log("WWWWW  " + contexto.canvas.width + "   HHHHHHH  " + contexto.canvas.height);		
		contexto.translate((height*50)-2, 0);
		contexto.rotate(getRadianAngle(90));	
	}
	
	rotarCanvasDerecha = function(){
	console.log("WWWWW  " + contexto.canvas.width + "   HHHHHHH  " + contexto.canvas.height);		
		contexto.translate(0, (width*50)-2);
		contexto.rotate(getRadianAngle(270));	
		contexto.canvas.width  = height * 50;
		contexto.canvas.height = width * 50;
	}
	//---------------------------------------------------------
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
				decir("girar izquierda y avanzar");				
				rotarPrivada(-1.6);
				break;
			case 7:
				decir("girar izquierda y avanzar");				
				rotarPrivada(0);
				break;
			case 9:
				decir("girar izquierda y avanzar");				
				rotarPrivada(1.6);
				break;
			case 11:
				decir("girar izquierda y avanzar");			
				rotarPrivada(3.1);
				break;
			/*****************************/	
			case 6:
				decir("girar derecha y avanzar");				
				rotarPrivada(4.7);
				break;
			case 8:
				decir("girar derecha y avanzar");				
				rotarPrivada(0);
				break;		
			case 10:
				decir("girar derecha y avanzar");				
				rotarPrivada(1.6);
				break;
			case 12:
				decir("girar derecha y avanzar");				
				rotarPrivada(3.1);
				break;
		}		
	}
	
	rotarPrivada = function(valor){		
		contexto.save();
		contexto.translate(posicionX * 50 + 12, posicionY * 50 + 12);
		contexto.translate(12, 12);
		contexto.rotate(valor);
		direccionActual = valor;
		contexto.drawImage(cuadradoMovil, -12, -12);
		contexto.restore();		
	}
	
	avanzarPrivada = function(){	
		if(pintar !=  false){
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
		}		
		dibujarObjetos();
		if(pintar) {			
			posicion++;
			if(pintar && matrix[posicionX][posicionY] != 98){
				movimientoProximo(posicion);
			}			
		}else{ 
			if ( matrix[posicionX][posicionY] != 98) { 
				pintar = false;
				decir("obstaculo");	
				rotarPrivada(direccionActual);
			}
		}
		if ( matrix[posicionX][posicionY] == 98) { 
			pintar = false;
			decir("felicidades! llegaste a tu destino");			
			rotarPrivada(direccionActual);
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
				orientacion_inicio = json.mapas[i].orientacion_inicio;
				obstaculos = json.mapas[i].obstaculos;				
				inicio = json.mapas[i].inicioFila + "," + json.mapas[i].inicioColumna;
				fin = json.mapas[i].finFila + "," + json.mapas[i].finColumna;
				console.log("Cosas: " + JSON.stringify(json.mapas[i]));
				console.log("ancho: " + width +  "  alto: " + height);
				console.log("obstáculos: " + obstaculos + " len " +obstaculos.length);
				posicion = 0;	
				posicionX = parseInt(json.mapas[i].inicioColumna);
				posicionY = parseInt(json.mapas[i].inicioFila);
			}
		}
		
		posicion = 0;
		pintar = true;
		girarC = false;
		console.log("Pos: " + posicion);
		console.log("X"+posicionX + " Y"+posicionY);
		console.log("fin"+fin);
		console.log("Orientacion inicio: " + orientacion_inicio);
		console.log("Todo el Json: " + JSON.stringify(json));		
		funcionDeDibujoPrivada();
		//Oculta el mensaje de que se descargaron cosas
		$('#descargarMapasMsj').hide();				
	}
	
	//funcion que dice la palabra pasada como parametro
	decir = function(palabra){
		// Initialize speech synthesis, we use polyfill only when speech synthesis is not available
		var fallbackSpeechSynthesis = window.getSpeechSynthesis();
		var fallbackSpeechSynthesisUtterance = window.getSpeechSynthesisUtterance();

		// To use polyfill directly call
		//var fallbackSpeechSynthesis = window.speechSynthesisPolyfill;
		//var fallbackSpeechSynthesisUtterance = window.SpeechSynthesisUtterancePolyfill;

		var u = new fallbackSpeechSynthesisUtterance(palabra);
		u.lang = 'es-ES';
		//u.volume = 1.0;
		//u.rate = 1.0;
		//u.onend = function(event) { console.log('Finished in ' + event.elapsedTime + ' seconds.'); };
		fallbackSpeechSynthesis.speak(u);
	}
	/*	
	descargarMapasPrivada = function(){
		$('#descargarMapasMsj').hide();
		//como prueba aqui se crea peer y se envia un dato peer2 a modo de peticion,
		
		//peer2 al iniciar la app se quedo esperando datos o peticiones, al recibirlos 
		//los imprime por consola y manda los datos que le pedimos
		var connection;
		//cuando se producen errores se llama a disconnect y el peer se destruye
		//es necesario re-crearlo para que funcionen las conexiones despues del disconnect
		if(peer == null || errores){
			peer = new Peer('celda_app_peer_35722', {key: 'ino3l998li60f6r', debug: 3});			
		}
		//se conecta con el id del otro peer
		connection = peer.connect('celda_map_editor_peer_999');		  	
		
		peer.on('error', function(err) { errores=true; peer.destroy(); console.log("ERRORES EN PEER"); });
			
		//apenas se abre la conexion manda la peticion			
			
		errores=false;
		connection.on('open', function(){
			connection.send('----------------------- Peer le dice a Peer2 HOLA!');						
		});
			
		//espera a recibir los datos de vuelta
		connection.on('data', function(data) {			
			//imprime los datos que volvieron del otro peer
			//serian los mapas nuevo			
			if(data != null){
				data = JSON.stringify(data);
				//data = JSON.parse(data); 			
				//console.log("DEL JSON: " + data.mapas[1].nombre);					
				console.log("DEL JSON: " + data);					
				//json = data;
				//json.replace(data);
				cargarListaMapasPrivada();
			}
			//Muestra el mensaje de que se descargaron cosas	
			$('#descargarMapasMsj').show();
		});						
	}
 	*/
 	//peer2 esta esperando que le manden algo.
 	//una peticion por ejemplo como un servidorcito :P
 	peer.on('connection', function(conn) {	  
 	  conn.on('data', function(data){		
 		data = JSON.stringify(data);
		console.log("DEL JSON: " + data);					
		data = JSON.parse(data);
			
		json.mapas[json.cantMapas] = (data.mapas[0]);
		
		json.cantMapas += data.cantMapas;
		//json = data;		
		cargarListaMapasPrivada(); 		
		$('#descargarMapasMsj').show();
 	  });
 	});
	
	
	return{
		inicializar: inicializarPrivada,
		funcionDeDibujo: funcionDeDibujoPrivada,
		cargarListaMapas: cargarListaMapasPrivada,
		pintar: pintarPrivada,
		dibujarObjetos: dibujarObjetos,
		movimientoProximo: movimientoProximo,
		rotar: rotarPrivada,
		avanzar: avanzarPrivada,
		cargarRecorrido: cargarRecorridoPrivada,
		descargarMapas: descargarMapasPrivada,
		decir: decir,
	}
})(jQuery, MAPAS);
