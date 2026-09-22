module.exports = {
  presets: [
    // `modules: 'commonjs'` is explicit on purpose: preset-env's "auto"
    // default depends on how the caller (bundler vs plain CLI) identifies
    // itself, which varies across environments. `package.json`'s
    // `"main": "dist/index.js"` promises CommonJS, so the build must not
    // rely on that detection going the right way.
    ['@babel/preset-env', { modules: 'commonjs' }],
    // `development: false` is explicit for the same reason: preset-react
    // otherwise chooses the dev JSX runtime from `NODE_ENV`/`BABEL_ENV`,
    // which default to "development" when unset - exactly the case for a
    // plain `npm run build` with no env vars exported.
    ['@babel/preset-react', { runtime: 'automatic', development: false }],
  ],
};
