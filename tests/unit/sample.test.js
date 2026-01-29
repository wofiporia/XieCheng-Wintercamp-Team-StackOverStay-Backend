const { getSample } = require('../../src/services/sampleService');

test('sample service returns message', async () => {
  const res = await getSample();
  expect(res).toHaveProperty('message');
});
