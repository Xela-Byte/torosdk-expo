const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Enable package.json "exports" field resolution so that
// import { Currency } from "torosdk-expo/core" works.
config.resolver.unstable_enablePackageExports = true;

// Metro only knows about files within the project root by default.
// When torosdk-expo is linked via `file:..` (symlink in node_modules),
// the real files live outside the project root. watchFolders tells Metro
// to include those files in its file map so module resolution succeeds.
config.watchFolders = [path.resolve(__dirname, '..')];

// When Metro's Babel transforms pre-compiled dist files (spread operators
// → @babel/runtime/helpers/toConsumableArray, etc.), the generated
// require() calls resolve relative to the symlinked package root, not the
// example project. Add the example's own node_modules as a fallback lookup
// so those helpers can be found.
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

// Force all require("react") and require("react/jsx-runtime") calls to
// resolve to the example's node_modules. Without this, Metro walks up
// from the symlinked torosdk-expo dist/ files and finds the monorepo
// root's node_modules/react (a devDependency for testing). Two copies
// of React in the bundle = "Cannot read property 'useMemo' of null"
// and "Invalid hook call" errors.
config.resolver.extraNodeModules = {
  react: path.resolve(__dirname, 'node_modules/react'),
  'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime'),
  'react-native': path.resolve(__dirname, 'node_modules/react-native'),
};

module.exports = config;
