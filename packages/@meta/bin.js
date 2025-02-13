#!/usr/bin/env node

const { promisify } = require('util');
const { exec: execCb } = require('child_process');
const { existsSync } = require('fs');
const { join } = require('path');
const { createInterface } = require('readline');

const exec = promisify(execCb);
const packages = ['@ikkan/core', '@ikkan/client', '@ikkan/server'];

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function getPackageInfo(pkg) {
  try {
    const { stdout } = await exec(`npm view ${pkg} --json`);
    return JSON.parse(stdout);
  } catch (error) {
    console.error(`Error getting info for ${pkg}: ${error.message}`);
    return null;
  }
}

async function getPeerDependencies(packages) {
  const allPeerDeps = new Set();
  
  for (const pkg of packages) {
    const info = await getPackageInfo(pkg);
    if (info && info.peerDependencies) {
      Object.keys(info.peerDependencies).forEach(dep => allPeerDeps.add(dep));
    }
  }
  
  return Array.from(allPeerDeps).filter(dep => !packages.includes(dep));
}

function detectPackageManagerFromProcess() {
  // Check if running through npx, pnpm dlx, yarn dlx, or bunx
  const processPath = process.env._;
  if (!processPath) return null;

  if (processPath.includes('pnpm')) return 'pnpm';
  if (processPath.includes('yarn')) return 'yarn';
  if (processPath.includes('bun')) return 'bun';
  if (processPath.includes('npm') || processPath.includes('npx')) return 'npm';

  // Check for npm_config_user_agent
  if (process.env.npm_config_user_agent) {
    const userAgent = process.env.npm_config_user_agent.toLowerCase();
    if (userAgent.includes('pnpm')) return 'pnpm';
    if (userAgent.includes('yarn')) return 'yarn';
    if (userAgent.includes('bun')) return 'bun';
    if (userAgent.includes('npm')) return 'npm';
  }

  return null;
}

function detectPackageManagerFromLockfile() {
  const lockFiles = {
    'package-lock.json': 'npm',
    'pnpm-lock.yaml': 'pnpm',
    'yarn.lock': 'yarn',
    'bun.lockb': 'bun'
  };

  for (const [file, manager] of Object.entries(lockFiles)) {
    if (existsSync(join(process.cwd(), file))) {
      return manager;
    }
  }

  return null;
}

async function detectPackageManager() {
  // First try to detect from the process/environment
  const managerFromProcess = detectPackageManagerFromProcess();
  if (managerFromProcess) {
    return managerFromProcess;
  }

  // Fall back to lockfile detection
  const managerFromLockfile = detectPackageManagerFromLockfile();
  if (managerFromLockfile) {
    return managerFromLockfile;
  }

  // Default to npm if nothing else is detected
  return 'npm';
}

async function installPackages(packages, packageManager) {
  const commands = {
    npm: `npm install ${packages.join(' ')}`,
    pnpm: `pnpm add ${packages.join(' ')}`,
    yarn: `yarn add ${packages.join(' ')}`,
    bun: `bun add ${packages.join(' ')}`
  };

  const command = commands[packageManager];
  console.log(`\nInstalling packages using ${packageManager}...`);
  
  try {
    const { stdout, stderr } = await exec(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    return true;
  } catch (error) {
    console.error(`Error installing packages: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Welcome to Ikkan initialization!\n');

  const packageManager = await detectPackageManager();
  console.log(`📦 Detected package manager: ${packageManager}\n`);

  // Get peer dependencies first
  console.log('Checking peer dependencies...');
  const peerDeps = await getPeerDependencies(packages);
  
  console.log('\nThe following packages will be installed:');
  for (const pkg of packages) {
    console.log(`- ${pkg}`);
  }
  
  if (peerDeps.length > 0) {
    console.log('\nRequired peer dependencies:');
    for (const dep of peerDeps) {
      console.log(`- ${dep}`);
    }
  }

  const answer = await question('\nWould you like to continue? (Y/n): ');
  if (answer.toLowerCase() === 'n') {
    console.log('\n❌ Installation cancelled.');
    rl.close();
    return;
  }

  // Install both main packages and peer dependencies
  const allPackages = [...packages, ...peerDeps];
  const success = await installPackages(allPackages, packageManager);

  if (success) {
    console.log('\n✅ Installation complete! Your Ikkan is ready to use.');
    console.log('\nQuick start guide:');
    console.log('1. Import the packages in your code');
    console.log('2. Check the documentation at https://eyusd.com/ikkan for next steps');
  }

  rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
