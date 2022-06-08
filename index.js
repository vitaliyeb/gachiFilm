const ffmpeg = require("fluent-ffmpeg");
const play = require('./play');
const {getVideoDurationInSeconds} = require('get-video-duration')
const pathToFfmpeg = require("ffmpeg-static");
const fs = require('fs');
const crypto = require('crypto');
const path = require("path");

ffmpeg.setFfmpegPath(pathToFfmpeg);

getVideoDurationInSeconds('./public/gachi.mp4').then(async (duration) => {
    const config = {
        fps: 15,
        size: 70
    }
    const source = './public/gachi.mp4';
    let lastHash = null;
    let currentHash = crypto.createHash('md5').update(`${source}${duration}${config.fps}${config.size}`).digest('hex');
    let fileNames = [];

    try {
        lastHash = fs.readFileSync('./.cache.txt', 'utf8')
    } catch {};

    if (lastHash === currentHash) {
        play(config)
    } else {
        fs.writeFileSync("./.cache.txt", currentHash);
        ffmpeg({source})
            .on('filenames', (filenames) => fileNames = filenames)
            .on('end', () => play(config))
            .on('error', (err) => {
                console.log('Error', err)
            })
            .takeScreenshots({
                filename: '%s_page.jpg',
                timemarks: Array.from({length: Math.floor(duration * config.fps)}).map((_, i) => 1 / config.fps * i)
            }, 'screens');
    }
})
