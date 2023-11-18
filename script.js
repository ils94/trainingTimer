let countdownInterval;
let totalTime1 = 0;
let totalTime2 = 0;
let remainingTime = 0;
let rounds = 0;
let currentCooldown = 1;

let audioContext;

let startAudio = "sound/start_en.mp3";
let restAudio = "sound/rest_en.mp3";
let finishAudio = "sound/finish_en.mp3";
let tenSecondsAudio = "sound/10_seconds_en.mp3";
let getReadyAudio = "sound/getReady_en.mp3";

let startText = 'Start!';
let restText = 'Rest!';
let roundsText = 'Rounds Remaining: ';
let finishText = 'Finish!';
let noMoreRoundsText = 'No More Rounds!';
let startingText = 'Starting in 5 seconds!';
let getReadyText = 'Get Ready!';
let pressStartText = 'Press START';

function startCountdown() {

	const time1 = parseInt(document.getElementById("inputTime1").value);
	const time2 = parseInt(document.getElementById("inputTime2").value);
	rounds = parseInt(document.getElementById("inputRounds").value);

	if (!audioContext) {
		audioContext = new(window.AudioContext || window.webkitAudioContext)();
	}

	if (!isNaN(time1) && !isNaN(time2) && !isNaN(rounds)) {

		loadAndPlayAudio(getReadyAudio);

		const startButton = document.querySelector('button[onclick="startCountdown()"]');

		const stopButton = document.querySelector('button[onclick="stopCountdown()"]');

		const dropDownMenu = document.getElementById("language-select");

		startButton.disabled = true;

		stopButton.disabled = true;

		dropDownMenu.disabled = true;

		document.querySelector('.cueworkout').textContent = startingText;

		document.querySelector('.cuerounds').textContent = getReadyText;


		setTimeout(() => {
			totalTime1 = time1;
			totalTime2 = time2;
			remainingTime = totalTime1;
			currentCooldown = 1;
			updateCountdownDisplay();
			countdownInterval = setInterval(updateTimer, 1000);
			loadAndPlayAudio(startAudio)
			stopButton.disabled = false
			document.querySelector('.cueworkout').textContent = startText;
			document.querySelector('.cuerounds').textContent = roundsText + rounds;
		}, 5000);
	} else {
		alert("Please enter valid numbers for times and rounds.");
	}
}

// Add an event listener to the rounds input field to allow only whole numbers
document.getElementById("inputTime1").addEventListener("input", function(event) {
	this.value = this.value.replace(/[^\d]/g, ''); // Allow only digits
});

// Add an event listener to the rounds input field to allow only whole numbers
document.getElementById("inputTime2").addEventListener("input", function(event) {
	this.value = this.value.replace(/[^\d]/g, ''); // Allow only digits
});

// Add an event listener to the rounds input field to allow only whole numbers
document.getElementById("inputRounds").addEventListener("input", function(event) {
	this.value = this.value.replace(/[^\d]/g, ''); // Allow only digits
});

function updateTimer() {
	remainingTime--;

	if (remainingTime === 10) {
		loadAndPlayAudio(tenSecondsAudio);
	}

	if (remainingTime <= 5 && remainingTime > 0) {

		loadAndPlayAudio("sound/count.mp3");
	}

	if (remainingTime >= 0) {
		updateCountdownDisplay();
	} else {
		switchCooldown();
	}
}

function switchCooldown() {

	const startButton = document.querySelector('button[onclick="startCountdown()"]');

	const dropDownMenu = document.getElementById("language-select");

	if (currentCooldown === 1) {

		if (rounds > 1) {

			remainingTime = totalTime2;
			currentCooldown = 2;

			loadAndPlayAudio(restAudio);

			document.querySelector('.cueworkout').textContent = restText;

			rounds--;

			document.querySelector('.cuerounds').textContent = roundsText + rounds;

		} else {

			clearInterval(countdownInterval);
			remainingTime = 0;

			loadAndPlayAudio(finishAudio);

			startButton.disabled = false;

			dropDownMenu.disabled = false;

			document.querySelector('.cueworkout').textContent = finishText;
			document.querySelector('.countdown').textContent = '00:00:00';
			document.querySelector('.cuerounds').textContent = noMoreRoundsText;
		}

	} else if (currentCooldown === 2) {

		remainingTime = totalTime1;
		currentCooldown = 1;

		loadAndPlayAudio(startAudio);

		document.querySelector('.cueworkout').textContent = startText;

	}

	updateCountdownDisplay();
}

