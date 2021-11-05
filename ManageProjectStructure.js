const { mkdir, move, writeFile, readFile, deleteFile, listFiles } = require('./PromisifedFunctions');
const args = require('./ManageArgs')
const path = require('path');

const projectTypesEnum = args.projectTypes;
const projectPlansEnum = args.projectPlans;
const projectActionsEnum = args.projectActions;

manageDirectories();

async function manageDirectories() {
    const params = await args.getParams();
    const baseDirectory = setBaseDirectory(params.data, params.type, params.name);
    switch (params.action) {
        case projectActionsEnum.TRIM:
            await deleteUnusedMarkdowns(baseDirectory);
            break;
        case projectActionsEnum.PAD:
            await writeAdditionalManager(baseDirectory, params.plan, params.data);
            break;
        case projectActionsEnum.CREATE:
            await createProject(baseDirectory, params.type, params.name);
            break;
        default:
            throw 'Invalid project action provided';
    }
}

async function createProject(baseDirectory, projectType, projectName) {
    switch (projectType) {
        case projectTypesEnum.UNITY:
            await createUnityProject(baseDirectory, projectName);
            break;
        case projectTypesEnum.BLENDER:
            await createBlenderProject(baseDirectory);
            break;
        default:
            throw 'Invalid project type provided';
    }
}

async function createUnityProject(baseDirectory, projectName) {
    await makeDirectory(baseDirectory, 'Exports');
    await makeDirectory(baseDirectory, 'Notes', ['dev']);
    await makeDirectory(baseDirectory, 'Notes', ['images']);
    await writeAdditionalMarkdowns(baseDirectory, 30);
    const gitignoreText = `.vscode\nMaterials\nPrefabs\nScenes\nSounds\nSprites\nTextMesh Pro\n*.meta\nLibrary\nLogs\nPackages\nProjectSettings\nTemp\nUserSettings\nAssembly-CSharp.*\n${projectName}.*`
    await makeFile(baseDirectory, '.gitignore', gitignoreText);
}

async function createBlenderProject(baseDirectory) {
    await makeDirectory(baseDirectory, 'Notes', ['dev']);
    await makeDirectory(baseDirectory, 'Notes', ['images']);
    await makeDirectory(baseDirectory, 'Projects');
    await writeAdditionalMarkdowns(baseDirectory, 30);
    await writeAdditionalProjects(baseDirectory, 2);
}

async function deleteUnusedMarkdowns(baseDirectory) {
    const updatedBaseDirectory = baseDirectory.concat(['Notes', 'dev'])
    const fileList = await getFilesFromDir(updatedBaseDirectory);
    fileList.map(async (fileName) => {
        await removeFile(updatedBaseDirectory, fileName);
    });
}

async function writeAdditionalManager(baseDirectory, plan, amount) {
    switch (plan) {
        case projectPlansEnum.MD:
            await writeAdditionalMarkdowns(baseDirectory, amount)
            break;
        case projectPlansEnum.PROJECTS:
            await writeAdditionalProjects(baseDirectory, amount)
            break;
        default:
            throw 'Invalid plan provided'
    }
}

async function writeAdditionalMarkdowns(baseDirectory, amount) {
    const updatedBaseDirectory = baseDirectory.concat(['Notes', 'dev']);
    const fileList = await getFilesFromDir(updatedBaseDirectory);
    if (fileList) {
        const offset = fileList.length;
        [...Array(amount).keys()].map(async (key) => {
            const updatedKey = offset + key;
            const paddedNumber = (updatedKey + 1).toString().padStart(2, '0');
            const devText = `# DEV-${paddedNumber},\n#### Tags: []`;
            await makeFile(updatedBaseDirectory, `DEV-${paddedNumber}.md`, devText);
        });
    }
}

async function writeAdditionalProjects(baseDirectory, amount) {
    const updatedBaseDirectory = baseDirectory.concat(['Projects']);
    const fileList = await getFilesFromDir(updatedBaseDirectory);
    if (fileList) {
        const offset = fileList.length;
        [...Array(amount).keys()].map(async (key) => {
            const updatedKey = offset + key;
            const paddedNumber = (updatedKey).toString().padStart(2, '0');
            const name = offset == 0 && key == 0? 'PROJ-PLAYGROUND': `PROJ-${paddedNumber}`
            await makeDirectory(updatedBaseDirectory, name, ['references']);
            await makeDirectory(updatedBaseDirectory, name, ['textures']);
            await makeDirectory(updatedBaseDirectory, name, ['pieces', 'blend']);
            await makeDirectory(updatedBaseDirectory, name, ['pieces', 'exports']);
            await makeDirectory(updatedBaseDirectory, name, ['whole']);
        });
    }
}

function setBaseDirectory(_baseDirectory, projectType, projectName) {
    let baseDirectory;

    switch (projectType) {
        case projectTypesEnum.UNITY:
            baseDirectory = baseDirectory = ['..', 'unity', projectName.toLowerCase()];
            break;
        case projectTypesEnum.BLENDER:
            baseDirectory = baseDirectory = ['..', 'blender', projectName.toLowerCase()];
            break;
        default:
            throw 'Invalid project type provided';
    }
    return baseDirectory;
}

async function makeDirectory(base, dir, subdir = []) {
    const destination = path.join(...base, dir, ...subdir);
    await mkdir(dir);
    await move(dir, destination);
}

async function makeFile(base, file, content) {
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

async function getFilesFromDir(base) {
    const destination = path.join(...base);
    return listFiles(destination);
}