const { prompt } = require('./PromisifedFunctions');
const { setBaseDirectory, getDirFromDirectory, stateQuestion } = require('./FileActions');
const { structure } = require('./MenuStructure');
const { actions } = require('./Enums');
const path = require('path');

const selections = {
    platform: { key: undefined, id: undefined },
    epic: { key: undefined, id: undefined },
    task: { key: undefined, id: undefined },
    action: { key: undefined, id: undefined },
    data: []
};

const params = {
    baseDirectory: undefined,
    ...selections,
}

async function getPlatform(question, structure) {
    return getGeneral(question, structure);
}

async function getEpic(question) {
    let value;
    let subValue
    let condition;
    let getIds = {};
    const keys = [];
    const ids = [];
    const initialDirectory = await setBaseDirectory(params.platform.id);
    const directoryList = await getDirFromDirectory(initialDirectory);
    const options = directoryList.map((dir, index) => {
        keys.push(`${index + 1}`);
        ids.push(dir);
        getIds = { ...getIds, ...{ [`${index + 1}`]: dir } }
        return `${index + 1} - ${dir}`
    });
    do {
        condition = false;
        value = await stateQuestion(question, options);
        if (!keys.includes(value)) {
            const subOptions = ["1 - yes", "2 - no"]
            subValue = + await stateQuestion('Are you creating a new directory?', subOptions);
            if(subValue != 1){
                condition = true;
                console.log(`\nTry again, pick a number from 1 to ${keys.length}\n\n`)  
            }
        }
    } while (condition);

    if(!subValue){
        params.baseDirectory = initialDirectory.concat(getIds[value]);
    }else{
        params.baseDirectory = initialDirectory.concat(value);
    }

    return { key: value, id: getIds[value] }
};

async function getTask(question, structure) {
    return getGeneral(question, structure);
}

async function getAction(question, structure) {
    const value = await getGeneral(question, structure);
    const action = structure[value.key].id
    switch (action) {
        case actions.PAD:
            params.data.push(+ await prompt('\nPlease indicate how many files are you adding: \n'));
            break;
        case actions.FAIL:
            params.data.push(+ await prompt('\nPlease which PROJ number you are failing: \n'));
            params.data.push(await prompt(`\nWhy you are failing PROJ-${(params.data[0]).toString().padStart(2, '0')}: \n`))
            break;
        case actions.TRIM:
        case actions.CREATE:
            break;
        default:
            throw 'Invalid action provided qweerwrerwrwe'
    }
    return action;
}

async function getGeneral(question, structure) {
    let value;
    let condition;
    const keys = [];
    const ids = [];
    const options = Object.entries(structure).map(([key, value]) => {
        keys.push(key);
        ids.push(ids);
        return `${key} - ${value.id}`
    }).filter((elem) => !elem.includes("undefined"));
    do {
        condition = false;
        value = await stateQuestion(question, options);
        if (!keys.includes(value)) {
            condition = true;
            console.log(`\nTry again, pick a number from 1 to ${keys.length}\n\n`)
        }
    } while (condition);

    return { key: value, id: structure[value].id }
};

async function getParams() {
    params.platform = await getPlatform('Please provide platform number', structure);
    params.epic = await getEpic('Please provide epic number');
    params.task = await getTask('Please provide task number', structure[params.platform.key]);
    params.action = await getAction('Please provide action number', structure[params.platform.key][params.task.key]);
    return params;
}

exports.getParams = getParams;