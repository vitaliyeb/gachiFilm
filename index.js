const ffmpeg = require("fluent-ffmpeg");
const { getVideoDurationInSeconds } = require('get-video-duration')
const pathToFfmpeg = require("ffmpeg-static");
const sharp = require('sharp');
const fs = require('fs');

ffmpeg.setFfmpegPath(pathToFfmpeg);


getVideoDurationInSeconds('./public/gachi.mp4').then(async (duration) => {
    const ASCII_CHARS = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ".split("");
    let charLength = ASCII_CHARS.length;
    let interval = charLength / 256;
    let size = 1000;

    const image = await sharp('./screens/1_page.jpg')
        // .sharpen({ sigma: 20 })
        .gamma()
        .grayscale()
        .resize(size, size,{fit: "fill"});
    image.toFile('output.jpg');

    // const pixels = await image.raw().toBuffer();
    //
    // const ASCII = pixels.reduce((acc, pixel, idx) =>
    //     acc+=`${ASCII_CHARS[Math.floor(pixel * interval)]} ${(++idx%size) ? '' : '\n'}`, "")
    //
    //
    // fs.writeFile("./output.txt", ASCII, () => {
    //     console.log("done");
    // });

    // ffmpeg({ source: './public/gachi.mp4' })
    //     .on('filenames', (filenames) => {
    //         console.log('Created file names', filenames);
    //     })
    //     .on('end', () => {
    //         console.log('Job done');
    //     })
    //     .on('error', (err) => {
    //         console.log('Error', err);
    //     })
    // .takeScreenshots({
    //     filename: '%s_page.jpg',
    //     timemarks: Array.from({length: Math.floor(duration)}).map((_, i)=> i+1)
    // }, 'screens');
})
