const { mkdir, move, rename, writeFile, readFile, deleteFile, listFiles, prompt } = require('./PromisifedFunctions');
const { platforms } = require('./Enums');
const path = require('path');

function setBaseDirectory(platformName) {
    let baseDirectory;

    switch (platformName) {
        case platforms.UNITY:
            baseDirectory = ['..', platforms.UNITY];
            break;
        case platforms.BLENDER:
            baseDirectory = ['..', platforms.BLENDER];
            break;
        case platforms.PHOTOSHOP:
            baseDirectory = ['..', platforms.PHOTOSHOP];
            break;
        case platforms.MATH:
            baseDirectory = ['..', platforms.MATH];
            break;
        case platforms.SUBSTANCE_PAINTER:
            baseDirectory = ['..', platforms.SUBSTANCE_PAINTER];
            break;
        default:
            throw `[setBaseDirectory]: Invalid platform provided: ${platform.id}`;;
    }
    return baseDirectory;
}

async function makeDirectory(base, dir, subdir = []) {
    const destination = path.join(...base, dir, ...subdir);
    await mkdir(dir);
    await move(dir, destination);
}

async function makeFile(base = [], file, content) {
    const destination = path.join(...base, file);
    await writeFile(file, content);
    await move(file, destination);
}

async function removeFile(base, file) {
    const destination = path.join(...base, file);
    const data = await readFile(destination);
    if (data.includes('#### Tags: []')) {
        return deleteFile(destination);
    }
}

async function renameFile(currPath, newPath){
    await rename(path.join(...currPath), path.join(...newPath));
}

async function getFilesFromDirectory(base) {
    const destination = path.join(...base);
    return listFiles(destination);
}

async function getDirFromDirectory(base) {
    const fileList = await getFilesFromDirectory(base);
    return fileList.filter((file) => !file.includes("."));
}

async function stateQuestion(statement, options){
    console.clear();
    const displayOptions = "(Options below):\n" + options.toString().split(',').join('\n');
    const value = await prompt(`\n${statement} : ${displayOptions}\n\n`);
    return value;
}

exports.setBaseDirectory = setBaseDirectory;
exports.makeDirectory = makeDirectory;
exports.makeFile = makeFile;
exports.removeFile = removeFile;
exports.getFilesFromDirectory = getFilesFromDirectory;
exports.getDirFromDirectory = getDirFromDirectory;
exports.stateQuestion = stateQuestion;
exports.renameFile = renameFile;