var socks;
var gameSocks;

var playerReference = 0;
var playersLatencies = new Object(); // Players Latencies

var ROOM_ID = '';
var ROOM_NAME = '';
var USER_ID = '';
var MAX_PLAYER = 2;

var socketUdp = chrome.socket || chrome.experimental.socket;
var gameSocketUdp = chrome.socket || chrome.experimental.socket;

var GAME_PORT = 4444;
var actualMessage = "";
var USER_NUMBER;

var controlEntrarSala = false;
var controlEndSala = false;
var stopSocketGame = false;
var stopSocketInicial = false;

/**
 * Dynamically sets the application ID.
 */
function setAPP_ID(pApp) {
	APP_ID = pApp;
}

/**
 * Sign in a room.
 */
function startSession() {
	mainSocketStart();
}

/**
 * Create the socket
 */
function mainSocketStart() {
	//console.log("Connecting...");
	socketUdp.create('udp', {}, createComplete);
	//console.log("Create Socket");
	
//	//TODO Arrancamos el Q4SClientEmbedded.js
//	startQ4S();
}

/**
 * Invoked when the socket is created
 */
function createComplete(socketInfo) {
	socks = socketInfo;
	//console.log("Create Socket OK");	
	connect();
}

/**
 * Connect
 */
function connect() {
	socketUdp.connect(socks.socketId, MAIN_SERVER_ADDRESS, MAIN_SERVER_UDP_PORT, connectionComplete);
}

/**
 * This function is called when the socket connection is completed BEGIN
 */
function connectionComplete(result) {
	if (result == 0) {
		//console.log("Connection OK BEGIN");
		receivingData(socks.socketId);
		
		callInicioSocket();
	} else {
		console.log("Connection FAILED");
	}

}

/**
 * Socket Game
 */
function gameSocketStart() {
	//console.log("Game Connecting...");
	try{
		disconnetGameSocket();
	} catch (e) {}
	gameSocketUdp.create('udp', {}, createSocketGameComplete);
	//console.log("Create Game Socket");	
	
	//TODO Arrancamos el Q4SClientEmbedded.js
	startQ4S();
}

/**
 * This function is invoked when the socket is created
 */
function createSocketGameComplete(socketInfo) {
	gameSocks = socketInfo;
	//console.log("Create Socket OK");
	connectGameRoom();
}

/**
 * Connect socket game room
 */
function connectGameRoom() {
	gameSocketUdp.connect(gameSocks.socketId, MAIN_SERVER_ADDRESS, GAME_PORT, connectGameSocketComplete);
}

/**
 * This function is called when the socket connection is completed
 */
function connectGameSocketComplete(result) {
	if (result == 0) {
		//console.log("Connection OK");
		receivingGameData(gameSocks.socketId);
		
		callActionSocketGame("");
		
		actualMessage = "";
	} else {
		console.log("Connection Game FAILED");
	}
}

/**
 * This function is called when the script is complete
 */
function writeSocketGameComplete(writeInfo) {
	//console.log("Write Game OK");
	if (writeInfo.bytesWritten < 0) {
		socketUdp.disconnect(socks.socketId);
		console.log("Error Writting Game");
	} else {
		//TODO
		var latenciaAux = Q4SClientEmbedded.getQ4SLatency();		
		readLatency(latenciaAux);			
		
		playersLatencies[USER_ID] = currentLatency;
		updateLatency();
		
		if(!stopSocketGame){
			//console.log("Next message in Game: " + limitLatency);
			t = setTimeout(function() {
				sendWindow();
			}, limitLatency);
			// Establecemos ventana de escritura con el actual MAX latency.
		}
	}
}

function starSocket() {
	stopSocketInicial = false;
	receivingData(socks.socketId);
}
function starGametSocket() {
	stopSocketGame = false;
}
function stopSocket() {	
	stopSocketInicial = true;
}
function stopGameSocket() {
	stopSocketGame = true;
	
	//TODO Paramos el Q4SClientEmbedded
	try{
		stopQ4S();	
	} catch (e) {
		console.log("Error Stop Q4S.");
	}
}
function disconnetSocket() {
	socketUdp.disconnect(socks.socketId);
}
function disconnetGameSocket() {
	gameSocketUdp.disconnect(gameSocks.socketId);
}

/**
 * Processes the information received from the main socket
 * 
 * @param socketId
 */
