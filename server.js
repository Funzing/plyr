const connect = require('connect');
const serveStatic = require('serve-static');
connect().use(serveStatic(__dirname+'/')).listen(8091);
console.log('run now: http://localhost:8091');
