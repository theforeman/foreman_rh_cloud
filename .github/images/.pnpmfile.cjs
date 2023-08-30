function readPackage(pkg, context) {
  // Override the manifest of foo@1.x after downloading it from the registry
  if ('cosmiconfig-typescript-loader' in pkg.dependencies) {
    // Replace bar@x.x.x with bar@2.0.0
    pkg.dependencies = {
      ...pkg.dependencies,
      'cosmiconfig-typescript-loader': '~4.3.0'
    }
    context.log(`cosmiconfig-typescript-loader in ${pkg.name}`)
  }

  // This will change any packages using baz@x.x.x to use baz@1.2.3
  if (pkg.dependencies.baz) {
    pkg.dependencies.baz = '1.2.3';
  }

  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}