function receivingData(socketId) {
	socketUdp.recvFrom(socketId, function(readInfo) {
		if (readInfo.message <= 0) {
			console.log("Error Reading " + readInfo.message);
		} else {
			var newString = ab2str(readInfo.data);
			console.log("ReceivingData Continuos.");
			
			var messageData = newString.split(";");
			if(messageData[0] != ""){
				if (messageData[0] == INICIO) {
					console.log("ReceivingData INICIO # " + MAIN_SERVER_UDP_PORT);
					
					if(messageData[1] == OK) {									
						parseSalas(messageData[2]);					
					} else if(messageData[1] == ERROR_NO_SALAS) {
						var jsonAux = '';						
						parseSalas(jsonAux);						
					} else if(messageData[1] == ERROR_SALA_REP) {
						$('#nameSala').val("");
						$('#nuevaSala').attr('disabled', '');
						$('#labelMen').html("Error. Room name repeated.");
					} else if(messageData[1] == ERROR_NO_APP) {
						$('#nameSala').val("");
						$('#nuevaSala').attr('disabled', '');
						$('#labelMen').html("Error. Application does not exist or maximum bad players.");
					}										
					
					callInicioSocket();
				} else if (messageData[0] == BEGIN_SESSION) {
					console.log("ReceivingData BEGIN_SESSION # " + MAIN_SERVER_UDP_PORT + " # " + messageData[1]);
					
					if (messageData[1] == OK) {
						//console.log("ROOM: " + messageData[2]);					
						ROOM_ID = messageData[2];						
						
						//console.log("PLAYER ID: " + messageData[3]);
						USER_ID = messageData[3];
						playersLatencies = new Object();
						playersLatencies[USER_ID] = currentLatency;
						playerReference = USER_ID;
	
						//console.log("PORT: " + messageData[4]);
						GAME_PORT = parseInt(messageData[4]);					
						
						//console.log("User number: " + messageData[5]);
						USER_NUMBER = messageData[5];					
						
						ROOM_NAME = messageData[6];
						
						MAX_PLAYER = messageData[7];
						
						$('#opciones').css("display", "none");
						mostrarDiv(document.getElementById("juegoCanvas"));																														
											
						//Llamamos al init despues de que llegue el begin con toda la informacion y le pasamos el jugador que es
						preInit(ROOM_NAME, USER_NUMBER, MAX_PLAYER);	
						
						stopSocket();
						starGametSocket();
						
						//Creamos el socket nuevo del juego para esa sala
						gameSocketStart();
					} else if (messageData[1] == ERROR_NO_SALA) {						
						controlEntrarSala = false;
						$('#labelMen').html("No room. ERROR.");
					}
				} else if (messageData[0] == NEW_SALA) {
					console.log("ReceivingData NEW_SALA # " + MAIN_SERVER_UDP_PORT + " # " + messageData[1]);
					if (messageData[1] == OK) {
						//console.log("ROOM: " + messageData[2]);						
						ROOM_ID = messageData[2];
						
						//console.log("PLAYER ID: " + messageData[3]);
						USER_ID = messageData[3];
						playersLatencies = new Object();
						playersLatencies[USER_ID] = currentLatency;
						playerReference = USER_ID;

						//console.log("PORT: " + messageData[4]);
						GAME_PORT = parseInt(messageData[4]);					
						
						//console.log("User number: " + messageData[5]);
						USER_NUMBER = messageData[5];	
						
						ROOM_NAME = messageData[6];
						
						MAX_PLAYER = messageData[7];
						
						$('#opciones').css("display", "none");
						mostrarDiv(document.getElementById("juegoCanvas"));																																	
											
						//Llamamos al init despues de que llegue el begin con toda la informacion y le pasamos el jugador que es
						preInit(ROOM_NAME, USER_NUMBER, MAX_PLAYER);	
						
						stopSocket();
						starGametSocket();
						
						//Creamos el socket nuevo del juego para esa sala
						gameSocketStart();
					}
				}
			}			
		}
	});
	if(!stopSocketInicial){
		t = setTimeout(function() {
			receivingData(socks.socketId);
		}, limitLatencyToInicio);	
	}
}

/**
 * Processes the information received to the socket created for the room, the socket of the game.
 * 
 * @param socketId
 */
