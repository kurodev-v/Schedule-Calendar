module.exports = {
  plugins: {
    'postcss-preset-env': {
      features: {
        'color-function': { preserve: false },
        'oklab-function': { preserve: false },
      },
    },
    '@tailwindcss/postcss': {},
  },
};
