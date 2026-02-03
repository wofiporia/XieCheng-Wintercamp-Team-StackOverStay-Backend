const fs = require('fs');
const path = require('path');
const specs = require('../src/config/swagger');

const outputPath = path.resolve(__dirname, '../swagger.json');

try {
  fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2));
  console.log(`Swagger documentation exported successfully to: ${outputPath}`);
} catch (error) {
  console.error('Failed to export Swagger documentation:', error);
  process.exit(1);
}
