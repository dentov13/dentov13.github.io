//Инициализация плеера
function onYouTubeIframeAPIReady() {
	  player = new YT.Player('player', {
		height: '500',
		playerVars: { 'autoplay': 0, 'controls': 0, 'showinfo': 0, 'rel': 0},
		width: '750',
		videoId: 'vnVuqfXohxc',
		events: {
		  'onReady': onPlayerReady
		}
  });
}

// Обработчик готовности
function onPlayerReady(event) {
	var player = event.target;
	iframe = document.getElementById('player');
	setupListener();
	updateTimerDisplay();
	updateProgressBar();

	time_update_interval = setInterval(function () {
		updateTimerDisplay();
		updateProgressBar();
	}, 1000);
}

// Слушать события
function setupListener (){
	document.getElementById('full').addEventListener('click', playFullscreen);
}

// Включение фуллскрина
function playFullscreen (){
	player.playVideo();

	  var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
	  if (requestFullScreen) {
		requestFullScreen.bind(iframe)();
	  }
}

// Громкость
function editVolume () {
	if (player.getVolume() == 0) {
		player.setVolume('100');
	} else {
		player.setVolume('0');
	}
}

// Обновление времени на панельке (счетчик)
function updateTimerDisplay(){
	document.getElementById('time').innerHTML = formatTime(player.getCurrentTime());
}

// Формат времени
function formatTime(time){
	time = Math.round(time);
	var minutes = Math.floor(time / 60),
	seconds = time - minutes * 60;
	seconds = seconds < 10 ? '0' + seconds : seconds;
	return minutes + ":" + seconds;
}

// Обновление прогресса
function updateProgressBar(){

	var line_width = jQuery('#line').width();
	var persent = (player.getCurrentTime() / player.getDuration());
	jQuery('.viewed').css('width', persent * line_width);
	per = persent * 100;
	jQuery('#fader').css('left', per+'%');
}

// Линия прогресса
function progress (event) {

	var line_width = jQuery('#line').width();
	// положение элемента
	var pos = jQuery('#line').offset();
	var elem_left = pos.left;
	// положение курсора внутри элемента
	var Xinner = event.pageX - elem_left;
	var newTime = player.getDuration() * (Xinner / line_width);
	// перемотка
	player.seekTo(newTime);
}