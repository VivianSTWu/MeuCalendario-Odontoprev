const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Verifica se assetExts e sourceExts existem antes de modificar
config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts ? [...config.resolver.assetExts, 'png', 'jpg', 'jpeg'] : ['png', 'jpg', 'jpeg'],
  sourceExts: config.resolver.sourceExts ? [...config.resolver.sourceExts, 'cjs'] : ['cjs'],
};

module.exports = withNativeWind(config, { input: './global.css' });
