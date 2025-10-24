const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Starting Movie Management Backend...');

// Try different ways to start the application
const commands = [
  'npx nest start --watch',
  'node_modules/.bin/nest start --watch',
  'npx ts-node src/main.ts'
];

function tryCommand(index = 0) {
  if (index >= commands.length) {
    console.error('❌ Failed to start the backend with any method');
    process.exit(1);
  }

  const command = commands[index];
  console.log(`Trying: ${command}`);

  const child = exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`Command failed: ${command}`);
      tryCommand(index + 1);
    }
  });

  child.stdout.on('data', (data) => {
    console.log(data);
  });

  child.stderr.on('data', (data) => {
    console.error(data);
  });
}

tryCommand();
