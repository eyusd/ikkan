// scripts/generate-meta-package.js
const fs = require('fs');
const path = require('path');

// Get versions from individual packages
const getPackageVersion = (packageName) => {
  const packagePath = path.join(__dirname, 'packages', packageName, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  return packageJson.version;
};

const generateMetaPackage = () => {
  const coreVersion = getPackageVersion('core');
  const clientVersion = getPackageVersion('client');
  const serverVersion = getPackageVersion('server');

  const metaPackage = {
    name: "ikkan",
    version: coreVersion, // Use core version as the main version
    description: "Meta-package for the Ikkan framework",
    keywords: ["ikkan", "framework"],
    author: "eyusd",
    license: "MIT",
    dependencies: {
      "@ikkan/core": `^${coreVersion}`,
      "@ikkan/client": `^${clientVersion}`,
      "@ikkan/server": `^${serverVersion}`
    }
  };

  // Create meta-package directory if it doesn't exist
  const metaPackagePath = path.join(__dirname, 'packages/@meta');
  if (!fs.existsSync(metaPackagePath)) {
    fs.mkdirSync(metaPackagePath);
  }

  // Write package.json
  fs.writeFileSync(
    path.join(metaPackagePath, 'package.json'),
    JSON.stringify(metaPackage, null, 2)
  );

  // Create a basic README
  const readme = `# Ikkan Framework

This is a meta-package that includes all Ikkan framework packages:

- @ikkan/core - Core functionality
- @ikkan/client - Client-side utilities
- @ikkan/server - Server-side utilities

## Installation

\`\`\`bash
npm install ikkan
# or
pnpm add ikkan
\`\`\`
`;

  fs.writeFileSync(
    path.join(metaPackagePath, 'README.md'),
    readme
  );
};

generateMetaPackage();