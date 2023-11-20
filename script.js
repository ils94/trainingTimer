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
let breakTimeAudio = "sound/break_en.mp3";

let startText = 'Start!';
let restText = 'Rest!';
let roundsText = 'Rounds Remaining: ';
let finishText = 'Finish!';
let noMoreRoundsText = 'No More Rounds!';
let startingText = 'Starting in 5 seconds!';
let getReadyText = 'Get Ready!';
let pressStartText = 'Press START';
let breakTimeText = 'Break Time!';
let lockButtonsText = 'Lock Buttons';
let alertText = 'Please enter valid numbers for times and rounds.';

let pauseText = 'PAUSE';
let resumeText = 'RESUME';

let startButtonText = 'START';
let stopButtonText = 'STOP';

let stopMessage = 'Stop the Timer?';

let isPaused = false;
let started = false;

let isBreak = false;

let isButtonsLocked = false;

let startStopButton = document.querySelector('button[onclick="startStop()"]');
let pauseResumeButton = document.querySelector('button[onclick="pauseResume()"]');
let dropDownMenu = document.getElementById("language-select");
let lockButtons = document.getElementById("switchToggle");

let input1 = document.getElementById("inputTime1");
let input2 = document.getElementById("inputTime2");
let input3 = document.getElementById("inputTime3");

let inputRound = document.getElementById("inputRounds");

function startCountdown() {

	const time1 = parseInt(document.getElementById("inputTime1").value);
	const time2 = parseInt(document.getElementById("inputTime2").value);
	rounds = parseInt(document.getElementById("inputRounds").value);

	if (!audioContext) {
		audioContext = new(window.AudioContext || window.webkitAudioContext)();
	}

	if (!isNaN(time1) && !isNaN(time2) && !isNaN(rounds)) {

		document.querySelectorAll('.button-container button')[0].textContent = stopButtonText;

		started = true;

		loadAndPlayAudio(getReadyAudio);

		startStopButton.disabled = true;

		pauseResumeButton.disabled = true;

		dropDownMenu.disabled = true;

		input1.disabled = true;
		input2.disabled = true;
		input3.disabled = true;
		inputRound.disabled = true;
		lockButtons.disabled = true;

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

			if (isButtonsLocked) {

				startStopButton.disabled = true
				pauseResumeButton.disabled = true;
			} else {

				startStopButton.disabled = false
				pauseResumeButton.disabled = false;
			}

			lockButtons.disabled = false;

			document.querySelector('.cueworkout').textContent = startText;
			document.querySelector('.cuerounds').textContent = roundsText + rounds;
		}, 5000);
	} else {
		alert(alertText);
	}
}

document.getElementById("inputTime1").addEventListener("input", function(event) {
	this.value = this.value.replace(/[^\d]/g, ''); // Allow only digits
});

document.getElementById("inputTime2").addEventListener("input", function(event) {
	this.value = this.value.replace(/[^\d]/g, ''); // Allow only digits
});

document.getElementById("inputTime3").addEventListener("input", function(event) {
	this.value = this.value.replace(/[^\d]/g, ''); // Allow only digits
});

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

		if (isBreak) {

			isBreak = false;

			clearInterval(countdownInterval);

			startCountdown()
		} else {

			switchCooldown();
		}
	}
}

