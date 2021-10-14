const { prompt } = require('./PromisifedFunctions');


async function getParams(){
    const args = {};
    const name = await prompt('Please provide the project name: ');
    const action = await prompt('Please provide the action (trim, pad, create): ');

    if(!name){
        throw "Invalid project provided";
    }
    else{
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
                result = await prompt('Please provide the output path (Enter if none): ');
                args.data = +result;
                break;
            default:
                throw "Invalid action provided"
        }
    }
    console.log(args)
    return args;
}

exports.getParams = getParams;