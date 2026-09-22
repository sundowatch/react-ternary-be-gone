module.exports = {
  presets: [
    // `modules: 'commonjs'` is explicit on purpose: preset-env's "auto"
    // default depends on how the caller (bundler vs plain CLI) identifies
    // itself, which varies across environments. `package.json`'s
    // `"main": "dist/index.js"` promises CommonJS, so the build must not
    // rely on that detection going the right way.
    ['@babel/preset-env', { modules: 'commonjs' }],
    // `runtime: 'classic'` (React.createElement, not the `react/jsx-runtime`
    // import) is required by `peerDependencies: { react: ">=16.8.0" }` in
    // package.json - the automatic runtime's `react/jsx-runtime` module
    // doesn't exist before React 16.14.0, so building with it would silently
    // break for anyone on 16.8-16.13 despite what peerDependencies promises.
    ['@babel/preset-react', { runtime: 'classic', development: false }],
  ],
};
