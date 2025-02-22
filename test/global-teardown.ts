/* eslint-disable */

module.exports = async () => {
  await global.postgresContainer.stop();
  await global.redisContainer.stop();
}