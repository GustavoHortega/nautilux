// Dotenv Config
require('dotenv').config({quiet: true});

const app = require('./app');

const { logger } = require('./utils');

// Inicilize server
const port = process.env.PORT || 3000
app.listen(port, () => {

	logger.info(`Server listening on port ${port}`);
});