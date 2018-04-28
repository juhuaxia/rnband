const fs = require('fs');
const path = require('path');

const getVersion = () => {
    const config = fs.readFileSync(path.resolve(__dirname, '../src/config.js'), 'utf8');
    const match = config.match(/version:\s*['"]?(\d+\.\d+\.\d+)\s+build-(\w+)['"]?/);
    if(match) {
        return [match[1], match[2]];
    }
    return ['1.0.0', Math.random().toString().slice(2, 10)];
};

module.exports = Promise.resolve(getVersion());
