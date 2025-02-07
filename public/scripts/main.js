document.addEventListener('DOMContentLoaded', function() {
    const recordButton = document.getElementById('recordButton');
    const stopButton = document.getElementById('stopButton');
    const recognizedSpeech = document.getElementById('recognizedSpeech');

    let mediaRecorder;
    let audioChunks = [];
    let recognition;

    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
        recognition = new SpeechRecognition();
    } else {
        alert('Your browser does not support speech recognition.');
    }

    if (recognition) {
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            recognizedSpeech.innerHTML = `<strong>Final:</strong> ${finalTranscript}<br><strong>Interim:</strong> ${interimTranscript}`;
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event);
        };
    }

    recordButton.addEventListener('click', async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);

            // Send audioBlob to the backend for analysis
            const formData = new FormData();
            formData.append('audio', audioBlob);

            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            console.log(result);
        };

        mediaRecorder.start();
        recognition.start();
    });

    stopButton.addEventListener('click', () => {
        mediaRecorder.stop();
        recognition.stop();
    });
});