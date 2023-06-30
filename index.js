import startAudio, { AudioVars, convertPeaks } from './audio.js';

const captureBtn = document.getElementById('capture');
const stopBtn = document.getElementById('stop');
const resultDisplay = document.querySelector('.results');

document.addEventListener('click', startAudio);
stopBtn.addEventListener('click', () => {
	if (!AudioVars.drawVisual) return;
	cancelAnimationFrame(AudioVars.drawVisual);
	AudioVars.drawVisual = false;
	console.log('stop');
});
captureBtn.addEventListener('click', () => {
	if (!AudioVars.drawVisual || !AudioVars.dataArray) return;
	resultDisplay.innerText = convertPeaks(AudioVars.dataArray);
});