function switchCooldown() {

	if (currentCooldown === 1) {

		if (rounds > 1) {

			remainingTime = totalTime2;
			currentCooldown = 2;

			loadAndPlayAudio(restAudio);

			document.querySelector('.cueworkout').textContent = restText;

			rounds--;

			document.querySelector('.cuerounds').textContent = roundsText + rounds;

		} else {

			const time3 = parseInt(document.getElementById("inputTime3").value);

			if (time3) {

				isBreak = true;

				loadAndPlayAudio(breakTimeAudio);

				document.querySelector('.cueworkout').textContent = breakTimeText;
				document.querySelector('.cuerounds').textContent = breakTimeText;

				clearInterval(countdownInterval);

				remainingTime = time3;
				updateCountdownDisplay();
				countdownInterval = setInterval(updateTimer, 1000);

			} else {

				clearInterval(countdownInterval);
				remainingTime = 0;

				loadAndPlayAudio(finishAudio);

				dropDownMenu.disabled = false;

				started = false;
				isPaused = false;

				document.querySelectorAll('.button-container button')[0].textContent = startButtonText;
				document.querySelectorAll('.button-container button')[1].textContent = pauseText;

				pauseResumeButton.disabled = true;

				input1.disabled = false;
				input2.disabled = false;
				input3.disabled = false;
				inputRound.disabled = false;
				lockButtons.disabled = true;

				document.querySelector('.cueworkout').textContent = finishText;
				document.querySelector('.countdown').textContent = '00:00:00';
				document.querySelector('.cuerounds').textContent = noMoreRoundsText;
			}
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

	clearInterval(countdownInterval);
	totalTime1 = 0;
	totalTime2 = 0;
	remainingTime = 0;
	rounds = 0;
	currentCooldown = 1;

	isPaused = false;
	started = false;

	document.querySelectorAll('.button-container button')[1].textContent = pauseText;

	document.querySelector('.countdown').textContent = '00:00:00';
	document.querySelector('.cueworkout').textContent = pressStartText;
	document.querySelector('.cuerounds').textContent = pressStartText;

	pauseResumeButton.disabled = true;

	input1.disabled = false;
	input2.disabled = false;
	input3.disabled = false;
	inputRound.disabled = false;
	lockButtons.disabled = true;

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
		breakTimeAudio = "sound/break_en.mp3";

		startText = 'Start!';
		restText = 'Rest!';
		roundsText = 'Rounds Remaining: ';
		finishText = 'Finish!';
		noMoreRoundsText = 'No More Rounds!';
		startingText = 'Starting in 5 seconds!';
		getReadyText = 'Get Ready!';
		pressStartText = 'Press START';
		breakTimeText = 'Break Time!';

		pauseText = 'PAUSE';
		resumeText = 'RESUME';

		startButtonText = 'START';
		stopButtonText = 'STOP';

		lockButtonsText = 'Lock Buttons';

		stopMessage = 'Stop the Timer?';
		alertText = 'Please enter valid numbers for times and rounds.';

		document.querySelector('.cueworkout').textContent = pressStartText;
		document.querySelector('.cuerounds').textContent = pressStartText;
		document.querySelector('label[for="inputTime1"]').textContent = 'Activity Time:';
		document.querySelector('label[for="inputTime2"]').textContent = 'Resting Time:';
		document.querySelector('label[for="inputTime3"]').textContent = 'Break Time:';
		document.querySelector('label[for="inputRounds"]').textContent = 'Number of Rounds:';
		document.getElementById("inputTime1").placeholder = 'in seconds';
		document.getElementById("inputTime2").placeholder = 'in seconds';
		document.getElementById("inputTime3").placeholder = 'in seconds';
		document.querySelectorAll('.button-container button')[0].textContent = 'START';
		document.querySelectorAll('.button-container button')[1].textContent = 'PAUSE';

		document.querySelector('label[for="switchToggle"]').textContent = lockButtonsText;

	} else if (selectedValue === "pt") {
		startAudio = "sound/start_pt.mp3";
		restAudio = "sound/rest_pt.mp3";
		finishAudio = "sound/finish_pt.mp3";
		tenSecondsAudio = "sound/10_seconds_pt.mp3";
		getReadyAudio = "sound/getReady_pt.mp3";
		breakTimeAudio = "sound/break_pt.mp3";

		startText = 'Começa!';
		restText = 'Descanço!';
		roundsText = 'Rodadas Restantes: ';
		finishText = 'Finalizado!';
		noMoreRoundsText = 'Sem Mais Rodadas!';
		startingText = 'Começando em 5 segundos!';
		getReadyText = 'Prepare-se!';
		pressStartText = 'Pressione INICIAR';
		breakTimeText = 'Intervalo!';

		pauseText = 'PAUSAR';
		resumeText = 'RESUMIR';

		startButtonText = 'INICIAR';
		stopButtonText = 'PARAR';

		lockButtonsText = 'Travar Botões';

		stopMessage = 'Para o Cronômetros?';
		alertText = 'Insira números válidos para os tempos e rodadas.';
		
		document.querySelector('.cueworkout').textContent = pressStartText;
		document.querySelector('.cuerounds').textContent = pressStartText;
		document.querySelector('label[for="inputTime1"]').textContent = 'Tempo de Atividade:';
		document.querySelector('label[for="inputTime2"]').textContent = 'Tempo de Descanso:';
		document.querySelector('label[for="inputTime3"]').textContent = 'Tempo de Intervalo:';
		document.querySelector('label[for="inputRounds"]').textContent = 'Número de Rodadas:';
		document.getElementById("inputTime1").placeholder = 'em segundos';
		document.getElementById("inputTime2").placeholder = 'em segundos';
		document.getElementById("inputTime3").placeholder = 'em segundos';
		document.querySelectorAll('.button-container button')[0].textContent = 'INICIAR';
		document.querySelectorAll('.button-container button')[1].textContent = 'PAUSAR';

		document.querySelector('label[for="switchToggle"]').textContent = lockButtonsText;
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

function startStop() {

	if (started) {

		if (window.confirm(stopMessage)) {

			started = false;

			document.querySelectorAll('.button-container button')[0].textContent = startButtonText;

			stopCountdown();

		}
	} else {


		startCountdown();

	}

}

function pauseResume() {

	if (isPaused) {

		isPaused = false;

		remainingTime = pausedTime;
		currentCooldown = pausedCooldown;

		updateCountdownDisplay();
		countdownInterval = setInterval(updateTimer, 1000);

		document.querySelectorAll('.button-container button')[1].textContent = pauseText;

	} else {

		isPaused = true;

		document.querySelectorAll('.button-container button')[1].textContent = resumeText;

		pausedTime = remainingTime;
		pausedCooldown = currentCooldown;

		clearInterval(countdownInterval);
	}
}

function updateButtonStatus() {
	const switchToggle = document.getElementById("switchToggle");
	const startStopButton = document.querySelectorAll('.button-container button')[0];
	const pauseResumeButton = document.querySelectorAll('.button-container button')[1];

	if (switchToggle.checked) {
		startStopButton.disabled = true;
		pauseResumeButton.disabled = true;

		isButtonsLocked = true;

	} else {
		startStopButton.disabled = false;
		pauseResumeButton.disabled = false;

		isButtonsLocked = false;
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const switchToggle = document.getElementById("switchToggle");

	switchToggle.addEventListener("change", () => {
		updateButtonStatus();
	});

	updateButtonStatus();
});