function updateCountdownDisplay() {
	const hours = Math.floor(remainingTime / 3600);
	const minutes = Math.floor((remainingTime % 3600) / 60);
	const seconds = remainingTime % 60;

	const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	document.querySelector('.countdown').textContent = formattedTime;
}

function stopCountdown() {

	const startButton = document.querySelector('button[onclick="startCountdown()"]');

	const dropDownMenu = document.getElementById("language-select");

	clearInterval(countdownInterval);
	totalTime1 = 0;
	totalTime2 = 0;
	remainingTime = 0;
	rounds = 0;
	currentCooldown = 1;
	document.querySelector('.countdown').textContent = '00:00:00';
	document.querySelector('.cueworkout').textContent = pressStartText;
	document.querySelector('.cuerounds').textContent = pressStartText;

	startButton.disabled = false;

	dropDownMenu.disabled = false;
}

function loadAndPlayAudio(audioFilePath) {
	fetch(audioFilePath)
		.then(response => response.arrayBuffer())
		.then(buffer => {
			audioContext.decodeAudioData(buffer, decodedData => {
				let source = audioContext.createBufferSource();
				source.buffer = decodedData;
				source.connect(audioContext.destination);
				source.start(0);
			});
		})
		.catch(error => {
			console.error('Error loading audio file:', error);
		});
}

function changeLanguage() {
	const select = document.getElementById("language-select");
	const selectedValue = select.value;

	if (selectedValue === "en") {
		startAudio = "sound/start_en.mp3";
		restAudio = "sound/rest_en.mp3";
		finishAudio = "sound/finish_en.mp3";
		tenSecondsAudio = "sound/10_seconds_en.mp3";
		getReadyAudio = "sound/getReady_en.mp3";

		startText = 'Start!';
		restText = 'Rest!';
		roundsText = 'Rounds Remaining: ';
		finishText = 'Finish!';
		noMoreRoundsText = 'No More Rounds!';
		startingText = 'Starting in 5 seconds!';
		getReadyText = 'Get Ready!';
		pressStartText = 'Press START';

		document.querySelector('.cueworkout').textContent = pressStartText;
		document.querySelector('.cuerounds').textContent = pressStartText;
		document.querySelector('label[for="inputTime1"]').textContent = 'Activity Time:';
		document.querySelector('label[for="inputTime2"]').textContent = 'Resting Time:';
		document.querySelector('label[for="inputRounds"]').textContent = 'Number of Rounds:';
		document.getElementById("inputTime1").placeholder = 'in seconds';
		document.getElementById("inputTime2").placeholder = 'in seconds';
		document.getElementById("inputRounds").placeholder = '';
		document.querySelectorAll('.button-container button')[0].textContent = 'START';
		document.querySelectorAll('.button-container button')[1].textContent = 'STOP';

	} else if (selectedValue === "pt") {
		startAudio = "sound/start_pt.mp3";
		restAudio = "sound/rest_pt.mp3";
		finishAudio = "sound/finish_pt.mp3";
		tenSecondsAudio = "sound/10_seconds_pt.mp3";
		getReadyAudio = "sound/getReady_pt.mp3";

		startText = 'Começa!';
		restText = 'Descanço!';
		roundsText = 'Rodadas Restantes: ';
		finishText = 'Finalizado!';
		noMoreRoundsText = 'Sem Mais Rodadas!';
		startingText = 'Começando em 5 segundos!';
		getReadyText = 'Prepare-se!';
		pressStartText = 'Pressione INICIAR';

		document.querySelector('.cueworkout').textContent = pressStartText;
		document.querySelector('.cuerounds').textContent = pressStartText;
		document.querySelector('label[for="inputTime1"]').textContent = 'Tempo de Atividade:';
		document.querySelector('label[for="inputTime2"]').textContent = 'Tempo de Descanso:';
		document.querySelector('label[for="inputRounds"]').textContent = 'Número de Rodadas:';
		document.getElementById("inputTime1").placeholder = 'em segundos';
		document.getElementById("inputTime2").placeholder = 'em segundos';
		document.getElementById("inputRounds").placeholder = '';
		document.querySelectorAll('.button-container button')[0].textContent = 'INICIAR';
		document.querySelectorAll('.button-container button')[1].textContent = 'PARAR';
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const languageSelect = document.getElementById("language-select");

	languageSelect.addEventListener("change", () => {
		changeLanguage();
	});
});

document.addEventListener("DOMContentLoaded", function() {
	const select = document.getElementById("language-select");
	select.value = "en";
});
