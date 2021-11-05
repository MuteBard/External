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

async function question(statement){
    console.clear();
    return prompt(statement);
}

async function getParams() {
    const args = {};
    const type = await question(`Please provide project type: (Options below): \n${format([...projectMap.keys()])}\n\n`);

    if (!projectMap.has(type)) {
        throw "Invalid project type provided";
    }
    args.type = type;

    const name = await question('Please provide the project name: \n');

    if (!name) {
        throw "Invalid project name provided";
    }
    args.name = name;

    const plans = Object.keys(projectMap.get(type));
    const plan = await question(`What do you plan to work with?: (Options below): \n${format(plans)}\n\n`);

    if (!plans.includes(plan)) {
        throw "Invalid plan provided";
    }
    args.plan = plan;

    const actions = Object.values(projectMap.get(type)[plan]);
    const action = await question(`Please provide the action. (Options below): \n${format(actions)}\n\n`);

    if (!actions.includes(action)) {
        throw "Invalid action provided";
    }

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