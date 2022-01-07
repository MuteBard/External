const { makeDirectory, makeFile, removeFile, renameFile, getFilesFromDirectory } = require('./FileActions');
const { platforms, tasks, actions } = require('./Enums');
const args = require('./ManageArgs');

const DEFAULT_README_COUNT = 70;
const DEFAULT_PROJECT_COUNT = 2;

async function manageDirectories() {
    const params = await args.getParams();
    switch (params.action.id) {
        case actions.TRIM:
            await deleteUnusedMarkdowns(params.baseDirectory);
            break;
        case actions.ADD:
            await writeManager(params);
            break;
        case actions.CREATE:
            await createPlatform(params);
            break;
        case actions.FAIL:
            await failProj(params);
            break;
        default:
            throw `[manageDirectories]: Invalid action provided: ${params.action.id}`;
    }
}

async function writeManager(params) {
    const { baseDirectory, platform, task, data } = params;
    switch (task.id) {
        case tasks.MARKDOWN:
            await writeAdditionalMarkdowns(baseDirectory, data[0])
            break;
        case tasks.PROJECTS:
            switch (platform.id) {
                case platforms.UNITY:
                    writeAdditionalUnityProjects(baseDirectory, data[0]);
                    break;
                case platforms.BLENDER:
                    writeAdditionalBlenderProjects(baseDirectory, data[0]);
                    break;
                case platforms.PHOTOSHOP:
                    writeAdditionalPhotoshopProjects(baseDirectory, data[0]);
                    break;
                default:
                    throw `[writeManager]: Invalid platform provided: ${platform.id}`;
            }
            break;
        default:
            throw `[writeManager]: Invalid task provided: ${task.id}`;
    }
}

async function createPlatform(params) {
    const { baseDirectory, platform, epic } = params;
    switch (platform.id) {
        case platforms.UNITY:
        case platforms.BLENDER:
        case platforms.PHOTOSHOP:
        case platforms.MATH:
            await createGeneralPlatform(baseDirectory, platform.id, epic);
            break;
        default:
            throw `[createProject]: Invalid platform provided: ${platform.id}`;
    }
}

async function createGeneralPlatform(baseDirectory, platform, epic) {
    await makeDirectory(baseDirectory, 'Exports');
    await makeDirectory(baseDirectory, 'Notes', ['dev']);
    await makeDirectory(baseDirectory, 'Notes', ['images']);
    await writeAdditionalMarkdowns(baseDirectory, DEFAULT_README_COUNT);

    switch (platform) {
        case platforms.UNITY:
            console.log("test1")
            const gitignoreText1 = `.vscode\nMaterials\nPrefabs\nScenes\nSounds\nSprites\nTextMesh Pro\n*.meta\nLibrary\nLogs\nPackages\nProjectSettings\nTemp\nUserSettings\nAssembly-CSharp.*\n${epic}.*`
            // const gitignoreText2 = `node_modules`;
            await makeFile(baseDirectory, '.gitignore', gitignoreText1);
            // await makeFile([], '.gitignore', gitignoreText2);
            await makeDirectory(baseDirectory, 'Projects');
            await writeAdditionalUnityProjects(baseDirectory, DEFAULT_PROJECT_COUNT);
            break;
        case platforms.BLENDER:
        case platforms.PHOTOSHOP:
            console.log("test2")
            await makeDirectory(baseDirectory, 'Projects');
            await writeAdditionalUnityProjects(baseDirectory, DEFAULT_PROJECT_COUNT);
            break;
        default:
            break;
    }
}

async function deleteUnusedMarkdowns(baseDirectory) {
    const updatedBaseDirectory = baseDirectory.concat(['Notes', 'dev'])
    const fileList = await getFilesFromDirectory(updatedBaseDirectory);
    fileList.map(async (fileName) => {
        await removeFile(updatedBaseDirectory, fileName);
    });
}

