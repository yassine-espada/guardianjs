# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

The GuardianStack team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings.

### Where to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by emailing:

📧 **security@guardianstack.ai**

### What to Include

Please include the following information in your report:

1. **Description of the vulnerability**
   - What is the security issue?
   - What type of vulnerability is it? (e.g., XSS, CSRF, injection, etc.)

2. **Steps to reproduce**
   - Detailed steps to reproduce the vulnerability
   - Include any necessary code, configuration, or environment details

3. **Potential impact**
   - What could an attacker do with this vulnerability?
   - What data or systems could be affected?

4. **Suggested fix** (optional)
   - If you have ideas on how to fix the issue, please share them

### What to Expect

After you submit a report, you can expect:

1. **Acknowledgment**: We'll acknowledge receipt of your vulnerability report within 48 hours.

2. **Investigation**: We'll investigate the issue and may reach out for additional information.

3. **Updates**: We'll keep you informed of our progress as we work on a fix.

4. **Resolution**: Once the vulnerability is fixed:
   - We'll notify you when the fix is released
   - We'll credit you in the release notes (unless you prefer to remain anonymous)
   - We'll publish a security advisory on GitHub

### Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Varies based on severity and complexity

## Security Best Practices

### For Users

When using GuardianJS Free, keep in mind:

1. **Client-Side Only**: GuardianJS Free runs entirely in the browser and is susceptible to client-side tampering. For production security-critical applications, consider [Guardian Pro](https://dashboard.guardianstack.ai).

2. **Keep Updated**: Always use the latest version to benefit from security patches.

3. **Validate on Server**: Never rely solely on client-side fingerprinting for security decisions. Always validate on your server.

4. **Content Security Policy**: GuardianJS Free is designed to work with strict CSP policies. Ensure your CSP allows:
   - Canvas operations
   - WebGL context creation
   - Audio context creation
   - Web Workers (if used)

### For Contributors

When contributing to GuardianJS Free:

1. **Never commit secrets**: Don't include API keys, passwords, or other secrets in code.

2. **Review dependencies**: Be cautious when adding new dependencies. Check for known vulnerabilities.

3. **Sanitize inputs**: Always sanitize and validate user inputs, even in client-side code.

4. **Follow secure coding practices**: 
   - Avoid `eval()` and similar dynamic code execution
   - Use `textContent` instead of `innerHTML` when possible
   - Be careful with regular expressions (ReDoS vulnerabilities)

## Known Limitations

### Client-Side Fingerprinting

GuardianJS Free operates entirely in the browser, which means:

- **Spoofing**: Fingerprints can be spoofed by users with sufficient technical knowledge
- **No server validation**: There's no server-side verification of collected signals
- **Limited accuracy**: Client-side only fingerprinting has lower accuracy than server-assisted methods

### Privacy Considerations

GuardianJS Free collects browser and device characteristics. While no data is sent to external servers:

- Users may consider this fingerprinting invasive
- Browser vendors are increasingly adding anti-fingerprinting measures
- Some privacy-focused browsers may block or interfere with fingerprinting

### Recommended for Production

For production environments requiring:
- High accuracy
- Protection against spoofing
- Bot detection
- VPN/proxy detection
- Real-time fraud scoring

We recommend using **Guardian Pro** instead, which provides:
- Server-side signal verification
- Advanced bot detection
- Tamper-proof fingerprints
- Industry-leading accuracy
- Dedicated security support

Learn more: [https://dashboard.guardianstack.ai](https://dashboard.guardianstack.ai)

## Security Updates

Security updates will be released as patch versions and announced via:

1. GitHub Security Advisories
2. Release notes on GitHub
3. npm package updates
4. Email notifications to security@guardianstack.ai subscribers

## Questions

If you have questions about this security policy, please open a GitHub issue with the `security` label or email security@guardianstack.ai.

## Attribution

We appreciate the security research community and will credit researchers who report valid vulnerabilities (unless they prefer to remain anonymous).

Thank you for helping keep GuardianJS Free and our users safe!

