const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const makeVInfo = (v, files) => {
    console.log('start making version info...\n');

    const vinfo_path = path.join(__dirname, '../dist/vinfo.json');
    const vinfo_fd = fs.openSync(vinfo_path, 'w+');
    fs.closeSync(vinfo_fd);
    const vinfo = {};
    vinfo['buildDate'] = (new Date()).toLocaleString();
    vinfo['buildVersion'] = 'v' + v[0];
    vinfo['buildNumber'] = v[1];

    const ios_fsHash = crypto.createHash('md5');
    const ios_buffer = fs.readFileSync(files['ios']);
    ios_fsHash.update(ios_buffer);
    const ios_md5 = ios_fsHash.digest('hex');

    const android_fsHash = crypto.createHash('md5');
    const android_buffer = fs.readFileSync(files['android']);
    android_fsHash.update(android_buffer);
    const android_md5 = android_fsHash.digest('hex');

    vinfo['ios'] = { md5: ios_md5};
    vinfo['android'] = { md5: android_md5};
    fs.writeFileSync(vinfo_path, JSON.stringify(vinfo, null, '\t'), 'utf8');

    console.log('making version info completed.\n');
    return {
        ios: {
            path: files['ios'],
            md5: ios_md5
        },
        android: {
            path: files['android'],
            md5: android_md5
        },
        vinfo: {
            path: vinfo_path,
        }
    };
};

module.exports = (v, files) => Promise.resolve(makeVInfo(v, files));
