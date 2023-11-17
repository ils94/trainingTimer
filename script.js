let countdownInterval;
let totalTime1 = 0;
let totalTime2 = 0;
let remainingTime = 0;
let rounds = 0;
let currentCooldown = 1;

let audio = new Audio(); // Single audio object

function startCountdown() {
	const startButton = document.querySelector('button[onclick="startCountdown()"]');
	
	const stopButton = document.querySelector('button[onclick="stopCountdown()"]');
	
	startButton.disabled = true; // Disable the Start button
	
	stopButton.disabled = true

	const time1 = parseInt(document.getElementById("inputTime1").value);
	const time2 = parseInt(document.getElementById("inputTime2").value);
	rounds = parseInt(document.getElementById("inputRounds").value);

	document.querySelector('.cueworkout').textContent = 'Starting in 5 seconds!';

	if (!isNaN(time1) && !isNaN(time2) && !isNaN(rounds)) {
		setTimeout(() => {
			totalTime1 = time1;
			totalTime2 = time2;
			remainingTime = totalTime1;
			currentCooldown = 1;
			updateCountdownDisplay();
			countdownInterval = setInterval(updateTimer, 1000);
			playAudio(audio, "sound/start.mp3")
			stopButton.disabled = false
			document.querySelector('.cueworkout').textContent = 'Workout!';
			document.querySelector('.cuerounds').textContent = 'Rounds Remaining: ' + rounds;
		}, 5000); // 5000 milliseconds = 5 seconds
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
		playAudio(audio, "sound/10_seconds.mp3")
	}

	if (remainingTime <= 5 && remainingTime > 0) {
		
		if (!audio.paused) {
			audio.pause();
			audio.currentTime = 0;
		}
		
		playAudio(audio, "sound/count.mp3")
	}

	if (remainingTime >= 0) {
		updateCountdownDisplay();
	} else {
		switchCooldown();
	}
}

function switchCooldown() {

	const startButton = document.querySelector('button[onclick="startCountdown()"]');

	if (currentCooldown === 1) {

		if (rounds > 1) {

			remainingTime = totalTime2;
			currentCooldown = 2;

			playAudio(audio, "sound/rest.mp3")

			document.querySelector('.cueworkout').textContent = 'Rest!';

			rounds--;

			document.querySelector('.cuerounds').textContent = 'Rounds Remaining: ' + rounds;

		} else {

			clearInterval(countdownInterval);
			remainingTime = 0;
			
			playAudio(audio, "sound/finish.mp3")

			startButton.disabled = false; // Enable the Start button when rounds end

			document.querySelector('.cueworkout').textContent = 'Finish!';
			document.querySelector('.countdown').textContent = '0:00:00';
			document.querySelector('.cuerounds').textContent = 'No More Rounds!'
		}

	} else if (currentCooldown === 2) {

		remainingTime = totalTime1;
		currentCooldown = 1;

		playAudio(audio, "sound/start.mp3")

		document.querySelector('.cueworkout').textContent = 'Workout!';

	}

	updateCountdownDisplay();
}

function updateCountdownDisplay() {
	const hours = Math.floor(remainingTime / 3600);
	const minutes = Math.floor((remainingTime % 3600) / 60);
	const seconds = remainingTime % 60;

	const formattedTime = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	document.querySelector('.countdown').textContent = formattedTime;

	if (remainingTime === 0 && audio.paused) {
		
		playAudio(audio, "sound/beep.mp3")
	}
}

function stopCountdown() {

	const startButton = document.querySelector('button[onclick="startCountdown()"]');

	clearInterval(countdownInterval);
	totalTime1 = 0;
	totalTime2 = 0;
	remainingTime = 0;
	rounds = 0;
	currentCooldown = 1;
	document.querySelector('.countdown').textContent = '0:00:00';
	document.querySelector('.cueworkout').textContent = 'Press START'
	document.querySelector('.cuerounds').textContent = 'Press START'
	
	stopAudio(audio)

	startButton.disabled = false
}

function playAudio(audioElement, audioFilePath) {
    audioElement.src = audioFilePath;
    audioElement.play();
}

function stopAudio(audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
}
