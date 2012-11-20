//TODO Mark pulse of the game

/**
 * Game control
 */
var game = (function() {
	//TODO Canvas variables
	
	//TODO Define keys variables
	
	//TODO Define control variables
	
	//TODO Define margins variables
	
	//TODO Define players variables
	
	/**
	 * Function that is called from the api to start the game, this method will be called from the api.
	 * 
	 * @param pRoom (room that connects)
	 * @param pUser (user id will be in the game)
	 * @param pNumUser (max users in this room)
	 */
	function preInit(pRoom, pUser, pNumUser) {
		//TODO save session highs

		//TODO do you need to start the game, images, canvas, text		
		
		//TODO preload images

		//TODO initiate canvas

		//TODO animate	
		
		//TODO Clean textBox, idRomm, idPlayer, idLatencia
		
		//Players begin
		iniciarJugadores(pUser);
	}
	
	/**
	 * Players begin as the pUser (player number assigned)
	 */
	function iniciarJugadores(pUser) {
		//TODO Players create and control these messages as we reach the API
					
		//TODO Messages to the API	
		var men = "";
		priorWriteAction(men);
	}
	
	/**
	 * Method responsible for managing incoming messages from the server, this method will be called from the api.
	 */
	function readResponse(data) {
		//TODO Capture messages
		var messageData = data.split(SEP);		
	}
	
	/**
	 * End room, this method will be called from the api.
	 */
	function endSala() {			
		//TODO end room, take messages if necessary and restart the game variables	
	}
	
	/**
	 * Managing keys
	 */
	function keyDown(e) {
		//TODO capture key			
		
		var menAux = "";
		
		if(writeAction(menAux)==0){
			//Move	
		}			
	}
	
	/**
	 * Create Localplayer
	 */
	function LocalPlayer(id) {
		//TODO Local player
	}
	
	/**
	 * Crear Enemigos (demas jugadores)
	 */
	function Enemy(id) {
		//TODO Other player
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