'use strict';

const videoEl = document.querySelector('video');
const audioEl = document.querySelector('audio');

const canvasEl = document.querySelector('canvas');
const ctx = canvasEl.getContext('2d');
const strip = document.querySelector('.strip');

const btnCapture = document.querySelector('button');

const createLinkEl = function (data) {
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="Handsome">`;
  strip.insertBefore(link, strip.firstChild);
};

const addRedEffect = function (pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100;
    pixels.data[i + 1] = pixels.data[i + 1] - 50;
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
  }

  return pixels;
};

const splitRgb = function (pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0];
    pixels.data[i + 500] = pixels.data[i + 1];
    pixels.data[i - 550] = pixels.data[i + 2];
  }

  return pixels;
};

let stream;
const startWebcam = async function () {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    videoEl.srcObject = stream;
    videoEl.play();
  } catch (err) {
    console.error('Error accesing webcam!', err);
  }
};

const paintToCanvas = function () {
  const width = videoEl.videoWidth;
  const height = videoEl.videoHeight;
  canvasEl.width = width;
  canvasEl.height = height;

  return setInterval(() => {
    ctx.drawImage(videoEl, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height);

    // pixels = addRedEffect(pixels);

    // pixels = splitRgb(pixels);
    // ctx.globalAlpha = 0.1;

    ctx.putImageData(pixels, 0, 0);
  }, 16);
};

const capturePhoto = function () {
  audioEl.currentTime = 0;
  audioEl.play();

  const data = canvasEl.toDataURL('image/jpeg');
  createLinkEl(data);
};

startWebcam();
videoEl.addEventListener('canplay', paintToCanvas);
btnCapture.addEventListener('click', capturePhoto);
