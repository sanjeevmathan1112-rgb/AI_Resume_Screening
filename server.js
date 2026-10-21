// Root server.js entry point
// Allows running "node server.js" directly from the root project directory
const path = require('path');

const serverDir = path.join(__dirname, 'server');
process.chdir(serverDir);
require(path.join(serverDir, 'server.js'));
