const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

const nextConfiguration = {
  target: 'serverless',
};

module.exports = withPlugins([optimizedImages], nextConfiguration);
