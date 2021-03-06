﻿window.startQrReading = () => {

    var btnScan = document.getElementById("btnScan");

    var video = document.createElement("video");
    var canvasElement = document.getElementById("canvas");
    var canvas = canvasElement.getContext("2d");
    var loadingMessage = document.getElementById("loadingMessage");

    var frame;

    function drawLine(begin, end, color) {
        canvas.beginPath();
        canvas.moveTo(begin.x, begin.y);
        canvas.lineTo(end.x, end.y);
        canvas.lineWidth = 2;
        canvas.strokeStyle = color;
        canvas.stroke();
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", aspectRatio: 1 } }).then(function (stream) {
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // tell iOS safari we don't want fullscreen
        video.play();

        frame = requestAnimationFrame(tick);
    });

    function tick() {

        loadingMessage.innerText = "カメラを起動しています..."

        if (video.readyState === video.HAVE_ENOUGH_DATA) {

            btnScan.style.display = "none";

            canvasElement.hidden = false;

            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

            var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            var code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            if (code && code.data.length > 0) {
                drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
                drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
                drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
                drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");

                loadingMessage.innerHTML = '<b>Data: </b>' +  code.data;

                video.pause();
                btnScan.style.display = "inline-block";

                cancelAnimationFrame(frame);

                return;

            } else {
                loadingMessage.innerHTML = 'スキャニング...' + video.videoHeight + 'x' + video.videoWidth;
            }
        }

        requestAnimationFrame(tick);
    }
};