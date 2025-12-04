# Changelog

All notable changes to GuardianJS Free will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive JSDoc documentation for all modules and functions
- Professional open-source standards: CONTRIBUTING.md, CHANGELOG.md, CODE_OF_CONDUCT.md
- Detailed inline code documentation and examples

### Changed
- Improved code documentation throughout the project

## [0.1.0] - 2024-12-04

### Added
- Initial release of GuardianJS Free
- Client-side browser fingerprinting without API keys
- Anchor-based visitor ID computation
- Browser signal collection:
  - WebGL basics and extensions
  - WebGPU support detection
  - Audio fingerprinting
  - Math fingerprinting
  - EME (Widevine) support detection
  - Performance timing characteristics
- Stable hashing utilities
- Browser engine detection (Chromium, WebKit, Gecko, etc.)
- TypeScript type definitions
- ESM, CJS, and IIFE build outputs
- MIT license

### Features
- **Pure client-side operation**: No network calls, no API keys required
- **Stable visitor IDs**: Anchor-based identification resistant to viewport changes
- **Privacy-aware**: Skips problematic fingerprinting methods in browsers with anti-fingerprinting measures
- **Cross-platform**: Works in all modern browsers
- **TypeScript support**: Full type definitions included
- **Multiple module formats**: ESM, CommonJS, and IIFE

### Browser Support
- Chrome/Edge (Chromium) 86+
- Firefox 90+
- Safari 12+
- Mobile browsers (iOS Safari, Chrome Mobile, etc.)

### Known Limitations
- Lower accuracy compared to Guardian Pro (server-side processing)
- Susceptible to fingerprint spoofing (client-side only)
- Potential for ID collisions on identical hardware/software setups
- Safari 17+ audio fingerprinting disabled due to anti-fingerprinting measures

## Version History

### Versioning Strategy

GuardianJS Free follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality in a backward-compatible manner
- **PATCH** version for backward-compatible bug fixes

### Release Process

1. Update CHANGELOG.md with all changes
2. Update version in package.json
3. Create a git tag with the version number
4. Build and publish to npm

### Migration Guides

When upgrading between major versions, refer to the specific migration guides below:

#### Migrating to 1.x (Future)

*No migrations yet - this is the initial release*

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## Links

- [GitHub Repository](https://github.com/guardianstack/guardianjs-free)
- [npm Package](https://www.npmjs.com/package/@guardianstack/guardianjs-free)
- [Issue Tracker](https://github.com/guardianstack/guardianjs-free/issues)
- [Guardian Pro](https://dashboard.guardianstack.ai)

## Support

For support:
- Check the [README](README.md) for documentation
- Search [existing issues](https://github.com/guardianstack/guardianjs-free/issues)
- Open a new issue for bugs or feature requests
- For Guardian Pro, contact [support@guardianstack.ai](mailto:support@guardianstack.ai)

