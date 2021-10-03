//bring in fs
const fs = require('fs-extra');
const args = {
    name: {
        command: process.argv.slice(2)[0],
        data: process.argv.slice(2)[1]
    },
    destination: {
        command: process.argv.slice(2)[2],
        data: process.argv.slice(2)[3]
    }
}

//Establish paths
const path = require('path');

//promisify
const mkdir = (name, options = { recursive: true }) => {
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

const move = (name, destination, options = { overwrite: false }) => {
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

const writeFile = (name, content = '') => {
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

async function makeDirectory(base, dir, subdir = []){
    const destination = path.join(...base, dir, ...subdir);
    await mkdir(dir);
    await move(dir, destination);
}

async function makeFile(base, file, content){
    const destination = path.join(...base, file);
    await writeFile(file, content);
    await move(file, destination);
}

function setBaseDirectory(projectName, _baseDirectory){
    let baseDirectory;
    if(!_baseDirectory){
        baseDirectory = ['..', projectName.toLowerCase()];
    }else{
        baseDirectory = [_baseDirectory, projectName.toLowerCase()];
    }
    return baseDirectory;
}

async function createBranchingDirectory(projectName, baseDirectory){
    await CreateUnityProject(projectName, baseDirectory);
}

async function CreateUnityProject(projectName, baseDirectory){
    //folders
    await makeDirectory(baseDirectory, 'Exports');
    await makeDirectory(baseDirectory, projectName);
    await makeDirectory(baseDirectory, 'Notes', ['dev']);
    await makeDirectory(baseDirectory, 'Notes', ['images']);

    //files
    const gitignoreText = `.vscode\nMaterials\nPrefabs\nScenes\nSounds\nSprites\nTextMesh Pro\n*.meta\nLibrary\nLogs\nPackages\nProjectSettings\nTemp\nUserSettings\nAssembly-CSharp.*\n${projectName}.*`
    await makeFile(baseDirectory, '.gitignore', gitignoreText);

    [...Array(30).keys()].map(async (key) => {
        const paddedNumber = (key+1).toString().padStart(2, '0');
        const devText = `# DEV-${paddedNumber},\n#### Tags: []`;
        const updatedBaseDirectory = baseDirectory.concat(['Notes', 'dev'])
        await makeFile(updatedBaseDirectory, `DEV-${paddedNumber}.md`, devText);
    })
}

async function ProcessArguments(args){
    if(args.name.command === '-name' || args.name.command === '-n'){
        const projectName = args.name.data;
        if(args.destination.command === '-dest' || args.destination.command === '-d'){
            const baseDirectory = setBaseDirectory(projectName, args.destination.data);
            createBranchingDirectory(projectName, baseDirectory);
        }else{
            const baseDirectory = setBaseDirectory(projectName);
            createBranchingDirectory(projectName, baseDirectory);
        }
        
    }else{
        console.log("Valid Project Name not provided", args);
    }
}


ProcessArguments(args)

