var clock;

		$(document).ready(function() {
			var clock;

			clock = $('.main-order__timer-clock').FlipClock({
		        clockFace: 'HourlyCounter',
		        autoStart: false,
		        callbacks: {
		        	stop: function() {
		        		$('.message').html('The clock has stopped!')
		        	}
		        }
		    });

		    clock.setTime(7198);
		    clock.setCountdown(true);
		    clock.start();

		});