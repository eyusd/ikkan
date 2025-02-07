#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

// Regular dependencies
const dependencies = [
  '@ikkan/core',
  '@ikkan/client',
  '@ikkan/server',
  'zod',
  'next',
  'react',
  'swr'
];

// Dev dependencies
const devDependencies = [
  '@types/react'
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function detectPackageManager() {
  const processEnv = process.env._;
  if (processEnv) {
    if (processEnv.includes('pnpm')) return 'pnpm';
    if (processEnv.includes('yarn')) return 'yarn';
  }

  if (fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(process.cwd(), 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(process.cwd(), 'package-lock.json'))) return 'npm';

  return 'npm';
}

function getPackageInfoCommand(packageManager, packageName) {
  switch (packageManager) {
    case 'pnpm':
      return `pnpm info ${packageName} --json`;
    case 'yarn':
      return `yarn info ${packageName} --json`;
    default:
      return `npm view ${packageName} --json`;
  }
}

function parsePackageInfo(output) {
  try {
    return JSON.parse(output);
  } catch {
    return null;
  }
}

async function getDependencyVersions(packageManager) {
  const versions = {};
  
  // First, get the latest versions of @ikkan packages
  try {
    // Get @ikkan/client info for zod, react, swr, and @types/react versions
    const clientOutput = execSync(getPackageInfoCommand(packageManager, '@ikkan/client'), { encoding: 'utf8' });
    const clientInfo = parsePackageInfo(clientOutput);
    const clientDeps = clientInfo.versions[clientInfo['dist-tags'].latest].dependencies || {};
    const clientDevDeps = clientInfo.versions[clientInfo['dist-tags'].latest].devDependencies || {};

    versions['@ikkan/client'] = clientInfo['dist-tags'].latest;
    versions['zod'] = clientDeps['zod'] || null;
    versions['react'] = clientDeps['react'] || null;
    versions['swr'] = clientDeps['swr'] || null;
    versions['@types/react'] = clientDevDeps['@types/react'] || null;

    // Get @ikkan/server info for next version
    const serverOutput = execSync(getPackageInfoCommand(packageManager, '@ikkan/server'), { encoding: 'utf8' });
    const serverInfo = parsePackageInfo(serverOutput);
    const serverDeps = serverInfo.versions[serverInfo['dist-tags'].latest].dependencies || {};

    versions['@ikkan/server'] = serverInfo['dist-tags'].latest;
    versions['next'] = serverDeps['next'] || null;

    // Get @ikkan/core version
    const coreOutput = execSync(getPackageInfoCommand(packageManager, '@ikkan/core'), { encoding: 'utf8' });
    const coreInfo = parsePackageInfo(coreOutput);
    versions['@ikkan/core'] = coreInfo['dist-tags'].latest;

  } catch (error) {
    console.error('❌ Error fetching @ikkan package information:', error.message);
    process.exit(1);
  }

  return versions;
}

function getCurrentVersions() {
  try {
    const packageJson = require(path.join(process.cwd(), 'package.json'));
    return {
      dependencies: packageJson.dependencies || {},
      devDependencies: packageJson.devDependencies || {}
    };
  } catch (e) {
    return { dependencies: {}, devDependencies: {} };
  }
}

function compareVersions(current, latest) {
  current = current?.replace(/[\^~]/g, '');
  if (!current || !latest) return null;
  
  const [currentMajor, currentMinor, currentPatch] = current.split('.').map(Number);
  const [latestMajor, latestMinor, latestPatch] = latest.split('.').map(Number);
  
  if (currentMajor === latestMajor && currentMinor === latestMinor && currentPatch === latestPatch) {
    return 'same';
  }
  if (currentMajor > latestMajor || 
      (currentMajor === latestMajor && currentMinor > latestMinor) ||
      (currentMajor === latestMajor && currentMinor === latestMinor && currentPatch > latestPatch)) {
    return 'downgrade';
  }
  return 'upgrade';
}

function getInstallCommand(packageManager, regularDeps, devDeps) {
  const regularPackages = regularDeps.length ? regularDeps.join(' ') : '';
  const devPackages = devDeps.length ? devDeps.join(' ') : '';
  
  switch (packageManager) {
    case 'pnpm':
      return [
        regularPackages && `pnpm add ${regularPackages}`,
        devPackages && `pnpm add -D ${devPackages}`
      ].filter(Boolean).join(' && ');
    case 'yarn':
      return [
        regularPackages && `yarn add ${regularPackages}`,
        devPackages && `yarn add -D ${devPackages}`
      ].filter(Boolean).join(' && ');
    default:
      return [
        regularPackages && `npm install ${regularPackages}`,
        devPackages && `npm install -D ${devPackages}`
      ].filter(Boolean).join(' && ');
  }
}

async function main() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.error('❌ No package.json found. Please run this command in a Node.js project.');
      process.exit(1);
    }

    const packageManager = detectPackageManager();
    console.log(`📦 Ikkan Dependencies Installer (using ${packageManager})\n`);
    
    const current = getCurrentVersions();
    const targetVersions = await getDependencyVersions(packageManager);
    
    let depsToInstall = [];
    let devDepsToInstall = [];
    
    // Check regular dependencies
    for (const dep of dependencies) {
      const currentVersion = current.dependencies[dep];
      const targetVersion = targetVersions[dep];
      
      if (!currentVersion) {
        console.log(`📥 ${dep}: Will be installed (version: ${targetVersion})`);
        depsToInstall.push(`${dep}@${targetVersion}`);
        continue;
      }
      
      const comparison = compareVersions(currentVersion, targetVersion);
      
      if (comparison === 'same') {
        console.log(`✅ ${dep}: Already at correct version (${currentVersion})`);
        continue;
      }
      
      const action = comparison === 'upgrade' ? 'upgraded' : 'downgraded';
      const message = `❗ ${dep}: Will be ${action} from ${currentVersion} to ${targetVersion}. Proceed? (y/N) `;
      
      const answer = await question(message);
      if (answer.toLowerCase() === 'y') {
        depsToInstall.push(`${dep}@${targetVersion}`);
      }
    }

    // Check dev dependencies
    for (const dep of devDependencies) {
      const currentVersion = current.devDependencies[dep];
      const targetVersion = targetVersions[dep];
      
      if (!currentVersion) {
        console.log(`📥 ${dep}: Will be installed as dev dependency (version: ${targetVersion})`);
        devDepsToInstall.push(`${dep}@${targetVersion}`);
        continue;
      }
      
      const comparison = compareVersions(currentVersion, targetVersion);
      
      if (comparison === 'same') {
        console.log(`✅ ${dep}: Already at correct version (${currentVersion})`);
        continue;
      }
      
      const action = comparison === 'upgrade' ? 'upgraded' : 'downgraded';
      const message = `❗ ${dep}: Will be ${action} from ${currentVersion} to ${targetVersion}. Proceed? (y/N) `;
      
      const answer = await question(message);
      if (answer.toLowerCase() === 'y') {
        devDepsToInstall.push(`${dep}@${targetVersion}`);
      }
    }

    if (depsToInstall.length === 0 && devDepsToInstall.length === 0) {
      console.log('\n✨ Nothing to install or update!');
      rl.close();
      return;
    }

    const summary = [
      depsToInstall.length && `${depsToInstall.length} regular dependencies`,
      devDepsToInstall.length && `${devDepsToInstall.length} dev dependencies`
    ].filter(Boolean).join(' and ');

    const finalConfirm = await question(`\nReady to install/update ${summary}. Continue? (y/N) `);
    
    if (finalConfirm.toLowerCase() !== 'y') {
      console.log('Installation cancelled.');
      rl.close();
      return;
    }

    console.log('\n🚀 Installing dependencies...\n');

    try {
      const command = getInstallCommand(packageManager, depsToInstall, devDepsToInstall);
      execSync(command, { stdio: 'inherit' });
      console.log('\n✅ Dependencies installed successfully!');
    } catch (error) {
      console.error('\n❌ Error installing dependencies:', error.message);
      process.exit(1);
    }

    rl.close();
  } catch (error) {
    console.error('❌ An unexpected error occurred:', error.message);
    process.exit(1);
  }
}

main();
