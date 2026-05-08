import { FFmpeg } from 'https://unpkg.com/@ffmpeg/ffmpeg@0.12.6/dist/umd/ffmpeg.js';
import { fetchFile, toBlobURL } from 'https://unpkg.com/@ffmpeg/util@0.12.1/dist/umd/index.js';

const ffmpeg = new FFmpeg();
const player = document.getElementById('player');
const uploader = document.getElementById('uploader');
const status = document.getElementById('status');
const loader = document.getElementById('loader');

// Load FFmpeg Engine
const loadEngine = async () => {
    status.innerText = "Loading AI Engine...";
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    status.innerText = "Engine Ready ✅";
};

loadEngine();

// Handle File Upload
uploader.onchange = async (e) => {
    const file = e.target.files[0];
    player.src = URL.createObjectURL(file);
    status.innerText = "Video Loaded. Ready to Edit.";
};

// Simple AI Filter (B&W) Logic
document.getElementById('btn-bw').onclick = async () => {
    const file = uploader.files[0];
    if(!file) return alert("Pehle video select karein!");

    loader.style.display = "block";
    status.innerText = "Processing Filter...";

    await ffmpeg.writeFile('input.mp4', await fetchFile(file));
    
    // FFmpeg command for B&W
    await ffmpeg.exec(['-i', 'input.mp4', '-vf', 'format=gray', 'output.mp4']);

    const data = await ffmpeg.readFile('output.mp4');
    player.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    
    loader.style.display = "none";
    status.innerText = "Filter Applied!";
};
