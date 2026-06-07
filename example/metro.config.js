const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable package.json "exports" field resolution so that
// import { Currency } from "torosdk-expo/core" works.
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
