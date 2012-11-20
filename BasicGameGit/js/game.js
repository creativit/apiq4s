/**
 * We mark the pulse of the game
 */
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame 
			|| window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame 
			|| window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame
			|| function( callback, element) {
					window.setTimeout(callback, 1000 / 60);
			};
})();

/**
 * Game control
 */
var game = (function() {
	//Canvas
	var canvas = new Object();
	var ctx = new Object();	
	
	//Keys
	var keyPressed = {};
	var keyMap = {
		left : 37,
		right : 39,
		up : 38,
		down : 40,
		debugLeft : 65,
		debugRight : 68,
		debugUp : 87,
		debugDown : 83,
	};
	
	//Control
	var maxSess = 0;
	var MASTER = false;
	var connected = false;
	var messageGeneral = "";
	var numUsuarios = 1;
	var userId = 0;
	var idUltimoConectado = 0;
	var pintarJuego = false;
	
	//Margins
	var anchoImg = 76;
	var altoImg = 95;
	
	//Players
	var localPlayer = new Object();
	var players = new Array();
	var playerSpeed = 10;
	
	/**
	 * Function that is called from the api to start the game, this method will be called from the api.
	 * 
	 * @param pRoom (room that connects)
	 * @param pUser (user id will be in the game)
	 * @param pNumUser (max users in this room)
	 */
	function preInit(pRoom, pUser, pNumUser) {
		maxSess = pNumUser;
		
		pintarJuego = true;
		
		preloadImages();

		canvas = document.getElementById('canvas');
		ctx = canvas.getContext("2d");

		buffer = document.createElement('canvas');
		buffer.width = canvas.width;
		buffer.height = canvas.height;
		bufferctx = buffer.getContext('2d');

		function anim() {
			if(pintarJuego){
				drawBackground();
				bufferctx.font = "18px Verdana";
				bufferctx.fillText("Looking room and establishing MASTER", 100, (canvas.height / 3));
				requestAnimFrame(anim);
				draw();
			}			
		}

		anim();		
		
		//Clean textBox
		try {
			$('#idRomm').html(pRoom);
		} catch (e) {}
		try {
			$('#idPlayer').html(pUser);			
		} catch (e) {}
		try {
			$('#idLatencia').html(limitLatency);			
		} catch (e) {}
		
		//Players begin
		iniciarJugadores(pUser);
	}
	
	/**
	 * Players begin as the pUser (player number assigned)
	 */
	function iniciarJugadores(pUser) {
		userId = parseInt(pUser);
		if(pUser == 1){
			MASTER = true;
			connected = true;
			messageGeneral = "Waiting Opponents. MASTER. Online: " + (numUsuarios) + "/" +maxSess;
			
			localPlayer = new LocalPlayer(1);
			
			function anim() {
				loop();
				requestAnimFrame(anim);
			}
			anim();
		} else {
			MASTER = false;
			connected = true;			
			
			localPlayer = new LocalPlayer(pUser);	
			var count = userId;
			while(count>1){
				count -= 1;
				players[count] = new Enemy(count);				
			}										
			
			function anim() {
				loop();
				requestAnimFrame(anim);
			}
			anim();
			
			if (pUser == maxSess) {															//The last
				priorWriteAction(MEN_TYPE_BEGIN + SEP + userId + SEP + MEN_ULTIMO);			//START GAME ALL JOINED
			}  else {
				priorWriteAction(MEN_TYPE_BEGIN + SEP + userId + SEP + MEN_CONECTADO);		//I log and I say to others			
			}			
			
			numUsuarios = parseInt(pUser);
			messageGeneral = "Waiting Opponents. Online: " + (numUsuarios) + "/" +maxSess;			
		}
	}
	
	/**
	 * Method responsible for managing incoming messages from the server, this method will be called from the api.
	 */
	function readResponse(data) {
		var messageData = data.split(SEP);
		
		if (messageData[0] == MEN_TYPE_BEGIN) {			//Message type BEGIN
			var idCon = parseInt(messageData[1]);		//User online
			var men = messageData[2];					//Message to begin
									
			if(men == MEN_CONECTADO){					//If Online
				if(idCon != idUltimoConectado){			//If id other last thing I sent this message is ignored
					idUltimoConectado = idCon;
					
					numUsuarios = numUsuarios + 1;
					
					if(MASTER){
						messageGeneral = "Waiting Opponents. MASTER. Online: " + (numUsuarios) + "/" +maxSess;	
					} else {
						messageGeneral = "Waiting Opponents. Online: " + (numUsuarios) + "/" +maxSess;	
					}
					
					players[idCon] = new Enemy(idCon);
				}								
			} else if(men == MEN_ULTIMO){				//If last
				if(idCon != idUltimoConectado){			//If id other last thing I sent this message is ignored
					idUltimoConectado = idCon;
					
					messageGeneral = '';
					
					if(MASTER){							//If Master command all message play
						addListener(document, 'keydown', keyDown);
						
						//Message play
						priorWriteAction(MEN_TYPE_JUGAR + SEP + MEN_JUGAR);		
					}	
					
					players[idCon] = new Enemy(idCon);
				}								
			}								
		} else if (messageData[0] == MEN_TYPE_TECLAS) {	//Message type TECLAS
			//TECLAS - MEN_TYPE_TECLAS + SEP + userId + SEP + e.keyCode + SEP + posX + SEP + posY;
			var userIdAux = parseInt(messageData[1]);
			var keyCodeAux = parseInt(messageData[2]);
			var posXAux = parseInt(messageData[3]);
			var posYAux = parseInt(messageData[4]);
			var direction = parseInt(messageData[5]);	
			var playerAux = new Object();
			
			for(var i=0;i<players.length;i++){
				try {
					if(players[i].id == userIdAux){
						playerAux = players[i];	
					}
				} catch (e) {}
			}
			
			if(userIdAux == playerAux.id){
				doAnythingEnemy(playerAux, keyCodeAux, posXAux, posYAux, direction, userIdAux);	
			}			
		} else if (messageData[0] == MEN_TYPE_JUGAR) {	//Message type JUGAR
			addListener(document, 'keydown', keyDown);	//Keys is given
			
			messageGeneral = '';
		}
	}
	
	/**
	 * End room, this method will be called from the api.
	 */
	function endSala() {			
		removeEventListener(document, 'keydown', keyDown);
		
		var countSeg = 0;
		var puntos = ".";
		var waitPuntos = function() {
			if(countSeg<5){
				messageGeneral = "Cancelled room, closing in 5 seconds " + puntos;	
				t = setTimeout(function() {
					puntos = "";
					countSeg += 1;
					for(var i=0;i<countSeg;i++){
						puntos += ".";
					}
					waitPuntos();
				}, 800);			
			}
		};	
		waitPuntos();
						
		t = setTimeout(function() {
			pintarJuego = false;
	
			//Control
			MASTER = false;
			connected = false;
			numUsuarios = 1;
			userId = 0;
			idUltimoConectado = 0;
			
			//Players
			players = new Array(); 		
			localPlayer = new Object(); 									
		}, 5000);		
	}
	
	/**
	 * Managing keys
	 */
	function keyDown(e) {
		//console.log("User: " + userId + ", Press KEY: " + e.keyCode);				
		
		var key = (window.event ? e.keyCode : e.which);		
		var posiciones = generatePosLocal(key);
		
		//Captured position
		var posX = posiciones[0];
		var posY = posiciones[1];
		var direction = posiciones[2];
		
		var menAux = MEN_TYPE_TECLAS + SEP + userId + SEP + e.keyCode + SEP + posX + SEP + posY + SEP + direction;
		
		//I can move?
		if(writeAction(menAux)==0){
			for ( var inkey in keyMap) {
				if (key === keyMap[inkey]) {
					e.preventDefault();
					keyPressed[inkey] = 1;
				}
			}
			
			try {
				localPlayer.doAnything();	
			} catch (e) {}			
		}				
	}
	
	/**
	 * Create Localplayer
	 */
	function LocalPlayer(id) {
		var settings = {
			marginBottom : 10,
			marginBottomY : 50,
			defaultHeight : altoImg
		};
		
		innerPlayer = new Image();		
		innerPlayer.direction = 0;
		innerPlayer.id = id;
		
		if (id == 1) {
			innerPlayer.src = 'images/marciano/marci_' + id  + '_der.png';
			
			innerPlayer.posX = 0 + settings.marginBottom;
			innerPlayer.posY = 0 + settings.marginBottomY;
		} else if (id == 2) {
			innerPlayer.src = 'images/marciano/marci_' + id  + '_izq.png';
			
			innerPlayer.posX = canvas.width - anchoImg - settings.marginBottom;
			innerPlayer.posY = 0 + settings.marginBottomY;
		} else if (id == 3) {
			innerPlayer.src = 'images/marciano/marci_' + id  + '_der.png';
			
			innerPlayer.posX = 0 + settings.marginBottom;
			innerPlayer.posY = canvas.height - settings.marginBottom - altoImg;
		} else if (id == 4) {
			innerPlayer.src = 'images/marciano/marci_' + id  + '_izq.png';
			
			innerPlayer.posX = canvas.width - anchoImg - settings.marginBottom;
			innerPlayer.posY = canvas.height - settings.marginBottom - altoImg;
		}

		innerPlayer.speed = playerSpeed;

		innerPlayer.doAnything = function() {
			var idAux = innerPlayer.id;
			if (keyPressed.left > 0 && innerPlayer.posX > 5) {
				innerPlayer.src = 'images/marciano/marci_' + idAux  + '_izq.png';
				
				keyPressed.left -= 1;
				innerPlayer.direction = 37;		
				
				innerPlayer.posX -= innerPlayer.speed;	
			}
			if (keyPressed.right > 0 && innerPlayer.posX < (canvas.width - innerPlayer.width - 5)) {
				innerPlayer.src = 'images/marciano/marci_' + idAux  + '_der.png';
				
				keyPressed.right -= 1;
				innerPlayer.direction = 39;	
				
				innerPlayer.posX += innerPlayer.speed;	
			}
			if (keyPressed.down > 0 && innerPlayer.posY < (canvas.height - (innerPlayer.height == 0 ? settings.defaultHeight : innerPlayer.height) - settings.marginBottom)) {
				innerPlayer.src = 'images/marciano/marci_' + idAux  + '_aba.png';
				
				keyPressed.down -= 1;
				innerPlayer.direction = 40;	
				
				innerPlayer.posY += innerPlayer.speed;
			}
			if (keyPressed.up > 0 && innerPlayer.posY > settings.marginBottom + 5) {
				innerPlayer.src = 'images/marciano/marci_' + idAux  + '_arr.png';
				
				keyPressed.up -= 1;
				innerPlayer.direction = 38;	
				
				innerPlayer.posY -= innerPlayer.speed;
			}
		};

		return innerPlayer;
	}
	
	/**
	 * Crear Enemigos (demas jugadores)
	 */
	function Enemy(id) {
		var settings = {
			marginBottom : 10,
			marginBottomY : 50,
			defaultHeight : altoImg
		};
		
		player = new Image();
		player.direction = 0;
		player.id = id;

		if (id == 1) {
			player.src = 'images/marciano/marci_' + id  + '_der.png';
			
			player.posX = 0 + settings.marginBottom;
			player.posY = 0 + settings.marginBottomY;
		} else if (id == 2) {
			player.src = 'images/marciano/marci_' + id  + '_izq.png';
			
			player.posX = canvas.width - anchoImg - settings.marginBottom;
			player.posY = 0 + settings.marginBottomY;
		} else if (id == 3) {
			player.src = 'images/marciano/marci_' + id  + '_der.png';
			
			player.posX = 0 + settings.marginBottom;
			player.posY = canvas.height - settings.marginBottom - altoImg;
		} else if (id == 4) {
			player.src = 'images/marciano/marci_' + id  + '_izq.png';
			
			player.posX = canvas.width - anchoImg - settings.marginBottom;
			player.posY = canvas.height - settings.marginBottom - altoImg;
		}

		player.speed = playerSpeed;

		return player;
	}
	
	/**
	 * Mover enemigos
	 */
	function doAnythingEnemy(pPlayer, pkeyCode, pPosX, pPosY, pDirection, pUser) {		
		var settings = {
				marginBottom : 10,
				marginBottomY : 50,
				defaultHeight : altoImg
		};	
		
		if(pkeyCode != 0){	
			var idAux = pPlayer.id;
			if (pkeyCode == 38 && pPlayer.posY > settings.marginBottom + 5) {							//Arriba
				pPlayer.src = 'images/marciano/marci_' + idAux + '_arr.png';
				
				pPlayer.direction = 38;
				pPlayer.posY = pPosY;
			} else if (pkeyCode == 40 && pPlayer.posY < (canvas.height - (pPlayer.height == 0 ? settings.defaultHeight : pPlayer.height) - settings.marginBottom)) {		//Abajo
				pPlayer.src = 'images/marciano/marci_' + idAux + '_aba.png';
				
				pPlayer.direction = 40;
				pPlayer.posY = pPosY;
			} else if (pkeyCode == 37 && pPlayer.posX > 5) {											//Izquierda
				pPlayer.src = 'images/marciano/marci_' + idAux + '_izq.png';
				
				pPlayer.direction = 37;
				pPlayer.posX = pPosX;
			} else if (pkeyCode == 39 && pPlayer.posX < (canvas.width - pPlayer.width - 5)) {			//Derecha
				pPlayer.src = 'images/marciano/marci_' + idAux + '_der.png';
				
				pPlayer.direction = 39;
				pPlayer.posX = pPosX;
			}	
		}				
	}
	
	/**
	 * Generate future post localplayer for shipment
	 */
	function generatePosLocal(pkeyCode) {		
		var settings = {
				marginBottom : 10,
				marginBottomY : 50,
				defaultHeight : altoImg
		};
		
		var arrayPos = new Array();
		
		arrayPos[0] = localPlayer.posX;
		arrayPos[1] = localPlayer.posY;
		arrayPos[2] = localPlayer.direction;
		
		if(pkeyCode != 0){		
			if (pkeyCode == 38 && localPlayer.posY > settings.marginBottom + 5) {							//Up		
				arrayPos[2] = 38;
				arrayPos[1] = localPlayer.posY - localPlayer.speed;
			} else if (pkeyCode == 40 && localPlayer.posY < (canvas.height - (localPlayer.height == 0 ? settings.defaultHeight : localPlayer.height) - settings.marginBottom)) {		//Down	
				arrayPos[2] = 40;
				arrayPos[1] = localPlayer.posY + localPlayer.speed;
			} else if (pkeyCode == 37 && localPlayer.posX > 5) {											//Left
				arrayPos[2] = 37;
				arrayPos[0] = localPlayer.posX - player.speed;
			} else if (pkeyCode == 39 && localPlayer.posX < (canvas.width - localPlayer.width - 5)) {		//Right
				arrayPos[2] = 39;
				arrayPos[0] =  localPlayer.posX + player.speed;
			}
		}
		
		return arrayPos;
	}	
	
	/**
	 * Precarga imagenes
	 */
	function preloadImages() {
		bgMain = new Image();
		bgMain.src = 'images/fondo.png';
	}
	
	/**
	 * Pintar
	 */
	function draw() {
		ctx.drawImage(buffer, 0, 0);
	}
	
	/**
	 * Pintar fondo
	 */
	function drawBackground() {
		var background;
		background = bgMain;

		bufferctx.drawImage(background, 0, 0);
	}
	

	/**
	 * Paint messages
	 */
	function drawMessage(message) {
		bufferctx.font = "16px Verdana";
		// Create gradient
		var gradient = bufferctx.createLinearGradient(0, 0, canvas.width, 0);
		gradient.addColorStop("0", "black");
		// Fill with gradient
		bufferctx.fillStyle = gradient;
		bufferctx.fillText("" + message, 100, (canvas.height / 3));
	}
	
	/**
	 * PAINTING
	 */
	function loop() {
		if(pintarJuego){
			try {
				update();
				draw();	
			} catch (e) {
				//console.log("ERROR loop");
			};	
		};	
	}
	
	/**
	 * Continuous painting
	 */
	function update() {
		drawBackground();
		drawMessage(messageGeneral);		

		bufferctx.drawImage(localPlayer, localPlayer.posX, localPlayer.posY);
		
		for(var i=0;i<players.length;i++){
			try {
				playerAuxx = players[i];
				bufferctx.drawImage(playerAuxx, playerAuxx.posX, playerAuxx.posY);
			} catch (e) {
				//console.log("ERROR playerAuxx");
			};
		}
	}
	
	/**
	 * Listener
	 */
	function addListener(element, type, expression, bubbling) {
		bubbling = bubbling || false;

		if (window.addEventListener) { 			// Standard
			element.addEventListener(type, expression, bubbling);
		} else if (window.attachEvent) { 		// IE
			element.attachEvent('on' + type, expression);
		}
	}
	
	/**
	 * Public Methods
	 */
	return {
		readResponse : readResponse,
		preInit : preInit,
		endSala : endSala
	};
})();

/**
 * To call var endSala of the game
 */
function preInit(pRoom, pUser, pNumUser) {
	game.preInit(pRoom, pUser, pNumUser);
}

/**
 * To call var redresponse of the game
 */
function readResponse(data) {
	game.readResponse(data);
}

/**
 *To call var endSala of the game
 */
function endSala() {
	game.endSala();
}