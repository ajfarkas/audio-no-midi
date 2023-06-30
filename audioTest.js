let started = false;
let source;

document.addEventListener('click', () => {
if (started) return;
started = true;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const analyzer = audioCtx.createAnalyser();
analyzer.fftSize = 2048;

const bufferLength = analyzer.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
analyzer.getByteTimeDomainData(dataArray);

// Get a canvas defined with ID "oscilloscope"
const canvas = document.getElementById("visualizer");
const canvasCtx = canvas.getContext("2d");

// draw an oscilloscope of the current audio source

function draw() {
  requestAnimationFrame(draw);

  analyzer.getByteTimeDomainData(dataArray);

  canvasCtx.fillStyle = "rgb(200, 200, 200)";
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = "rgb(0, 0, 0)";

  canvasCtx.beginPath();

  const sliceWidth = (canvas.width * 1.0) / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * canvas.height) / 2;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}

navigator.mediaDevices.
    getUserMedia({ audio: true })
      .then(stream => {
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyzer);
        draw();
      })
      .catch(err => {
        console.error('Error in GUM', err);
      });
});
