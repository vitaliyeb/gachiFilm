const path = require("path");
const asciify = require('asciify-image');
const player = require('play-sound')(opts = {});
const sharp = require('sharp');
const fs = require('fs');

module.exports = async ({ fps, size}) => {
    const frames = fs.readdirSync('./screens').filter(file => file.endsWith('.jpg'));
    frames.sort((a, b) => (parseFloat(a) - parseFloat(b)));

    player.play('public/gachi.mp4', {afplay: ['-r', '.85']}, function(err){
        if (err) throw err
    });

    async function* asyncIterator() {
        while (frames.length) {
            // await new Promise((res) => {
            //     setTimeout(() => res(), 1000/fps/4);
            // })
            const buffer = await sharp(path.join('screens', frames.shift()))
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
        process.stdout.write(ASCII);
    }
}
