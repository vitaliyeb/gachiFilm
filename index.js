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
        size: 70,
        fileNames: fs.readdirSync('./screens').filter(file => file.endsWith('.jpg'))
    }
    const source = './public/gachi.mp4';
    let lastHash = null;
    let currentHash = crypto.createHash('md5').update(`${source}${duration}${config.fps}${config.size}`).digest('hex');
    lastHash = fs.readFileSync('./.cache.txt', 'utf8')

    if (lastHash === currentHash && config.fileNames.length) play(config);
    else {
        config.fileNames.forEach(file => fs.unlinkSync(path.join('./screens', file)))
        ffmpeg({source})
            .on('filenames', (filenames) => config.filenames = filenames)
            .on('end', () => {
                fs.writeFileSync("./.cache.txt", currentHash);
                play(config);
            })
            .on('error', (err) => {
                console.log('Error', err)
            })
            .takeScreenshots({
                filename: '%s_page.jpg',
                timemarks: Array.from({length: Math.floor(duration * config.fps)}).map((_, i) => 1 / config.fps * i)
            }, 'screens');
    }
})
