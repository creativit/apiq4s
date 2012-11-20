//"use strict";
YUI().use('node', 'event-custom', function(Y) {
	window.PONG = (function() {
		var maxSess = 0;
		var pintarJuego = false;
		var userId = 0;
		var messageGeneral = "";
		var MASTER = false;
		var connected = false;
		var numUsuarios = 1;
		var idUltimoConectado = 0;
		
		var der = false;
		var izq = false;
		
		function preInit(pRoom, pUser, pNumUser) {			
			maxSess = pNumUser;

			pintarJuego = true;
			
			try {
				$('#idRomm').html(pRoom);
			} catch (e) {}
			try {
				$('#idPlayer').html(pUser);			
			} catch (e) {}
			try {
				$('#idLatencia').html(limitLatency);			
			} catch (e) {}
			
			init(pRoom, pUser);
		}
		
		function init(pRoom, pUser) {
			iniciarJugadores(pUser);
		}
		
		function iniciarJugadores(pUser) {
			userId = parseInt(pUser);
			
			if(pUser == 1){
				MASTER = true;
				connected = true;
				messageGeneral = "Waiting Opponents. MASTER. Online: " + (numUsuarios) + "/" +maxSess;
				
				function anim() {
					loop();
				}
				anim();
			} else {
				MASTER = false;
				connected = true;																		
				
				numUsuarios = parseInt(pUser);
				messageGeneral = "Waiting Opponents. Online: " + (numUsuarios) + "/" +maxSess;	
				
				function anim() {
					loop();
				}
				anim();
				
				if (pUser == maxSess) {															//Eres el ultimo
					//priorWriteAction(MEN_TYPE_BEGIN + SEP + userId + SEP + MEN_ULTIMO);			//START GAME ALL JOINED
					writeAction(MEN_TYPE_BEGIN + SEP + userId + SEP + MEN_ULTIMO);		
				}  else {
					//priorWriteAction(MEN_TYPE_BEGIN + SEP + userId + SEP + MEN_CONECTADO);		//Me conecto y se lo digo a los demas
					writeAction(MEN_TYPE_BEGIN + SEP + userId + SEP + MEN_CONECTADO);		
				}												
			}
		}
		
		function readResponse(data) {
			var messageData = data.split(SEP);

			if (messageData[0] == MEN_TYPE_BEGIN) { 	// Mensaje tipo BEGIN
				var idCon = parseInt(messageData[1]); 	// Usuario conectado
				var men = messageData[2]; 				// Mensaje de begin

				if (men == MEN_CONECTADO) { 			// Si Conectado
					if(idCon != idUltimoConectado){		//Si id distinto ultimo que me mando este mensaje se hace caso
						idUltimoConectado = idCon;
						
						numUsuarios = numUsuarios + 1;
						
						if(MASTER){
							messageGeneral = "Waiting Opponents. MASTER. Online: " + (numUsuarios) + "/" +maxSess;	
						} else {
							messageGeneral = "Waiting Opponents. Online: " + (numUsuarios) + "/" +maxSess;	
						}
					}
				} else if (men == MEN_ULTIMO) { 		// Si Ultimo
					idUltimoConectado = idCon;
					
					messageGeneral = '';
					
					if(MASTER){							//Si Master mando a todos men jugar					
						//Men jugar
						priorWriteAction(MEN_TYPE_JUGAR_ALL + SEP + MEN_JUGAR);		
						//writeAction(MEN_TYPE_JUGAR_ALL + SEP + MEN_JUGAR);		
												
//						beginGame();
//						
//						t = setTimeout(function() {
//							PONG.game.reset();
//						}, currentLatency);	
					}	
				}
			} else if (messageData[0] == MEN_TYPE_TECLAS || messageData[0] == MEN_TYPE_TECLAS_ALL) { // Mensaje tipo TECLAS
				//Teclas - MEN_TYPE_TECLAS + SEP + userId + SEP + e.keyCode + SEP + posX + SEP + posY;
				var userIdAux = parseInt(messageData[1]);
				var keyCodeAux = parseInt(messageData[2]);
				var posXAux = parseInt(messageData[3]);
				var posYAux = parseInt(messageData[4]);
				var direction = parseInt(messageData[5]);	
				var playerAux = new Object();
				
				moveOponent(posXAux, posYAux, direction);	
			} else if (messageData[0] == MEN_TYPE_JUGAR || messageData[0] == MEN_TYPE_JUGAR_ALL) { // Mensaje tipo JUGAR				
				messageGeneral = '';
				
				beginGame();
//				startRound();
				PONG.game.reset();
			}
		}
		
		function drawMessage(message) {
			$('#men').html("");
			$('#men').append(message);
		}
		
		function update(){
			drawMessage(messageGeneral);
		} 
		
		function loop() {
			if(pintarJuego){
				try {
					update();
					t = setTimeout(function() {
						loop();
					}, 100);						
				} catch (e) {
					//console.log("ERROR loop");
				};	
			}	
		}

		var canvas = window.document.getElementById('pong'), game = ARNIE.game(canvas, Y),

		player1 = {
			score : 0
		},

		player2 = {
			score : 0
		},

		ball = game.sprite('ball', {
			detectCollisions : true,

			move : function() {
				this.place(this.x + this.xPixelsPerTick, this.y
						+ this.yPixelsPerTick);
			},
			reverseX : function() {
				this.xPixelsPerTick = 0 - this.xPixelsPerTick;
			},
			reverseY : function() {
				this.yPixelsPerTick = 0 - this.yPixelsPerTick;
			},
			width : 32,
			height : 32
		}),

		paddle1 = game.sprite('paddle1', {
			width : 32,
			height : 128,
			fillStyle : 'blue',
			setY : function(y) {
				var lowest = canvas.height - this.height;

				// simple object used to store next position
				this.next = {
					place : this.place
				};

				if (y < 0) {
					this.next.place(this.x, 0);
				} else if (y > lowest) {
					this.next.place(this.x, lowest);
				} else {
					this.next.place(this.x, y);
				}

				return this;
			},
			move : function() {
				if (this.next) {
					this.place(this.next.x, this.next.y);
				}
				return this;
			}
		}),

		paddle2 = game.sprite('paddle2', paddle1),

		top = game.sprite('top', {
			width : canvas.width,
			height : 1
		}),

		bottom = game.sprite('bottom', {
			width : canvas.width,
			height : 1
		}),

		left = game.sprite('left', {
			width : 1,
			height : canvas.height
		}),

		right = game.sprite('right', {
			width : 1,
			height : canvas.height
		}),

		startRound = function() {
			if (ball.placed()) {
				ball.clear();
			}
			ball.place(paddle1.right + 1, 1);

			//var randomnumber = Math.floor(Math.random()*11);

			if(limitLatency < 500){
				ball.xPixelsPerTick = 9;
				ball.yPixelsPerTick = 10;
			} else if(limitLatency >= 500 && limitLatency <= 1000){
				ball.xPixelsPerTick = 7;
				ball.yPixelsPerTick = 8;
			} else if(limitLatency >= 1000 && limitLatency <= 2000){
				ball.xPixelsPerTick = 5;
				ball.yPixelsPerTick = 6;
			} else if(limitLatency > 2000){
				ball.xPixelsPerTick = 3;
				ball.yPixelsPerTick = 4;
			}

//			Y.one('#score_player1').setContent(player1.score);
//			Y.one('#score_player2').setContent(player2.score);
		};
		
		function beginGame() {
			paddle1.place(0, 0);
			paddle2.fillStyle = 'red';
			paddle2.place(canvas.width - paddle2.width,
					canvas.height - paddle2.height);
	
			top.place(0, 0);
			bottom.place(0, canvas.height);
			left.place(0, 0);
			right.place(canvas.width, 0);
	
			// events
			Y.on('arnie:pre-intersect', function() {
				paddle1.clear().move();
				paddle2.clear().move();
				ball.clear().move();
			});
	
			ball.on('arnie:collision', function(other) {
				switch (other) {
				case paddle1:
					this.reverseX();
					this.place(other.right, this.y);
					break;
				case paddle2:
					this.reverseX();
					this.place(other.left - this.width, this.y);
					break;
				case left:		
					if(!MASTER && !der){
						der = true;
						
						var menAux = MEN_TYPE_TECLAS_ALL + SEP + userId + SEP + "" + SEP + "" + SEP + "" + SEP + 2;
						
						//priorWriteAction(menAux);
						if(writeAction(menAux)!=0){
							der = false;
							
							PONG.game.reset();
						}
					}
					break;
				case right:				
					if(MASTER && !izq){
						izq = true;
						
						var menAux = MEN_TYPE_TECLAS_ALL + SEP + userId + SEP + "" + SEP + "" + SEP + "" + SEP + 1;
						
						//priorWriteAction(menAux);	
						if(writeAction(menAux)!=0){
							izq = false;
							
							PONG.game.reset();							
						}
					}								
					break;
				case top:
				case bottom:
					this.reverseY();
					break;
				}
			});
	
			Y.on('arnie:post-intersect', function() {
				paddle1.draw();
				paddle2.draw();
				ball.draw();
			});
	
			Y.on('arnie:reset', function() {
				startRound();
			});
	
			Y.one('doc').on('keydown', function(e) {
				var key = (window.event ? e.keyCode : e.which);		
				var posiciones = generatePosLocal(key);
				
				var posX = posiciones[0];
				var posY = posiciones[1];
				var direction = posiciones[2];
				
				var menAux = MEN_TYPE_TECLAS + SEP + userId + SEP + e.keyCode + SEP + posX + SEP + posY + SEP + direction;
				
				//Pruedo moverme?
				if(writeAction(menAux)==0){
					if(MASTER){
						paddle1.setY(posY);
					} else {
						paddle2.setY(posY);
					}	
				}
			}, 'down:38,40');						
		}
		
		function generatePosLocal(pkeyCode) {				
			var arrayPos = new Array();
			
			if(pkeyCode != 0){						
				if(MASTER){
					arrayPos[0] = paddle1.x;
					arrayPos[1] = paddle1.y;
					arrayPos[2] = 0;
					
					if (pkeyCode == 38) {
						arrayPos[1] = paddle1.y - (paddle1.height / 2);
					} else if (pkeyCode == 40) {
						arrayPos[1] = paddle1.y + (paddle1.height / 2);
					}
				} else {
					arrayPos[0] = paddle2.x;
					arrayPos[1] = paddle2.y;
					arrayPos[2] = 0;
					
					if (pkeyCode == 38) {
						arrayPos[1] = paddle2.y - (paddle2.height / 2);
					} else if (pkeyCode == 40) {
						arrayPos[1] = paddle2.y + (paddle2.height / 2);
					}
				}
			}
			
			return arrayPos;
		}	

		function moveOponent(pPosX, pPosY, pPos) {
			console.log("moveOponent: " + pPosX + ", " + pPosY + ", " + pPos);
			if(pPos!=0){			
				if(pPos==1){
					izq = false;
					player1.score += 1;
					Y.one('#score_player1').setContent(player1.score);					
				} else {
					der = false;
					player2.score += 1;
					Y.one('#score_player2').setContent(player2.score);
				}
				PONG.game.reset();
			} else {
				if(!MASTER){
					paddle1.setY(pPosY);
				} else {
					paddle2.setY(pPosY);
				}
			}			
		}
		
		function endSala() {
			pintarJuego = true;
			
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
		
		return {
			// objects used privately, also available publicly
			Y : Y,
			game : game,
			startRound : startRound,
			ball : ball,
			paddle1 : paddle1,
			paddle2 : paddle2,
			bottom : bottom,
			top : top,
			left : left,
			right : right,
			preInit : preInit,
			readResponse : readResponse,
			endSala : endSala
		};
	}());

	Y.on('domready', function(e) {
		Y.one(window.document).on('click', function() {
			//PONG.game.reset();
		});

		//PONG.game.reset();
	});
});	

function preInit(pRoom, pUser, pNumUser) {
	PONG.preInit(pRoom, pUser, pNumUser);
}

function readResponse(data) {
	PONG.readResponse(data);
}

function endSala() {
	PONG.endSala();
}

