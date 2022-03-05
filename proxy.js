const SmeeClient = require('smee-client');

const smee = new SmeeClient({
  source: 'https://smee.io/VsmPqZ1QXYnFi1',
  target: 'http://localhost:8888/.netlify/functions/github',
  logger: console
});

smee.start();