async function failProj(params) {
    const { baseDirectory, data } = params;
    const reason = data[1];
    const paddedNumber = (data[0]).toString().padStart(2, '0');
    const fileName = `PROJ-${paddedNumber}`;
    const projDirectory = baseDirectory.concat(['Projects', fileName]);

    const projectsDirectory = baseDirectory.concat(['Projects']);
    const fileList = await getFilesFromDirectory(projectsDirectory);
    if (!fileList.includes(fileName)) {
        throw `file ${fileName} doesn't exist`;
    }
    const failureReasonText = `# ${fileName}\n\n## Reason\n\n\t${reason}`;
    await makeFile(projDirectory, `failure_reason.md`, failureReasonText);

    const renamedProjDirectory = baseDirectory.concat(['Projects', `${fileName} (FAILED)`]);
    await renameFile(projDirectory, renamedProjDirectory)
}

async function writeAdditionalMarkdowns(baseDirectory, amount) {
    const devDirectory = baseDirectory.concat(['Notes', 'dev']);
    const imageDirectory = baseDirectory.concat(['Notes', 'images']);
    const fileList = await getFilesFromDirectory(devDirectory);
    if (fileList) {
        const offset = fileList.length;
        [...Array(amount).keys()].map(async (key) => {
            //create mds
            const updatedKey = offset + key;
            const paddedNumber = (updatedKey + 1).toString().padStart(2, '0');
            const devText = `# DEV-${paddedNumber},\n### Tags: []\n### Link:\n\n![](../images/DEV-${paddedNumber}/DEV-${paddedNumber}-A1.png)`;
            await makeFile(devDirectory, `DEV-${paddedNumber}.md`, devText);

            //create image folders
            const newImageDirectory = `DEV-${paddedNumber}`;
            await makeDirectory(imageDirectory, newImageDirectory);
        });
    }
}

async function writeAdditionalUnityProjects(baseDirectory, amount) {
    await writeAdditionalBasicProjects(baseDirectory, amount)
}

async function writeAdditionalBlenderProjects(baseDirectory, amount) {
    const updatedBaseDirectory = baseDirectory.concat(['Projects']);
    const fileList = await getFilesFromDirectory(updatedBaseDirectory);
    if (fileList) {
        const offset = fileList.length;
        [...Array(amount).keys()].map(async (key) => {
            const updatedKey = offset + key;
            const paddedNumber = (updatedKey).toString().padStart(2, '0');
            const name = offset == 0 && key == 0 ? 'PROJ-PLAYGROUND' : `PROJ-${paddedNumber}`
            await makeDirectory(updatedBaseDirectory, name, ['references']);
            await makeDirectory(updatedBaseDirectory, name, ['textures']);
            await makeDirectory(updatedBaseDirectory, name, ['pieces', 'blend']);
            await makeDirectory(updatedBaseDirectory, name, ['pieces', 'exports']);
            await makeDirectory(updatedBaseDirectory, name, ['whole']);
        });
    }
}

async function writeAdditionalPhotoshopProjects(baseDirectory, amount) {
    await writeAdditionalBasicProjects(baseDirectory, amount)
}

async function writeAdditionalBasicProjects(baseDirectory, amount) {
    const exportsDirectory = baseDirectory.concat(['Exports']);
    const projectsDirectory = baseDirectory.concat(['Projects']);
    const fileList = await getFilesFromDirectory(projectsDirectory);
    if (fileList) {
        const offset = fileList.length;
        [...Array(amount).keys()].map(async (key) => {
            const updatedKey = offset + key;
            const paddedNumber = (updatedKey).toString().padStart(2, '0');
            const name = offset == 0 && key == 0 ? 'PROJ-PLAYGROUND' : `PROJ-${paddedNumber}`
            await makeDirectory(projectsDirectory, name);
            await makeDirectory(exportsDirectory, name);
        });
    }
}

exports.manageDirectories = manageDirectories;