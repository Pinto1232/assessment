module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 22 } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    [
      'module-resolver',
      {
        alias: { '@': './src' },
        extensions: ['.ts'],
      },
    ],
  ],
  sourceMaps: true,
};
