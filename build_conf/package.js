const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const archiver = require('archiver');

const getVersion = require('./version');
const build = require('./build');
const vinfo = require('./vinfo');

const clean = Promise.resolve((() => {
    const exec = require('child_process').exec;
    exec(`rm -rf ${path.join(__dirname, '../dist/*')}`);
})());

const makeBuildMD5 = path => {
    const fsHash = crypto.createHash('md5');
    const buffer = fs.readFileSync(path);
    fsHash.update(buffer);
    const md5 = fsHash.digest('hex');

    const jsonPath = path.replace(/zip$/, 'json');
    const build_fd = fs.openSync(jsonPath, 'w+');
    fs.closeSync(build_fd);
    const info = {};
    info['md5'] = md5;
    fs.writeFileSync(jsonPath, JSON.stringify(info, null, '\t'), 'utf8');
};

const package = (v, platform) => 
    new Promise((resolve, reject) => {
        console.log(`start packaging for ${platform} to zip files...\n`);

        const exec = require('child_process').exec;
        exec(`mkdir -p ${path.join(__dirname, '../dist/v' + v[0])}`, err => {
            if(err) reject(err);

            const targetPath = path.join(__dirname, `../dist/v${v[0]}/${platform}.${v[1]}.zip`);
            const output = fs.createWriteStream(targetPath, { flags: 'w+'});
            const zip = archiver('zip');
            output.on('close', () => {
                console.log(`packaging for ${platform} to zip files completed.\n`);
                makeBuildMD5(targetPath);
                resolve(targetPath);
            });
            output.on('error', err => {
                if(err) reject(err);
            });
            zip.on('error', err => {
                if(err) reject(err);
            });
            zip.pipe(output);
            zip.directory(path.join(__dirname, `../${platform}/bundle/`), false);
            zip.finalize();
        });
    });;

Promise.resolve()
    .then(() => build('ios'))
    .then(() => build('android'))
    .then(() => clean)
    .then(() => getVersion)
    .then(v => Promise.all([v, package(v, 'ios'), package(v, 'android')]))
    .then(r => vinfo(r[0], { ios: r[1], android: r[2]}))
    .then(info => { console.log('packaging completed.\n', info); } )
    .catch(err => { console.log('error happened during packaging:', err); });
