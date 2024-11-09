$(document).ready(function () {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureButton = document.getElementById('captureButton');
    const selectCameraButton = document.getElementById('selectCameraButton');
    const blackAndWhiteButton = document.getElementById('blackAndWhiteButton');
    const flipHorizontalButton = document.getElementById('flipHorizontalyButton');
    const flipVerticalButton = document.getElementById('flipVerticalyButton');
    const saveImageButton = document.getElementById('saveImageButton');
    const cameraSelector = document.getElementById('cameraSelector');
    const context = canvas.getContext('2d');
    let captured = false;
    let mode = "color";
    let isFlippedHorizontally = false;
    let isFlippedVertically = false;
    let currentStream = null;

    selectCamera();

    cameraSelector.addEventListener('change', (event) => {
        const selectedDeviceId = event.target.value;
        selectCamera(selectedDeviceId);
    });

    blackAndWhiteButton.addEventListener('click', () => {
        switchBlackAndWhite();
    });

    saveImageButton.addEventListener('click', () => {
        saveTransformedImage();
    });

    flipHorizontalButton.addEventListener('click', () => {
        isFlippedHorizontally = !isFlippedHorizontally;
        applyTransformations();
    });

    flipVerticalButton.addEventListener('click', () => {
        isFlippedVertically = !isFlippedVertically;
        applyTransformations();
    });

    captureButton.addEventListener('click', () => {
        captured = true;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        drawTransformedImage();
    });

    function selectCamera(deviceId) {
        if (currentStream) {
            const tracks = currentStream.getTracks();
            tracks.forEach(track => track.stop());
        }

        const constraints = {
            video: {
                deviceId: deviceId ? { exact: deviceId } : undefined
            }
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                currentStream = stream;
                video.srcObject = stream;
                captured = false;
                populateCameraSelector();
            })
            .catch((error) => {
                console.error('Error accessing the camera:', error);
                alert('Could not access the camera. Please allow camera access and try again.');
            });
    }

    function populateCameraSelector() {
        cameraSelector.innerHTML = '<option selected disabled>Select Camera</option>';
        
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                videoDevices.forEach(device => {
                    const option = document.createElement('option');
                    option.value = device.deviceId;
                    option.textContent = device.label || `Camera ${cameraSelector.length + 1}`;
                    cameraSelector.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error enumerating devices:', error);
            });
    }

    function applyTransformations() {
        let transform = "";
        if (isFlippedHorizontally) transform += "scaleX(-1) ";
        if (isFlippedVertically) transform += "scaleY(-1) ";
        video.style.transform = transform.trim();
    }

    function switchBlackAndWhite() {
        if (mode === "color") {
            mode = "blackAndWhite";
            blackAndWhiteButton.innerText = "Switch to Color";
            video.style.filter = "grayscale(100%)";
        } else {
            mode = "color";
            blackAndWhiteButton.innerText = "Switch to Black and White";
            video.style.filter = "none";
        }
    }

    function drawTransformedImage() {
        const aspectRatio = video.videoWidth / video.videoHeight;
        canvas.width = video.clientWidth;
        canvas.height = video.clientWidth / aspectRatio;

        context.save();

        context.scale(isFlippedHorizontally ? -1 : 1, isFlippedVertically ? -1 : 1);
        context.translate(isFlippedHorizontally ? -canvas.width : 0, isFlippedVertically ? -canvas.height : 0);

        if (mode === "blackAndWhite") {
            context.filter = "grayscale(100%)";
        } else {
            context.filter = "none";
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        context.restore();
    }

    function saveTransformedImage() {
        if (!captured) {
            alert('No image to save. Please take a picture first.');
            return;
        }
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = new Date().toLocaleString() + ".png";
        link.click();
    }

    populateCameraSelector();
});