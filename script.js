let countdownInterval;
let totalTime1 = 0;
let totalTime2 = 0;
let remainingTime = 0;
let laps = 0;
let currentCooldown = 1;

// Preloading audio files
const countAudio = new Audio('sound/count.mp3');
const tenSeconds = new Audio('sound/10_seconds.mp3');
const beepAudio = new Audio('sound/beep.mp3');
const finishAudio = new Audio('sound/finish.mp3');

const startAudio = new Audio('sound/start.mp3');
const restAudio = new Audio('sound/rest.mp3');

function startCountdown() {
	
  const startButton = document.querySelector('button[onclick="startCountdown()"]');
	
  const time1 = parseInt(document.getElementById("inputTime1").value);
  const time2 = parseInt(document.getElementById("inputTime2").value);
  laps = parseInt(document.getElementById("inputLaps").value);

  if (!isNaN(time1) && !isNaN(time2) && !isNaN(laps)) {
    totalTime1 = time1;
    totalTime2 = time2;
    remainingTime = totalTime1;
    currentCooldown = 1;
    updateCountdownDisplay();

    countdownInterval = setInterval(updateTimer, 1000);
	
	startAudio.play()
	
	startButton.disabled = true; // Disable the Start button
	
  } else {
    alert("Please enter valid numbers for times and laps.");
  }
}

// Add an event listener to the laps input field to allow only whole numbers
document.getElementById("inputTime1").addEventListener("input", function(event) {
  this.value = this.value.replace(/[^\d]/g, ''); // Allow only digits
});

// Add an event listener to the laps input field to allow only whole numbers
document.getElementById("inputTime2").addEventListener("input", function(event) {
  this.value = this.value.replace(/[^\d]/g, ''); // Allow only digits
});

// Add an event listener to the laps input field to allow only whole numbers
document.getElementById("inputLaps").addEventListener("input", function(event) {
  this.value = this.value.replace(/[^\d]/g, ''); // Allow only digits
});

function updateTimer() {
  remainingTime--;
  
  if (remainingTime === 10) {
    
    tenSeconds.play();
  }

  if (remainingTime <= 5 && remainingTime > 0) {
    if (!countAudio.paused) {
      countAudio.pause();
      countAudio.currentTime = 0;
    }
    countAudio.play();
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
	  
    remainingTime = totalTime2;
    currentCooldown = 2;
	
	restAudio.play()
	
  } else if (currentCooldown === 2) {
	  
    laps--;

    if (laps > 0) {
      remainingTime = totalTime1;
      currentCooldown = 1;
	  
	  startAudio.play()
    } else {
      clearInterval(countdownInterval);
      remainingTime = 0;
	  finishAudio.play()
	  
      startButton.disabled = false; // Enable the Start button when laps end
    }
  }

  updateCountdownDisplay();
}

function updateCountdownDisplay() {
  const hours = Math.floor(remainingTime / 3600);
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = remainingTime % 60;

  const formattedTime = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  document.querySelector('.countdown').textContent = formattedTime;

  if (remainingTime === 0 && beepAudio.paused) {
    beepAudio.play();
  }
}

function stopCountdown() {
	
  const startButton = document.querySelector('button[onclick="startCountdown()"]');
	
  clearInterval(countdownInterval);
  totalTime1 = 0;
  totalTime2 = 0;
  remainingTime = 0;
  laps = 0;
  currentCooldown = 1;
  document.querySelector('.countdown').textContent = '0:00:00';
  
  startButton.disabled = false
}

// Function to stop playing audio
function stopAudio(audioElement) {
  audioElement.pause();
  audioElement.currentTime = 0;
}
