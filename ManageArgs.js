const { prompt } = require('./PromisifedFunctions');


const projectTypes = {
    UNITY : 'unity',
    BLENDER: 'blender'
};

const projectActions = {
    TRIM: 'trim',
    PAD: 'pad',
    CREATE: 'create'
};

function format(list){
    const newList = list.map((item, id) => {
        if(id == 0){
            return item;
        }else{
            return ' '+item;
        }
    });
    return newList.toString().trim();
}

async function getParams(){
    const args = {};
    const type = await prompt(`Please provide project type (${format(Object.values(projectTypes))}): `);
    const name = await prompt('Please provide the project name: ');
    const action = await prompt(`Please provide the action (${format(Object.values(projectActions))}): `);
    
    if(!name){
        throw "Invalid project name provided";
    }
    
    args.type = type;
    args.name = name;
    let result;
    switch(action) {
        case 'pad':
            args.action = action;
            result = await prompt('Please indicate how many markup files are you adding: ');
            args.data = +result;
            break;
        case 'trim':
            args.action = action;
            break;
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
exports.projectActions = projectActions;