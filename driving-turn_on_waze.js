// When I start driving, turn on Waze

var apps = device.applications;

device.modeOfTransport.on('changed', function(signal) {
    if (signal.current === 'driving') {
        apps.launch('waze');
    }
});

console.log('current MOT:', device.modeOfTransport.current);