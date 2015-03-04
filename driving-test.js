console.log('Started Script:' + device.currentSource);

if (!(device.version && device.version.isSupported(0, 55))) {
  var notification = device.notifications.createNotification('on{X} is out of date');
  notification.content = "the recipe '" + device.currentSource + "' requires an up to date on{X} application.";
  notification.show();
} else {
  console.log("Mode of Transport sampling interval set to: " + device.modeOfTransport.samplingInterval);
  
  device.modeOfTransport.on('changed', function(signal) {
    if (signal.current === 'driving') {
	device.notifications.createNotification("It looks like you're driving.").show();
    }
    if (signal.previous === 'driving') {
	device.notifications.createNotification("You just stopped driving.").show();
    }
  });
  
}

console.log('Completed Script:' + device.currentSource);