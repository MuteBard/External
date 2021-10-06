function getArgs(){
    const args = {
        name: {
            command: process.argv.slice(2)[0],
            data: process.argv.slice(2)[1]
        },
        options: {
            command: process.argv.slice(2)[2],
            data: process.argv.slice(2)[3]
        }
    }
    return args;
}


function getParams(){
    const args = getArgs();
    if(args.name.command === '-name'){
        const projectName = args.name.data;
        if(args.options.command === '-dest'){
            return { projectName, action: 'dest', data: args.options.data };
        }else if(args.options.command === '-trim'){
            return { projectName, action: 'trim' };
        }else if(args.options.command === '-pad'){
            return { projectName, action: 'pad', data: +args.options.data };     
        }else{
            return { projectName };
        }
    }else{
        console.log("Valid Project Name not provided", args);
    }
}

exports.getParams = getParams;