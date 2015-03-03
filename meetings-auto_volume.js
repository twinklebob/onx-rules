// Initializing variables 

var ringerModeOnAppointmentStart = "vibrate";
var ringerModeOnAppointmentEnd = "normal";

// End of variables initializing 

if (!(device.version && device.version.isSupported(0, 55))) {
    var notification = device.notifications.createNotification('on{X} is out of date');
    notification.content = "the recipe '" + device.currentSource + "' requires an up to date on{X} application.";
    notification.show();
  } else {
    if (device.localStorage.getItem('isInAppointment') === null) {
      device.localStorage.setItem('isInAppointment', isInAppointmentNow());
    }

    // set inexact 30 minutes polling that scans upcoming appointments
    device.scheduler.setTimer({
	name: "upcomingAppointmentsPolling",
	time: 0,
	interval: '30min', // every 30 minutes
	exact: false
      },
      scanUpcomingAppointments
    );
  }
  
  function scanUpcomingAppointments() {
    var appointments = device.calendar.ongoing.concat(device.calendar.upcoming);
    var len = appointments.length;

    for(i=0; i<len; i++) {
      var appointment = appointments[i];

      // set appointment start timer
      device.scheduler.setTimer({
	  name: "upcomingAppointmentStart" + appointment.id,
	  time: appointment.startTime,
	  exact: true
	},
	updateRinger
      );

      // set appointment end timer
      device.scheduler.setTimer({
	  name: "upcomingAppointmentEnd" + appointment.id,
	  time: appointment.endTime + 2 * 1000, // add 2 seconds to the meeting end timer to avoid race condition with the meeting end
	  exact: true
	},
	updateRinger
      );
    }

    updateRinger();
  }

  function updateRinger() {
    var wasInAppointment = device.localStorage.getItem('isInAppointment');
    if (wasInAppointment !== isInAppointmentNow()) {
      var ringerState = (isInAppointmentNow() ? ringerModeOnAppointmentStart : ringerModeOnAppointmentEnd);
      device.audio.ringerMode = ringerState;
      device.localStorage.setItem('isInAppointment', isInAppointmentNow());
    }
  }

  function isInAppointmentNow() {
      var booInAppointment = false;
      if(device.calendar.ongoing.length > 0) {
	  for(i=0; i<device.calendar.ongoing.length; i++) {
	      var currentAppointment = device.calendar.ongoing[i];
	      console.info("Found appointment: " + currentAppointment.title + " in calendar " + currentAppointment.calendarName + ". Is All day? " + currentAppointment.isAllDay);
	      
	      if(!currentAppointment.isAllDay) {
		  booInAppointment = true;
	      }
	  }
      }
      return (booInAppointment);
  }