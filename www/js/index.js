/*
    Licensed Toruz Holding, Jan 2014
    Enero 20, 2014
*/
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
		console.log("se inicializa");
        document.addEventListener('deviceready', this.onDeviceReady, false);
		console.log("se inicializó");
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
                if (navigator.network !== undefined) {
					if (navigator.network.connection.type != Connection.NONE) {
						// determine whether this connection is high-speed
						switch (navigator.network.connection.type) {
							case Connection.UNKNOWN:
							case Connection.CELL_2G:
								isHighSpeed = false;
								break;
							default:
								isHighSpeed = true;
								break;
						}
						console.log("Su conexión es del tipo: "+navigator.network.connection.type);
					} else {
						console.log("Su dispositivo no cuenta con internet");
					}
                } else {
                    console.log("Su dispositivo no cuenta con internet");
                }
			console.log("Se cambiará a la siguiente pag");
            window.location = "index2.html";
			console.log("Se cambia a la siguiente pag");
	},
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

		listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');*/

        console.log('Received Event: ' + id);
    }
};
