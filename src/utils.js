import archiver from 'archiver';
import fs from 'fs';


function logErrors (err, req, res, next) {
    console.error(err.stack);
    next(err);
}

function errorHandler (err, req, res, next) {
    const msg = err.message;
    res.status(500).send(msg);
}

async function archive (folderPath, res) {

    const archive = archiver('zip');
    const chunks = [];

    fs.readdir(folderPath, (err, files) => {

        if (err) {
            console.error('Error reading folder :>> ', err.stack);
            errorHandler(err, '', res);
            return;
        }

        archive.on('error', (err) => {
            console.error('Archiving error :>> ', err.stack);
            errorHandler(err, '', res);
            return;
        });

        files.forEach((file) => {
            if(file === 'invoice.example.pdf') return;
            const filePath = folderPath + '/' + file;

            archive.file(filePath, { name: file });
        });

        archive.on('data', (chunk) => {
            chunks.push(chunk);
        });

        archive.on('end', () => {
            const resultBuffer = Buffer.concat(chunks);
            res.set('Content-Type', 'application/zip');
            res.set('Content-Disposition', 'attachment; filename=invoices.zip');
            res.send(resultBuffer);
        });

        archive.finalize();
    });
};

function parseArgs (args) {
    const parsedArgs = {};

    for(const arg of args) {
        parsedArgs[arg.split('=')[0]] = arg.split('=')[1];
    }

    return parsedArgs;
}


export {
    logErrors,
    errorHandler,
    archive,
    parseArgs
};