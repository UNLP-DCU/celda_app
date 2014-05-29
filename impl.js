// github FOR WINDOWS
var miCanvas = (function (){

	var contexto,
		funcionDeDibujoPrivada,
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
		cuadrado;
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
	
	funcionDeDibujoPrivada = function(){
		var elemento = document.getElementById('micanvas');
		
		//Comprobación sobre si encontramos un elemento
		//y podemos extraer su contexto con getContext(), que indica compatibilidad con canvas
		if (elemento && elemento.getContext) {
			
		   //Accedo al contexto de '2d' de este canvas, necesario para dibujar
		   contexto = elemento.getContext('2d');
		   if (contexto) {
				
			  //Si tengo el contexto 2d es que todo ha ido bien y puedo empezar a dibujar 
			  contexto.strokeStyle = '#000000';
			  pintarPrivada();
			  contexto.fillStyle = "#B00000";
				
				//ESTO POSICIONA EL RECUADO ROJO SEGÚN DONDE SE DESEA Q SEA EL PUNTO DE INICIO
				//SI O SI DEBE ESTAR SOBRE EL MARGEN IZQUIERDO
				cuadrado.posy = (( posicionY - 1) * 50 ) + cuadrado.posy;
				contexto.fillRect( cuadrado.posx, cuadrado.posy, cuadrado.dimension, cuadrado.dimension );
		   }
		}
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
		
	//GENERA LA MATRIZ DE RECTÁCGILOS
	pintarPrivada = function(){
		contexto.canvas.width  = width * 50;
		contexto.canvas.height = height * 50;
		for (i=0; i<height; i++){
			for (j=0; j<width; j++){
				//esto genera solo el contorno del rectángulo
				contexto.strokeRect(j*50,i*50,50,50);
			}
		}	
	}
	
	
	cargarValoresPrivada = function(){
		width = document.getElementById('width').value;
		height = document.getElementById('height').value;
		pintarPrivada();
	}
	
	avanzarPivada = function(){	
		//aqui podría tomar los valores del json para saber q tipo de linea tiene q dibujar y el audio a escuchar
		contexto.beginPath();
		contexto.setLineDash([ 7, 5 ]);
		contexto.lineWidth=5;
		if ( posicion == 0 ) {
			contexto.clearRect ( cuadrado.posx, cuadrado.posy, cuadrado.dimension, cuadrado.dimension );
			contexto.lineTo ( 1, posicionY * 25 );
			contexto.lineTo ( 25, posicionY * 25 );
		}else{
			contexto.clearRect( posicionX * 25 - 13 , posicionY * 25 - 13, cuadrado.dimension+1, cuadrado.dimension+1);
		}
		console.log ("x: " + posicionX * 25 + "y: " + posicionY * 25);
		contexto.lineTo( posicionX * 25, posicionY * 25);
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
		contexto.lineTo( posicionX * 25, posicionY * 25);
		contexto.fillRect( posicionX * 25 - 12, posicionY * 25 - 12, cuadrado.dimension, cuadrado.dimension);
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
					//faltaría tomar las dimensiones del mapa
				}
			}
		});
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