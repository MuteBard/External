const { mkdir, move, writeFile, readFile, deleteFile, listFiles } = require('./PromisifedFunctions');
const params = require('./ManageArgs').getParams();
const path = require('path');

ManageDirectories(params);

async function ManageDirectories(params){
    const baseDirectory = setBaseDirectory(params.projectName, params.destination);
    if(params.action === 'trim'){
        await DeleteUnusedMarkdowns(baseDirectory);
    }else{
        await CreateUnityProject(params.projectName, baseDirectory);
    }
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
    });
}

async function DeleteUnusedMarkdowns(baseDirectory){
    const updatedBaseDirectory = baseDirectory.concat(['Notes', 'dev'])
    const fileList = await getFilesFromDir(updatedBaseDirectory);
    fileList.map(async (fileName) => {
        await removeFile(updatedBaseDirectory, fileName);
    });
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

async function removeFile(base, file){
    const destination = path.join(...base,  file);
    const data = await readFile(destination);
    if (data.includes('#### Tags: []')){
        return deleteFile(destination);
    }
}

async function getFilesFromDir(base){
    const destination = path.join(...base);
    return listFiles(destination);
}













