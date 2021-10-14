const { mkdir, move, writeFile, readFile, deleteFile, listFiles } = require('./PromisifedFunctions');
const args = require('./ManageArgs')
const path = require('path');

ManageDirectories();

async function ManageDirectories(){
    const params = await args.getParams();
    const baseDirectory = setBaseDirectory(params.data, params.name);
    switch(params.action) {
        case 'trim':
            await DeleteUnusedMarkdowns(baseDirectory);
            break;
        case 'pad':
            await WriteAdditionalMarkdowns(baseDirectory, params.data);
            break;
        default:
            await CreateUnityProject(baseDirectory, params.name);
            break;
    }
}

async function CreateUnityProject(baseDirectory, projectName){
    //folders
    await makeDirectory(baseDirectory, 'Exports');
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

async function WriteAdditionalMarkdowns(baseDirectory, amount){
    const updatedBaseDirectory = baseDirectory.concat(['Notes', 'dev'])
    const fileList = await getFilesFromDir(updatedBaseDirectory);
    if(fileList){
        const offset = fileList.length;
        [...Array(amount).keys()].map(async (key) => {
            const updatedKey = offset + key;
            const paddedNumber = (updatedKey+1).toString().padStart(2, '0');
            const devText = `# DEV-${paddedNumber},\n#### Tags: []`;
            await makeFile(updatedBaseDirectory, `DEV-${paddedNumber}.md`, devText);
        });
    }
}

function setBaseDirectory(_baseDirectory, projectName){
    let baseDirectory;
    if(_baseDirectory === 'dest'){
        baseDirectory = [_baseDirectory, projectName.toLowerCase()];
    }else{
        baseDirectory = ['..', projectName.toLowerCase()];
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














