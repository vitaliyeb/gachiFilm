const fs = require('fs');
const path = require('path');


fs.readdir('./screens', (err, files) => {
    if (err) throw err;

    for (const file of files) {
        fs.unlink(path.join('./screens', file), err => {
            if (err) throw err;
        });
    }
});
