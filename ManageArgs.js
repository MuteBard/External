function getArgs(){
    const args = {
        name: {
            command: process.argv.slice(2)[0],
            data: process.argv.slice(2)[1]
        },
        destination: {
            command: process.argv.slice(2)[2],
            data: process.argv.slice(2)[3]
        }
    }
    return args;
}


function getParams(){
    const args = getArgs();
    if(args.name.command === '-name' || args.name.command === '-n'){
        const projectName = args.name.data;
        if(args.destination.command === '-dest' || args.destination.command === '-d'){
            return { projectName, destination: args.destination.data };
        }else{
            return { projectName, destination: undefined };
        }
    }else{
        console.log("Valid Project Name not provided", args);
    }
}

exports.getParams = getParams;