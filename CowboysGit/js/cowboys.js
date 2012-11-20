//nos marca los pulsos del juego
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

arrayRemove = function(array, from) {
	var rest = array.slice((from) + 1 || array.length);
	array.length = from < 0 ? array.length + from : from;
	return array.push.apply(array, rest);
};

/**
 * Control del juego.
 */
var game = (function() {
	var canvas = new Object();
	var ctx = new Object();	
	
	var keyPressed = {};
	var keyMap = {
		left : 37,
		right : 39,
		up : 38,
		down : 40,
		fire : 32,			//Espacio
		debugLeft : 65,
		debugRight : 68,
		debugUp : 87,
		debugDown : 83,
		debugFire : 72,
		debugChangePos : 88
	};

	// LOCAL PLAYER SHOOTS
	var playerShotsBuffer = [];
	var playerShotImage;
	var shotSpeed = 5;

	// ENEMY SHOOTS
	var enemyShotsBuffer = [];
	var enemyShotImage;
	
	//Objetos escenario
	var objeto1Image = new Image();
	var objeto2Image = new Image();
	var objeto3Image = new Image();
	
	// SCORE
	var score = new Object();
	score[1] = 0;
	score[2] = 0;
	score[3] = 0;
	score[4] = 0;

	//Control
	var maxSess = 0;
	var MASTER = false;
	var connected = false;
	var messageGeneral = "";
	var numUsuarios = 1;
	var userId = 0;

	var idUltimoConectado = 0;
	
	var anchoImg = 76;
	var altoImg = 95;
	
	//Players
	var players = new Array(); 						// Players Hash with maxSess Oponent players
	var localPlayer = new Object(); 				// Player local
	var playerSpeed = 10;
	
	var pintarJuego = false;
	
	var margen = 0;
	var margenAbajo = 30;
	var margenArriba = 50;
	var margenLateralDer = 35;
	var margenLateralIzq = 10;
	
	/**
	 * Funcion a la que se llamara desde la api para iniciar el juego, este metodo sera llamado desde la api.
	 * 
	 * @param pRoom (sala a la que se coneca)
	 * @param pUser (id usuario que sera en el juego)
	 * @param pNumUser (usuarios max de esta sala)
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
		
		init(pRoom, pUser);
	}
	
	function init(pRoom, pUser) {		
		try {
			$('#idRomm').html(pRoom);
		} catch (e) {}
		try {
			$('#idPlayer').html(pUser);			
		} catch (e) {}
		try {
			$('#idLatencia').html(limitLatency);			
		} catch (e) {}
				
		iniciarJugadores(pUser);
	}
	
	/**
	 * Iniciamos jugadores segun sea el pUser (numero jugador asignado)
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
			
			if (pUser == maxSess) {															//Eres el ultimo
				priorWriteAction(MEN_TYPE_BEGIN + SEP + userId + SEP + MEN_ULTIMO);			//START GAME ALL JOINED
			}  else {
				priorWriteAction(MEN_TYPE_BEGIN + SEP + userId + SEP + MEN_CONECTADO);		//Me conecto y se lo digo a los demas				
			}			
			
			numUsuarios = parseInt(pUser);
			messageGeneral = "Waiting Opponents. Online: " + (numUsuarios) + "/" +maxSess;			
		}
	}
	
	/**
	 * Metodo encargado de gestionar los mensajes que llegan desde servidor, este metodo sera llamado desde la api.
	 */
	function readResponse(data) {
		var messageData = data.split(SEP);
		
		if (messageData[0] == MEN_TYPE_BEGIN) {			//Mensaje tipo BEGIN
			var idCon = parseInt(messageData[1]);		//Usuario conectado
			var men = messageData[2];					//Mensaje de begin
									
			if(men == MEN_CONECTADO){					//Si Conectado
				if(idCon != idUltimoConectado){			//Si id distinto ultimo que me mando este mensaje se hace caso
					idUltimoConectado = idCon;
					
					numUsuarios = numUsuarios + 1;
					
					if(MASTER){
						messageGeneral = "Waiting Opponents. MASTER. Online: " + (numUsuarios) + "/" +maxSess;	
					} else {
						messageGeneral = "Waiting Opponents. Online: " + (numUsuarios) + "/" +maxSess;	
					}
					
					players[idCon] = new Enemy(idCon);
				}								
			} else if(men == MEN_ULTIMO){				//Si Ultimo	
				if(idCon != idUltimoConectado){			//Si id distinto ultimo que me mando este mensaje se hace caso
					idUltimoConectado = idCon;
					
					messageGeneral = '';
					
					if(MASTER){							//Si Master mando a todos men jugar
						addListener(document, 'keydown', keyDown);
						
						//Men jugar
						priorWriteAction(MEN_TYPE_JUGAR + SEP + MEN_JUGAR);		
					}	
					
					players[idCon] = new Enemy(idCon);
				}								
			}								
		} else if (messageData[0] == MEN_TYPE_TECLAS) {	//Mensaje tipo TECLAS
			//Teclas - MEN_TYPE_TECLAS + SEP + userId + SEP + e.keyCode + SEP + posX + SEP + posY;
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
		} else if (messageData[0] == MEN_TYPE_JUGAR) {	//Mensaje tipo JUGAR
			addListener(document, 'keydown', keyDown);	//Se le da teclas
			
			messageGeneral = '';
		}
	}
			
	/**
	 * Gestionar teclas
	 */
	function keyDown(e) {
		//console.log("User: " + userId + ", Press KEY: " + e.keyCode);				
		
		var key = (window.event ? e.keyCode : e.which);		
		var posiciones = generatePosLocal(key);
		
		//Capturo posicion
		var posX = posiciones[0];
		var posY = posiciones[1];
		var direction = posiciones[2];
		
		var menAux = MEN_TYPE_TECLAS + SEP + userId + SEP + e.keyCode + SEP + posX + SEP + posY + SEP + direction;
		
		//Pruedo moverme?
		if(writeAction(menAux)==0){
			//Men muevo		
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
	 * Generar futura pos localplayer para su envio
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
			if (pkeyCode == 38 && localPlayer.posY > settings.marginBottom + 5) {							//Arriba		
				arrayPos[2] = 38;
				arrayPos[1] = localPlayer.posY - localPlayer.speed;
			} else if (pkeyCode == 40 && localPlayer.posY < (canvas.height - (localPlayer.height == 0 ? settings.defaultHeight : localPlayer.height) - settings.marginBottom)) {		//Abajo	
				arrayPos[2] = 40;
				arrayPos[1] = localPlayer.posY + localPlayer.speed;
			} else if (pkeyCode == 37 && localPlayer.posX > 5) {											//Izquierda
				arrayPos[2] = 37;
				arrayPos[0] = localPlayer.posX - player.speed;
			} else if (pkeyCode == 39 && localPlayer.posX < (canvas.width - localPlayer.width - 5)) {		//Derecha
				arrayPos[2] = 39;
				arrayPos[0] =  localPlayer.posX + player.speed;
			}
		}
		
		return arrayPos;
	}	
	
	/**
	 * Crear Localplayer
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

		innerPlayer.life = 3;
		innerPlayer.score = 0;
		innerPlayer.dead = false;
		innerPlayer.speed = playerSpeed;
		
		var shoot = function() {
			if(innerPlayer.direction == 39){			//derecha
				playerShot = new PlayerShot(innerPlayer.posX + anchoImg, innerPlayer.posY + (altoImg/2), innerPlayer.direction, id);	
			} else if(innerPlayer.direction == 37){		//izquierda
				playerShot = new PlayerShot(innerPlayer.posX - 20, innerPlayer.posY + (altoImg/2), innerPlayer.direction, id);	
			} else if(innerPlayer.direction == 38){		//Arriba
				playerShot = new PlayerShot(innerPlayer.posX + (anchoImg/2), innerPlayer.posY, innerPlayer.direction, id);	
			} else if(innerPlayer.direction == 40){		//Abajo
				playerShot = new PlayerShot(innerPlayer.posX + (anchoImg/2), innerPlayer.posY + altoImg, innerPlayer.direction, id);	
			}
			
			playerShot.add();
		};	

		innerPlayer.doAnything = function() {
			var idAux = innerPlayer.id;
			if (innerPlayer.dead)
				return;
			if (keyPressed.left > 0 && innerPlayer.posX > 5) {
				innerPlayer.src = 'images/marciano/marci_' + idAux  + '_izq.png';
				
				keyPressed.left -= 1;
				innerPlayer.direction = 37;
				
				if(!checkObjectCollisions(innerPlayer, 37)){
					innerPlayer.posX -= innerPlayer.speed;	
				} else {
					innerPlayer.posX += innerPlayer.speed;
				}				
			}
			if (keyPressed.right > 0 && innerPlayer.posX < (canvas.width - innerPlayer.width - 5)) {
				innerPlayer.src = 'images/marciano/marci_' + idAux  + '_der.png';
				
				keyPressed.right -= 1;
				innerPlayer.direction = 39;
				
				if(!checkObjectCollisions(innerPlayer, 39)){
					innerPlayer.posX += innerPlayer.speed;	
				} else {
					innerPlayer.posX -= innerPlayer.speed;	
				}			
			}
			if (keyPressed.down > 0 && innerPlayer.posY < (canvas.height - (innerPlayer.height == 0 ? settings.defaultHeight : innerPlayer.height) - settings.marginBottom)) {
				innerPlayer.src = 'images/marciano/marci_' + idAux  + '_aba.png';
				
				keyPressed.down -= 1;
				innerPlayer.direction = 40;
				
				if(!checkObjectCollisions(innerPlayer, 40)){
					innerPlayer.posY += innerPlayer.speed;
				} else {
					innerPlayer.posY -= innerPlayer.speed;
				}				
			}
			if (keyPressed.up > 0 && innerPlayer.posY > settings.marginBottom + 5) {
				innerPlayer.src = 'images/marciano/marci_' + idAux  + '_arr.png';
				
				keyPressed.up -= 1;
				innerPlayer.direction = 38;
				
				if(!checkObjectCollisions(innerPlayer, 38)){
					innerPlayer.posY -= innerPlayer.speed;
				} else {
					innerPlayer.posY += innerPlayer.speed;
				}				
			}
			if (keyPressed.fire > 0) {
				keyPressed.fire -= 1;
				shoot();
			}
		};

		innerPlayer.killPlayer = function() {

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

		player.life = 3;
		player.score = 0;
		player.dead = false;
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
		
		var shootEnemy = function() {
			if(pPlayer.direction == 39){			//derecha
				playerShot = new EnemyShot(pPlayer.posX + anchoImg, pPlayer.posY + (altoImg/2), pPlayer.direction, pUser);	
			} else if(pPlayer.direction == 37){		//izquierda
				playerShot = new EnemyShot(pPlayer.posX - 20, pPlayer.posY + (altoImg/2), pPlayer.direction, pUser);	
			} else if(pPlayer.direction == 38){		//Arriba
				playerShot = new EnemyShot(pPlayer.posX + (anchoImg/2), pPlayer.posY, pPlayer.direction, pUser);	
			} else if(pPlayer.direction == 40){		//Abajo
				playerShot = new EnemyShot(pPlayer.posX + (anchoImg/2), pPlayer.posY + altoImg, pPlayer.direction, pUser);	
			}
			
			playerShot.add();
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
			} else if (pkeyCode == 32) {																//Espacio
				shootEnemy();
			}		
		}				
	}
	
	/**
	 * Terminar sala, este metodo sera llamado desde la api.
	 */
	function endSala() {
//		canvas = new Object();
//		ctx = new Object();			
			
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
			
			// LOCAL PLAYER SHOOTS
			playerShotsBuffer = [];
			playerShotImage;

			// ENEMY SHOOTS
			enemyShotsBuffer = [];
			enemyShotImage;
			
			// SCORE
			score = new Object();
			score[1] = 0;
			score[2] = 0;
			score[3] = 0;
			score[4] = 0;

			//Control
			MASTER = false;
			connected = false;
			numUsuarios = 1;
			userId = 0;
			idUltimoConectado = 0;
			
			//Players
			players = new Array(); 		
			localPlayer = new Object(); 			
			
			try {
				$('#idRomm').html("");
			} catch (e) {}
			try {
				$('#idPlayer').html("");			
			} catch (e) {}
			try {
				$('#idLatencia').html("");			
			} catch (e) {}	
		}, 5000);		
	}
	
	/** ****DISPAROS***** */
	
	/**
	 * Crear disparo
	 */
	function Shot(x, y, array, img, direction, playerId) {
		this.posX = x;
		this.posY = y;
		this.image = img;
		this.speed = shotSpeed;
		this.identifier = 0;
		this.direction = direction;
		this.playerRef = playerId;
		
		this.add = function() {
			array.push(this);
		};
		
		this.deleteShot = function(idendificador) {
			arrayRemove(array, idendificador);
		};
	}

	/**
	 * Crear player disparo
	 */
	function PlayerShot(x, y, direction, playerId) {
		Object.getPrototypeOf(PlayerShot.prototype).constructor.call(this, x, y, playerShotsBuffer, playerShotImage, direction, playerId);
		this.isHittingOtherPlayer = function() {
			for ( var k in players ) {
				if (players.hasOwnProperty(k)) {
					player = players[k];
					var response = (this.posX >= player.posX
							&& this.posX <= (player.posX + anchoImg)
							&& this.posY >= player.posY && this.posY <= (player.posY + altoImg));
					if (response == true) {
						score[k] -= 1;
						return true;
					}
				}
			}
			return false;
		};
	}

	PlayerShot.prototype = Object.create(Shot.prototype);
	PlayerShot.prototype.constructor = PlayerShot;

	/**
	 * Crear enemy disparo
	 */
	function EnemyShot(x, y, direction, playerId) {
		Object.getPrototypeOf(EnemyShot.prototype).constructor.call(this, x, y, enemyShotsBuffer, enemyShotImage, direction, playerId);
		this.isHittingPlayer = function() {			
			var response = (this.posX >= localPlayer.posX
					&& this.posX <= (localPlayer.posX + anchoImg)
					&& this.posY >= localPlayer.posY && this.posY <= (localPlayer.posY + altoImg));
			if (response == true) {
				score[localPlayer.id] -= 1;
				return true;
			} else {
				for ( var k in players ) {
					if(playerId != k){
						if (players.hasOwnProperty(k)) {
							player = players[k];
							var response = (this.posX >= player.posX
									&& this.posX <= (player.posX + anchoImg)
									&& this.posY >= player.posY && this.posY <= (player.posY + altoImg));
							if (response == true) {
								score[k] -= 1;
								return true;
							}
						}
					}					
				}
				return false;
			}
		};
	}

	EnemyShot.prototype = Object.create(Shot.prototype);
	EnemyShot.prototype.constructor = EnemyShot;
	
	/**
	 * Update player shot
	 */
	function updatePlayerShot(playerShot, id) {
		if (playerShot) {
			playerShot.identifier = id;
			if (checkCollisions(playerShot)) {
				if (playerShot.direction == 38) {			// ARRIBA				
					if (playerShot.posY > 0 + margenArriba) {
						playerShot.posY -= playerShot.speed;
						bufferctx.drawImage(playerShot.image, playerShot.posX, playerShot.posY);
					} else {
						playerShot.deleteShot(parseInt(playerShot.identifier));
					}
				}
				if (playerShot.direction == 40) {			// ABAJO
					if (playerShot.posY < canvas.height - margenAbajo) {
						playerShot.posY += playerShot.speed;
						bufferctx.drawImage(playerShot.image, playerShot.posX, playerShot.posY);
					} else {
						playerShot.deleteShot(parseInt(playerShot.identifier));
					}
				}
				if (playerShot.direction == 37) {			// IZQ				
					if (playerShot.posX > 0 + margenLateralIzq) {
						playerShot.posX -= playerShot.speed;
						bufferctx.drawImage(playerShot.image, playerShot.posX, playerShot.posY);
					} else {
						playerShot.deleteShot(parseInt(playerShot.identifier));
					}
				}
				if (playerShot.direction == 39) {			// DER
					if (playerShot.posX < canvas.width - margenLateralDer) {
						playerShot.posX += playerShot.speed;
						bufferctx.drawImage(playerShot.image, playerShot.posX, playerShot.posY);
					} else {
						playerShot.deleteShot(parseInt(playerShot.identifier));
					}
				}
			}
		}
	}

	/**
	 * Update enemy shot
	 */
	function updateEnemyShot(enemyShot, id) {
		if (enemyShot) {
			enemyShot.identifier = id;
			if (checkEnemyCollisions(enemyShot)) {
				if (enemyShot.direction == 38) {				// ARRIBA
					if (enemyShot.posY > 0 + margenArriba) {
						enemyShot.posY -= enemyShot.speed;
						bufferctx.drawImage(enemyShot.image, enemyShot.posX, enemyShot.posY);
					} else {
						enemyShot.deleteShot(parseInt(enemyShot.identifier));
					}
				}
				if (enemyShot.direction == 40) {				// ABAJO
					if (enemyShot.posY < canvas.height - margenAbajo) {
						enemyShot.posY += enemyShot.speed;
						bufferctx.drawImage(enemyShot.image, enemyShot.posX, enemyShot.posY);
					} else {
						enemyShot.deleteShot(parseInt(enemyShot.identifier));
					}
				}
				if (enemyShot.direction == 37) {				// IZQ
					if (enemyShot.posX > 0 + margenLateralIzq) {
						enemyShot.posX -= enemyShot.speed;
						bufferctx.drawImage(enemyShot.image, enemyShot.posX, enemyShot.posY);
					} else {
						enemyShot.deleteShot(parseInt(enemyShot.identifier));
					}
				}
				if (enemyShot.direction == 39){  				// DER
					if (enemyShot.posX < canvas.width - margenLateralDer) {
						enemyShot.posX += enemyShot.speed;
						bufferctx.drawImage(enemyShot.image, enemyShot.posX, enemyShot.posY);
					} else {
						enemyShot.deleteShot(parseInt(enemyShot.identifier));
					}
				}
			}
		}
	}
	
	/** *****FIN DISPAROS****** */

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
	 * Check Colisiones player
	 */
	function checkCollisions(shot) {
		if (shot.isHittingOtherPlayer()) {
			score[shot.playerRef] += 1;
			shot.deleteShot(parseInt(shot.identifier));
			return false;
		}
		return true;
	}

	/**
	 * Check Colisiones enemy
	 */
	function checkEnemyCollisions(shot) {
		if (shot.isHittingPlayer()) {
			score[shot.playerRef] += 1;
			shot.deleteShot(parseInt(shot.identifier));
			return false;
		}
		return true;
	}

	/**
	 * Check Colisiones objetos
	 */
	function checkObjectCollisions(pPlayer, pKey) {		
		var response = false;
		
		var jug_X_1 = pPlayer.posX;
		var jug_X_2 = pPlayer.posX + anchoImg;
		var jug_Y_1 = pPlayer.posY;
		var jug_Y_2 = pPlayer.posY + altoImg;
		
		var obj_X_1 = objeto2Image.posX;
		var obj_X_2 = objeto2Image.posX + objeto2Image.width;		
		var obj_Y_1 = objeto2Image.posY;
		var obj_Y_2 = objeto2Image.posY + objeto2Image.height;
		
		var centroJug =  new Array();
		centroJug[0] = ((jug_X_1 + jug_X_2)/2);
		centroJug[1] = ((jug_Y_1 + jug_Y_2)/2);
		
		var posObj_1 = new Array();
		posObj_1[0] = obj_X_1;
		posObj_1[1] = obj_Y_1;
		
		var posObj_2 = new Array();
		posObj_2[0] = obj_X_2;
		posObj_2[1] = obj_Y_1;
		
		var posObj_3 = new Array();
		posObj_3[0] = obj_X_1;
		posObj_3[1] = obj_Y_2;
		
		var posObj_4 = new Array();
		posObj_4[0] = obj_X_2;
		posObj_4[1] = obj_Y_2;				
		
		if(	(centroJug[0] >= posObj_1[0]+margen && centroJug[0] <= posObj_2[0]-margen) && 
			(centroJug[1] >= posObj_1[1]+margen && centroJug[1] <= posObj_3[1]-margen)){			 		
			response = true;
		}
		
		return false;
	}
	
	/**
	 * Check Colisiones distancias
	 */
	function collidesDistancia(b1, b2) {
	    //Find the distance between their mid-points
	    var dx = b1.posX - b2.posX,
	        dy = b1.posY - b2.posY,
	        dist = Math.round(Math.sqrt(dx*dx + dy*dy));

	    //Check if it is a collision
	    if(dist > 50) {
	    	return true;
	    }
	    return false;
	}
	
	/**
	 * PINTANDO
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
	 * Precarga imagenes
	 */
	function preloadImages() {
		bgMain = new Image();
		bgMain.src = 'images/fondovertical.png';
		playerShotImage = new Image();
		playerShotImage.src = 'images/disparo_bueno.png';
		enemyShotImage = new Image();
		enemyShotImage.src = 'images/disparo_malo.png';
		
		objeto1Image = new Image();
		objeto1Image.src = 'images/objeto_01.png';
		objeto1Image.posX = 100;
		objeto1Image.posY = 100;
		objeto2Image = new Image();
		objeto2Image.src = 'images/objeto_02.png';
		objeto2Image.posX = 200;
		objeto2Image.posY = 200;
		objeto3Image = new Image();
		objeto3Image.src = 'images/objeto_03.png';
		objeto3Image.posX = 400;
		objeto3Image.posY = 500;
	}

	/**
	 * Pintar
	 */
	function draw() {
		ctx.drawImage(buffer, 0, 0);
	}
	
	/**
	 * Pintar continuo
	 */
	function update() {
		drawBackground();
		drawScores();
		drawMessage(messageGeneral);		

		bufferctx.drawImage(localPlayer, localPlayer.posX, localPlayer.posY);
		//localPlayer.doAnything();
		
		for(var i=0;i<players.length;i++){
			try {
				playerAuxx = players[i];
				bufferctx.drawImage(playerAuxx, playerAuxx.posX, playerAuxx.posY);
			} catch (e) {
				//console.log("ERROR playerAuxx");
			};
		}

		for ( var j = 0; j < playerShotsBuffer.length; j++) {
			var disparoBueno = playerShotsBuffer[j];
			updatePlayerShot(disparoBueno, j);
		}

		for ( var j = 0; j < enemyShotsBuffer.length; j++) {
			var disparoMalo = enemyShotsBuffer[j];
			updateEnemyShot(disparoMalo, j);
		}
		
		drawObjetos();
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
	 * Pintar marcadores
	 */
	function drawScores() {
		bufferctx.font = "18px Verdana";
		// Create gradient
		var gradient = bufferctx.createLinearGradient(0, 0, canvas.width, 0);
		gradient.addColorStop("0", "black");
		// Fill with gradient
		bufferctx.fillStyle = gradient;
		bufferctx.fillText(" " + score[1], 110, 35);
		bufferctx.fillText(" " + score[2], 250, 35);
		bufferctx.fillText(" " + score[3], 400, 35);
		bufferctx.fillText(" " + score[4], 550, 35);
	}

	/**
	 * Pintar mensajes
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
	 * Pintar objetos
	 */
	function drawObjetos() {
		bufferctx.drawImage(objeto1Image, objeto1Image.posX, objeto1Image.posY);
		bufferctx.drawImage(objeto2Image, objeto2Image.posX, objeto2Image.posY);
		bufferctx.drawImage(objeto3Image, objeto3Image.posX, objeto3Image.posY);
	}
	
	/////////////////////////////////////////////////////////////////////////////////////////////	
	
	return {
		readResponse : readResponse,
		preInit : preInit,
		endSala : endSala
	};

})();

/**
 * Para llamar al endSala del la var game
 */
function preInit(pRoom, pUser, pNumUser) {
	game.preInit(pRoom, pUser, pNumUser);
}

/**
 * Para llamar al redresponse del la var game
 */
function readResponse(data) {
	game.readResponse(data);
}

/**
 * Para llamar al endSala del la var game
 */
function endSala() {
	game.endSala();
}

/**
 * Listener
 */
document.addEventListener('DOMContentLoaded', function() {	
	var buttonUpdate = document.getElementById("update");

	buttonUpdate.addEventListener('click', debugUpdateLatency);	
});