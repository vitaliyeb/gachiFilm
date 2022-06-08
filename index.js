const ffmpeg = require("fluent-ffmpeg");
const {getVideoDurationInSeconds} = require('get-video-duration')
const pathToFfmpeg = require("ffmpeg-static");
const sharp = require('sharp');
const fs = require('fs');
const path = require("path");
const asciify = require('asciify-image');
const player = require('play-sound')(opts = {})

ffmpeg.setFfmpegPath(pathToFfmpeg);


getVideoDurationInSeconds('./public/gachi.mp4').then(async (duration) => {
    let fileNames = [];
    const fps = 10;
    const size = 70;
    ffmpeg({source: './public/gachi.mp4'})
        .on('filenames', (filenames) => fileNames = filenames)
        .on('end', async () => {
            player.play('public/gachi.mp4', function(err){
                if (err) throw err
            })

            async function* asyncIterator() {
                while (fileNames.length) {
                    await new Promise((res) => {
                        setTimeout(() => res(), 1000/fps/3);
                    })
                    const buffer = await sharp(path.join('screens', fileNames.shift()))
                        .resize(size, size, {fit: "fill"})
                        .png()
                        .toBuffer();
                    yield asciify(buffer, {
                        fit: 'box',
                        width: size,
                        height: size
                    });
                }
            }

            for await (let ASCII of asyncIterator()) {
                console.clear();
                console.log(ASCII);
            }
        })
        .on('error', (err) => {
            console.log('Error', err);
        })
        .takeScreenshots({
            filename: '%s_page.jpg',
            timemarks: Array.from({length: Math.floor(duration * fps)}).map((_, i) => 1/fps * i)
        }, 'screens');
})
