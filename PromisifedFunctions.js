const fs = require('fs-extra');
exports.mkdir = (name, options = { recursive: true }) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(name, options, (err) => {
            if(err) reject(err);
            else {
                console.log(`Created new directory ${name}`);
                resolve();
            }
        })
    })
}

exports.move = (name, destination, options = { overwrite: false }) => {
    return new Promise((resolve, reject) => {
        fs.move(name, destination, options, (err) => {
            if(err) reject(err);
            else{
                console.log(`Moved directory at ${destination}`);
                resolve();
            } 
        })
    })
}
exports.writeFile = (name, content = '') => {
    return new Promise((resolve, reject) => {
        fs.writeFile(name, content, (err) => {
            if (err) reject(err);
            else{
                console.log(`Created ${name}`);
                resolve();
            }
        })
    })
}