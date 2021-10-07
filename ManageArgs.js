const _prompt = require('prompt-sync')();

function prompt(message = "", postMessage = ""){
    const value = _prompt(`${message}? ${postMessage ? '('+postMessage+')' : ''}: `)
    console.clear();
    return value;
}

function getParams(){
    const args = {};
    const name = prompt('Please provide the project name');
    const action = prompt('Please provide the action', 'trim, pad, create');

    if(!name){
        throw "Invalid project provided";
    }
    else{
        args.name = name;
        switch(action) {
            case 'pad':
                args.action = action;
                args.data = +prompt('Please indicate how many markup files are you adding');
                break;
            case 'trim':
                args.action = action;
                break;
            case 'create':
                args.action = action;
                args.data = prompt('Please provide the output path', 'Enter if none')
                break;
            default:
                throw "Invalid action provided"
                break;
        }
    }
    return args;
}

exports.getParams = getParams;