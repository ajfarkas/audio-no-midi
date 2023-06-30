
const canvas = document.getElementById('visualizer');
const canvasCtx = canvas.getContext('2d');
const constraints = { audio: true };
const frequencyData = {};
let analyzer;
let source;
let bufferLength;

export const AudioVars = {
	dataArray: null,
	drawVisual: null
};

export const startAudio = () => {
	const audioCtx = new AudioContext();
	analyzer = audioCtx.createAnalyser();
	analyzer.minDecibels = -90;
	analyzer.maxDecibels = -10;
	analyzer.smoothingTimeConstant = 0.85;

	const visualize = () => {
		const { width, height } = canvas;
		canvasCtx.clearRect(0, 0, width, height);

		source.connect(analyzer);

		analyzer.fftSize = 2048;
		bufferLength = analyzer.frequencyBinCount;
		AudioVars.dataArray = new Uint8Array(bufferLength);
		frequencyData.sampleRate = audioCtx.sampleRate;
		frequencyData.arrayLen = bufferLength;
		frequencyData.maxFrequency = audioCtx.sampleRate / 2;
		const frequencyInterval = frequencyData.maxFrequency / bufferLength;
		// frequency in Hz
		frequencyData.rateValues = new Array(bufferLength);
		for (let rv = 0; rv < bufferLength; rv++) {
			frequencyData.rateValues[rv] = frequencyInterval * (rv + 1);
		}

		const drawBars = () => {
			AudioVars.drawVisual = requestAnimationFrame(drawBars);
			analyzer.getByteFrequencyData(AudioVars.dataArray);

			canvasCtx.fillStyle = 'rgb(0,0,0)';
			canvasCtx.fillRect(0, 0, width, height);

			const barWidth = (width / bufferLength) * 2.5;
			let barHeight;
			let x = 0;

			for (let i = 0; i < bufferLength; i++) {
				barHeight = AudioVars.dataArray[i];
				canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
				canvasCtx.fillRect(
					x,
					height - barHeight / 2,
					barWidth,
					barHeight / 2
				);

				x += barWidth + 1;
			}
		};

		// const drawOscilloscope = () => {
		// 	AudioVars.drawVisual = requestAnimationFrame(drawOscilloscope);

		// 	analyzer.getByteTimeDomainData(AudioVars.dataArray);

		// 	canvasCtx.fillStyle = 'rgb(200,200,200)';
		// 	canvasCtx.fillRect(0, 0, width, height);

		// 	canvasCtx.lineWidth = 2;
		// 	canvasCtx.strokeStyle = 'rgb(0,0,0)';

		// 	canvasCtx.beginPath();

		// 	const sliceWidth = (canvas.width * 1.0) / bufferLength;
		// 	let x = 0;

		// 	for (let i = 0; i < bufferLength; i++) {
		// 		const v = AudioVars.dataArray[i] / 128.0;
		// 		const y = (v * height) / 2;

		// 		if (i === 0) {
		// 			canvasCtx.moveTo(x, y);
		// 		} else {
		// 			canvasCtx.lineTo(x, y);
		// 		}

		// 		x += sliceWidth;
		// 	}

		// 	canvasCtx.lineTo(width, height / 2);
		// 	canvasCtx.stroke();
		// };

		drawBars();
		// drawOscilloscope();
	};

	navigator.mediaDevices.
		getUserMedia(constraints)
		.then(stream => {
			source = audioCtx.createMediaStreamSource(stream);
			document.removeEventListener('click', startAudio);
			visualize();
		})
		.catch(err => {
			console.error('Error in GUM', err);
		});
};

// From https://newt.phys.unsw.edu.au/music/note/
// © Andrew Botros 2001, modified for style and use
const NOTES = [
	'C0', 'C#0', 'D0', 'D#0', 'E0', 'F0', 'F#0', 'G0', 'G#0', 'A0', 'A#0', 'B0',
	'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1',
	'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
	'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
	'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
	'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
	'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6',
	'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7',
	'C8', 'C#8', 'D8', 'D#8', 'E8', 'F8', 'F#8', 'G8', 'G#8', 'A8', 'A#8', 'B8',
	'C9', 'C#9', 'D9', 'D#9', 'E9', 'F9', 'F#9', 'G9', 'G#9', 'A9', 'A#9', 'B9'
];

export const frequencyToNote = (inputFreq, round = false) => {
	if (isNaN(inputFreq) || inputFreq < 27.5 || inputFreq > 14080) {
		throw new Error(`invalid frequency: ${inputFreq}`);
	}

	const A4 = 440.0;
	const A4_INDEX = NOTES.indexOf('A4');

	const MINUS = 0;
	const PLUS = 1;

	const r = Math.pow(2.0, 1.0 / 12.0);
	const cent = Math.pow(2.0, 1.0 / 1200.0);

	let frequency = A4;
	let rIndex = 0;
	let centIndex = 0;
	let side;

	if (inputFreq >= frequency) {
		while (inputFreq >= r * frequency) {
			frequency = r * frequency;
			rIndex++;
		}
		while (inputFreq > cent * frequency) {
			frequency = cent * frequency;
			centIndex++;
		}
		if ((cent * frequency - inputFreq) < (inputFreq - frequency)) {
			centIndex++;
		}
		if (centIndex > 50) {
			rIndex++;
			centIndex = 100 - centIndex;
			if (centIndex !== 0){
				side = MINUS;
			} else {
				side = null;
			}
		} else {
			side = PLUS;
		}
	} else {
		while (inputFreq <= frequency / r) {
			frequency = frequency / r;
			rIndex--;
		}
		while (inputFreq < frequency / cent) {
			frequency = frequency / cent;
			centIndex++;
		}
		if ((inputFreq - frequency / cent) < (frequency - inputFreq)) {
			centIndex++;
		}
		if (centIndex >= 50) {
			rIndex--;
			centIndex = 100 - centIndex;
			side = PLUS;
		} else if (centIndex !== 0) {
			side = MINUS;
		} else {
			side = null;
		}
	}

	let result = NOTES[A4_INDEX + rIndex];

	if (round) {
		return result;
	}
	if (side === PLUS) {
		result = result + ' plus ';
	} else if (side === MINUS) {
		result = result + ' minus ';
	}
	if (side !== null) {
		result = result + centIndex + ' cents';
	}
	return result;
};
// end © Andrew Botros 2001

// finds decibel peaks in AudioVars.dataArray
export const findPeaks = dBData => {
	const peaks = [];
	const dataLen = dBData.length;
	for (let i = 0; i < dataLen; i++) {
		const decibel = dBData[i];
		const isGTPrev = i === 0 || decibel > dBData[i - 1];
		const isGTNext = i === dataLen - 1 || decibel > dBData[i + 1];
		if (isGTPrev && isGTNext) {
			peaks.push(frequencyData.rateValues[i]);
		}
	}
	return peaks;
};
// convert array of decibel peaks to array of notes
export const convertPeaks = dBData => {
	const peaks = findPeaks(dBData);
	return peaks.map(peak => frequencyToNote(peak, true));
};

export default startAudio;
