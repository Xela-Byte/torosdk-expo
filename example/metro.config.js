const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');
const exampleNM = path.resolve(projectRoot, 'node_modules');
const rootNM = path.resolve(workspaceRoot, 'node_modules');

const config = getDefaultConfig(projectRoot);

// Watch the parent workspace so Metro rebuilds when SDK source changes
config.watchFolders = [workspaceRoot];

// Disable hierarchical lookup — without this, SDK source files at ../src/
// walk up to find react in the root's node_modules, causing duplicate React.
config.resolver.disableHierarchicalLookup = true;

// Module resolution paths: example first (react, react-native, expo),
// then root (torosdk, @tanstack/react-query, expo-secure-store, etc.)
config.resolver.nodeModulesPaths = [exampleNM, rootNM];

// Map torosdk-expo to local source. Also force react and react-native
// to the example's copies (belt and suspenders with disableHierarchicalLookup).
config.resolver.extraNodeModules = {
  'torosdk-expo': path.resolve(workspaceRoot, 'src', 'react'),
  'torosdk-expo/core': path.resolve(workspaceRoot, 'src', 'core'),
  'react': exampleNM + '/react',
  'react-native': exampleNM + '/react-native',
};

module.exports = config;
