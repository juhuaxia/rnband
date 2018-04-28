const spawn = require('child_process').spawn;
const exec = require('child_process').exec;

const build = (platform, callback) => {
    console.log(`start building for ${platform}...\n`);

    exec(`rm -rf ./${platform}/bundle/*`);

    const command = `
    ./node_modules/react-native/local-cli/cli.js bundle
    --entry-file ./index.${platform}.js
    --platform ${platform}
    --bundle-output ./${platform}/bundle/${platform}.jsbundle
    --assets-dest ./${platform}/bundle
    --dev false
    `;
    const process = spawn('node', command.replace('\n', ' ').split(' ').filter(s => !!s).map(s => s.replace('\n', '')));
    process.stdout.on('data', data => {
        console.log(data.toString().replace('\n', ''));
    });
    process.stderr.on('data', data => {
        console.log(data.toString().replace('\n', ''));
    });
    process.on('error', err => {
        console.log('building for ios error', err);
        callback(err);
    });
    process.on('exit', code => {
        console.log('building for ios completed.\n');
        callback(null);
    });
};


module.exports = platform => new Promise((resolve, reject) => {
    build(platform, err => {
        if(err) {
            reject(err)
        } else {
            resolve(null);
        }
    });
});
