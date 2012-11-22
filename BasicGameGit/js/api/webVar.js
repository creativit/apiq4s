/**
 * Latency maximum current users in the same room. Milisencods
 */
var limitLatency = 200;
var limitLatencyToGame = 10;
var limitLatencyToInicio = 1000;
var limitLatencyToEnd = 5000;

/**
 * Latency current customer based on the information provided by the library Q4S. Milisencods
 */
var currentLatency = 200;

/**
 * PROTOCOL VARS
 */
var INICIO = 0;
var BEGIN_SESSION = 1;
var ACTION = 2;
var END_SESSION = 3;
var NEW_SALA = 4;
var OK = "200";	
var ERROR_NO_APP = "501";
var ERROR_NO_SESIONES = "502";
var ERROR_NO_SALAS = "503";
var ERROR_NO_SALA = "504";
var ERROR_SALA_REP = "505";

/**
 * Server
 */
var MAIN_SERVER_ADDRESS = '213.37.1.75';
var MAIN_SERVER_UDP_PORT = 5000;

/**
 * App
 */
var APP_ID = 'dc9232a1ec4e40d4de0108753e488ecc';

/**
 * Game
 */
var SEP = ":";
var MEN_TYPE_BEGIN = "01";
var MEN_TYPE_TECLAS = "02";
var MEN_TYPE_TECLAS_ALL = "04";
var MEN_TYPE_JUGAR = "03";
var MEN_ULTIMO = "ultimoJugador";
var MEN_CONECTADO = "conectado";
var MEN_JUGAR = "jugar";
