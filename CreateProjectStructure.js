//bring in fs
const { mkdir, move, writeFile } = require('./PromisifedFunctions');
const params = require('./ManageArgs').getParams();
const path = require('path');

CreateDirectories(params.projectName, params.destination);

async function CreateDirectories(projectName, destination){
    const baseDirectory = setBaseDirectory(projectName, destination);
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

function setBaseDirectory(projectName, _baseDirectory){
    let baseDirectory;
    if(!_baseDirectory){
        baseDirectory = ['..', projectName.toLowerCase()];
    }else{
        baseDirectory = [_baseDirectory, projectName.toLowerCase()];
    }
    return baseDirectory;
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









