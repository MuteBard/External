const { prompt } = require('./PromisifedFunctions');

const tuples = [
    [
        'unity', {
            workspace: {
                CREATE: 'create'
            },
            md: {
                TRIM: 'trim',
                PAD: 'pad'
            },
        }
    ], [
        'blender', {
            workspace: {
                CREATE: 'create'
            },
            md: {
                TRIM: 'trim',
                PAD: 'pad'
            },
            projects: {
                PAD: 'pad',
            }
        }
    ]
]

const projectTypes = {
    UNITY: 'unity',
    BLENDER: 'blender'
};

const projectPlans = {
    WORKSPACE: 'workspace',
    MD: 'md',
    PROJECTS: 'projects'
};

const projectActions = {
    TRIM: 'trim',
    PAD: 'pad',
    CREATE: 'create'
};

const projectMap = new Map(tuples);

function format(list) {
    const newList = list.map((item) => `- ${item}`).toString().split(',').join('\n');
    return newList;
}

async function question(statement, name, collection = {type: ''}){
    console.clear();
    const value = await prompt(statement);

    switch(collection.type){
        case 'map':
            if (!collection.value.has(value)) {
                throw `Invalid project ${name} provided`;
            }
            break;
        case 'list':
            if (!collection.value.includes(value)) {
                throw `Invalid project ${name} provided`;
            }
            break;
        default:
            if (!value) {
                throw `Invalid project ${name} provided`;
            }
            break;
    }
    return value;
}

async function getParams() {
    const args = {};
    const types = [...projectMap.keys()];
    args.type = await question(`Please provide project type: (Options below): \n${format(types)}\n\n`, 'type', {value: projectMap, type: 'map'});
   
    args.name = await question('Please provide the project name: \n', 'name');

    const plans = Object.keys(projectMap.get(args.type));
    args.plan = await question(`What do you plan to work with?: (Options below): \n${format(plans)}\n\n`, 'plan', {value: plans, type: 'list'});

    const actions = Object.values(projectMap.get(args.type)[args.plan]);
    const action = await question(`Please provide the action. (Options below): \n${format(actions)}\n\n`, 'action', {value: actions, type: 'list'});

    switch (action) {
        case 'pad':
            args.action = action;
            console.clear();
            result = await prompt('Please indicate how many files are you adding: \n');
            args.data = +result;
            break;
        case 'trim':
        case 'create':
            args.action = action;
            break;
        default:
            throw "Invalid action provided"
    }

    return args;
}

exports.getParams = getParams;
exports.projectTypes = projectTypes;
exports.projectPlans = projectPlans;
exports.projectActions = projectActions;