function receivingGameData(socketId) {
	gameSocketUdp.recvFrom(socketId, function(readInfoGame) {
		if (readInfoGame.message <= 0) {
			console.log("Error Reading Game " + readInfoGame.message);
		} else {
			var newString = ab2str(readInfoGame.data);
			//console.log("ReceivingGameData Continuos.");

			var messageData = newString.split(";");
			if (messageData[0] == ACTION) {
				console.log("ReceivingGameData ACTION # " + GAME_PORT + " # " + messageData[2] + " ###################");
				// VERIFICAMOS LA LATENCIA M�XIMA
				var numeroLat = parseInt(messageData[4]);
				playersLatencies[messageData[3]] = numeroLat;
				updateLatency();
				
				// **DEV** -- NOTIFY NEW ACTION
				readResponse(messageData[2]);
			} else if (messageData[0] == END_SESSION) {		
				console.log("ReceivingGameData END_SESSION # " + GAME_PORT + " # " + "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
				
				controlEndSala = true;
				starSocket();
				stopGameSocket();
				endSala();		
				
				try {
					$('#idRomm').html("");
				} catch (e) {}
				try {
					$('#idPlayer').html("");			
				} catch (e) {}
				try {
					$('#idLatencia').html("");			
				} catch (e) {}	
				
				$('#exitSala').attr('disabled', 'disabled');
				$('#nuevaSala').attr('disabled', '');
				
				t = setTimeout(function() {					
					endSalaWeb();												
					callInicioSocket();
				}, limitLatencyToEnd);	
			}
		}
	});	
	if(!stopSocketGame){
		t = setTimeout(function() {
			receivingGameData(gameSocks.socketId);
		}, limitLatencyToGame);	
	}
}

/**
 * Passing String to format the connexion
 */
function str2ab(str) {
	var buf = new ArrayBuffer(str.length); // 2 bytes for each char
	var bufView = new Uint8Array(buf);
	for ( var i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return buf;
}

/**
 * Passes the formatted String Buf
 */
function ab2str(buf) {
	var str = "", view = new Uint8Array(buf), len = view.length, fromCharCode = String.fromCharCode;
	for ( var i = 0; i < len; ++i) {
		str += fromCharCode(view[i]);
	}
	return str;
}

/**
 * To send an action to the other opponents in the room, this method will be used by the game to send messages to the server.
 */
function writeAction(message) {
	if (actualMessage == "") {
		actualMessage = message;
		return 0;
	} else {
		return 1;
	}
}

/**
 * priority. To send an action to the other opponents in the room, this method will be used by the game to send messages to the server.
 */
function priorWriteAction(message) {
	actualMessage = message;
}

/**
 * This function is called when the script is complete
 */
function writeComplete(writeInfo) {
	//console.log("Write OK");
	if (writeInfo.bytesWritten < 0) {
		socketUdp.disconnect(socks.socketId);
		console.log("Error Writting");
	} else {
		//TODO
//		var latenciaAux = Q4SClientEmbedded.getQ4SLatency();
//		readLatency(latenciaAux);	
		
		playersLatencies[USER_ID] = currentLatency;
		updateLatency();
	}
}

/**
 * Read Q4S latency and establish if greater than limitLatency
 */
function readLatency(pLat){	
	if(pLat!=undefined && pLat!=""){		
		if(pLat<60){
			currentLatency = 60;
		} else {
			currentLatency = pLat;
		}		
	}		
}

/**
 * Intermediate function to send actions
 */
function sendWindow() {
	sendWriteAction(actualMessage);
}

/**
 * Send an action to the other opponents in the room.
 */
function sendWriteAction(message) {
	callActionSocketGame(message);
	
	actualMessage = "";
}

/**
 * Latency update information
 */
function updateLatency() {
	var resetStat = 0;
	for ( var k in playersLatencies) {
		if (playersLatencies.hasOwnProperty(k)) {
			// console.log('key is: ' + k + ', value is: ' + players[k]);
			if (playersLatencies[k] > limitLatency) {
				limitLatency = playersLatencies[k];
				playerReference = k;
			} else if (k == playerReference && playersLatencies[k] < limitLatency) {
				resetStat = 1;
			}
		}
	}

	if (resetStat == 1) {
		limitLatency = playersLatencies[k];
		for ( var keyTmp in playersLatencies) {
			if (playersLatencies.hasOwnProperty(keyTmp)) {
				if (playersLatencies[k] > limitLatency)
					limitLatency = playersLatencies[k];
			}
		}
	}
	
	try {
		$('#idLatencia').html(limitLatency);			
	} catch (e) {}
}

/**
 * Sets the latency obtained from the input of the page.
 */
function debugUpdateLatency() {
	currentLatency = document.getElementById("latency").value;
	//console.log("UPDATE LATENCY: " + currentLatency);
}

/**
 * Sets default parameters to complete a room
 */
function endSalaWeb() {		
	$('#opciones').css("display", "block");
	mostrarDiv(document.getElementById("juegoCanvas"));				
	controlEntrarSala = false;
	controlEndSala = false;	

	currentLatency = 200;
	limitLatency = 200;
	limitLatencyToGame = 10;
	limitLatencyToInicio = 1000;
	limitLatencyToEnd = 5000;
	playerReference = 0;
	playersLatencies = new Object(); // Players Latencies
	ROOM_ID = '';
	USER_ID = '';
	ROOM_NAME = '';
	MAX_PLAYER = 2;
	actualMessage = "";
	USER_NUMBER;
}

/**
 * BEGIN call to the server
 */
function callBeginSocket(idSala) {
	console.log("Peticion Begin # " + MAIN_SERVER_UDP_PORT );
	
	var ab = str2ab(BEGIN_SESSION + ";" + APP_ID + ";" + MAX_PLAYER + ";" + idSala + ";" + USER_ID);
	socketUdp.write(socks.socketId, ab, writeComplete);	
}
/**
 * NEW SALA call to the server
 */
function callNewSalaSocket(pNameSala) {
	console.log("Peticion Nueva Sala # " + MAIN_SERVER_UDP_PORT + " # " + pNameSala + " # " + MAX_PLAYER);
	
	var ab = str2ab(NEW_SALA + ";" + APP_ID + ";" + MAX_PLAYER + ";" + pNameSala);
	socketUdp.write(socks.socketId, ab, writeComplete);	
}
/**
 * INICIO call to the server
 */
function callInicioSocket() {
	console.log("Peticion Inicio # " + MAIN_SERVER_UDP_PORT + " # " + APP_ID);
	
	var ab = str2ab(INICIO + ";" + APP_ID);
	socketUdp.write(socks.socketId, ab, writeComplete);
}
/**
 * ACTION call to the server
 */
function callActionSocketGame(message) {	
	if(message==""){
		//console.log("Peticion Action # " + GAME_PORT + " # " + actualMessage);
		
		var ab = str2ab(ACTION + ";" + ROOM_ID + ";" + actualMessage + ";" + USER_ID + ";" + currentLatency + ";" + APP_ID);
		gameSocketUdp.write(gameSocks.socketId, ab, writeSocketGameComplete);
	} else {
		//console.log("Peticion Action # " + GAME_PORT + " # " + message);
		
		var ab = str2ab(ACTION + ";" + ROOM_ID + ";" + message + ";" + USER_ID + ";" + currentLatency + ";" + APP_ID);
		gameSocketUdp.write(gameSocks.socketId, ab, writeSocketGameComplete);
	}	
}
/**
 * END SALA call to the server
 */
function callEndSocketGame() {
	console.log("Peticion End Sala # " + GAME_PORT + " # " + ROOM_ID);
	
	var ab = str2ab(END_SESSION + ";" + APP_ID + ";" + ROOM_ID + ";" + USER_ID);
	gameSocketUdp.write(gameSocks.socketId, ab, writeSocketGameComplete);		
	t = setTimeout(function() {	
		if(!controlEndSala){	
			callEndSocketGame();
		}
	}, limitLatencyToEnd);		
}

// TESTING COMMANDS
document.addEventListener('DOMContentLoaded', function() {
	startSession();			
});

//New
$(document).ready(function() {	
	$("[name^=entrarSala]").live({
		click : function(event) {		
			$('#exitSala').attr('disabled', '');
			$(this).attr('disabled', 'disabled');
			var idSala = $(this).attr('id');
			entrarSala(idSala);
		}
	});
	
	$('#nuevaSala').live({
		click : function(event) {			
			$('#exitSala').attr('disabled', '');
			var nombreSala = $('#nameSala').val();
			MAX_PLAYER = $('#maxJug').val();
			if(MAX_PLAYER == ""){
				MAX_PLAYER = 2;
			} 
			if(MAX_PLAYER > 4){
				$('#labelMen').html("4 Jugadores mx.");
			} else {
				if(nombreSala==""){					
					$('#labelMen').html("Nombre Sala requerido.");
				} else {
					$(this).attr('disabled', 'disabled');
					nuevaSala(nombreSala);
				}
			}			
		}
	});
	
	$('#exitSala').live({
		click : function(event) {							
			endSalaApi();		
		}
	});
	
	$('#exitApp').live({
		click : function(event) {							
			window.open('','_parent','');
			window.close();
		}
	});
	
	$('#update').live({
		click : function(event) {							
			var lat = $("#latency").val();
			var numeroLat = parseInt(lat);
			currentLatency = numeroLat;
			playersLatencies[USER_ID] = currentLatency;
			updateLatency();
		}
	});
	
//	$(window).bind( 'beforeunload', function() {
//		endSala();	
//	});
	
//	$(window).bind("beforeunload", function(eEvent) {    
//        eEvent.returnValue "Vas a abandonar esta pagina. Si has hecho algun cambio sin grabar vas a perder todos los datos.";  
//	});
	
	function endSalaApi() {				//End sala
		callEndSocketGame();	
	}
	
	function nuevaSala(pNameSala) {		//Mando el Nueva Sala		
		callNewSalaSocket(pNameSala);
	}
	
	function entrarSala(idSala) {		//Mando el Begin para entrar en sala
		controlEntrarSala = true;
		
		callBeginSocket(idSala);
	};
});

var tr_class = 0;

function parseSalas(pJson) {
	var tabla = "";
	
	var datosJson = $.parseJSON(pJson);
	
	tabla += star_table('id_tabla', datosJson);
	tabla += mParseJson(datosJson, 'id_tabla');	
	tabla += end_table();
	
	$('#div_salas_insertar').html("");
	$('#div_salas_insertar').append(tabla);
}

function mParseJson(pData, idTable) {
	var tabla = '';

	if(pData!=null && pData!=""){
		$.each(pData, function(key, val) {
			var sala = val;
			
			tabla += star_tr('tr_'+key);
			tabla += starEnd_td('', sala.nombre);
			tabla += starEnd_td('', sala.puerto);
			tabla += starEnd_td('', sala.estado);
			tabla += starEnd_td('', sala.listaSesiones.length+'/'+sala.maxSesiones);
			tabla += starEnd_td('', sala.fechaCreacion);
			tabla += starButton_td(sala.id, sala.estado);
			tabla += end_tr();	
		});
	} else {
		tabla += star_tr('tr_'+idTable);
		tabla += '<td colspan="6"><p>No data</p></td>';
		tabla += end_tr();		
	}	
	
	return tabla;
}

function star_table(id, pData) {
	var aux = '';

	aux += '<div class="capa_degradado margen_tabla_abajo">';
	aux += '<div class="fondo_blanco_degradado">';
	aux += '<table id="' + id + '" border="0" cellpadding="1">';
	aux += '<thead class="fixedHeader">';
	aux += '<tr class="fondo_cabecera bold">';
	aux += '<td class="char10 centrar">Name</td>';
	aux += '<td class="char10 centrar">Port</td>';
	aux += '<td class="char10 centrar">State</td>';
	aux += '<td class="char10 centrar">Sess</td>';
	aux += '<td class="char10 centrar">Creation Date</td>';
	aux += '<td class="char10 centrar">Enter</td>';
	aux += '</tr>';
	aux += '</thead>';
	aux += '<tbody class="scrollContent">';

	return aux;
}
function starButton_td(key, estado) {
	var aux = '';
	if(estado == "COMPLETA" || controlEntrarSala || estado == "CERRADA"){
		aux = '<td class="centrar" id="'+ key +'"><button type="button" id="'+key+'" name="entrarSala" disabled="disabled">Enter room</button></td>';
	} else {
		aux = '<td class="centrar" id="'+ key +'"><button type="button" id="'+key+'" name="entrarSala">Enter room</button></td>';
	}	
	return aux;
}
function starEnd_td(key, val) {
	var aux = '';
	aux = '<td class="centrar" id="'+ key +'">'+val+'</td>';
	return aux;
}
function star_tr(idTr) {
	var aux = '';
	if (tr_class == 0) {
		aux = '<tr id="' + idTr + '" >';
		tr_class = 1;
	} else {
		aux = '<tr id="' + idTr + '" class="fondo_celda">';
		tr_class = 0;
	}	
	return aux;
};
function end_tr() {
	var aux = '';
	aux = '</tr>';
	return aux;
};
function end_table() {
	var aux = '';
	aux += '</tbody>';
	aux += '</table>';
	return aux;
}

function mostrarDiv(pDiv) {
	if(pDiv.style.visibility == "hidden") {
		pDiv.style.visibility = "visible";
	}
	else {
		pDiv.style.visibility = "hidden";
	}
}

//window.onbeforeunload = confirmaSalida;  
//function confirmaSalida()   {    
//	return "Vas a abandonar esta pagina. Si has hecho algun cambio sin grabar vas a perder todos los datos.";  
//};




