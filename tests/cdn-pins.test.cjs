// Third-party scripts from jsDelivr must be exact-version pinned, and the two script loads must carry integrity hashes.
// Static checks on index.html. Optional deeper check: CDN_PKG_DIR=<folder holding extracted bd/ and tess/ npm packages>.
// Run: node tests/cdn-pins.test.cjs   (how to refresh the pins: docs/CDN_PINS.md)
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
let failed = 0;
const bad = m => { failed++; console.log('FAIL  ' + m); };

// 1. every jsDelivr URL names an exact package version (not @3, @5 or none)
const urls = html.match(/https:\/\/cdn\.jsdelivr\.net\/[^'"\s)]+/g) || [];
if (!urls.length) bad('no jsDelivr URLs found; did the loader move?');
for (const u of urls) if (!/\/npm\/(?:@[\w.-]+\/)?[\w.-]+@\d+\.\d+\.\d+[\/']?/.test(u + '/')) bad('not exact-pinned: ' + u);

// 2. integrity hashes exist, are well formed, and are actually applied by the loader
const sri = n => (html.match(new RegExp(n + "='(sha384-[A-Za-z0-9+/]{64})'")) || [])[1];
const polySri = sri('POLY_SRI'), tessSri = sri('TESS_SRI');
if (!polySri) bad('POLY_SRI missing or malformed');
if (!tessSri) bad('TESS_SRI missing or malformed');
if (!/s\.integrity=sri;s\.crossOrigin='anonymous'/.test(html)) bad('loadScript does not set integrity and crossOrigin');
if (!/loadScript\(POLY_JS,POLY_SRI\)/.test(html)) bad('barcode script is loaded without its integrity hash');
if (!/loadScript\(TESS_JS,TESS_SRI\)/.test(html)) bad('Tesseract script is loaded without its integrity hash');
if (!/createWorker\('eng',1,\{langPath:TESS_LANG\}\)/.test(html)) bad('Tesseract language data is not pinned (langPath)');

// 3. jsDelivr generates *.min.js on the fly for packages that do not ship one, and those bytes can change.
//    Hashing one would break without warning, so a hashed file must be a real file from the package.
const poly = (html.match(/POLY_JS='([^']+)'/) || [])[1] || '';
if (/\.min\.js$/.test(poly)) bad('POLY_JS points at an auto-minified file; use the real file the package ships');

// 4. optional: the hashes match the published package files
const dir = process.env.CDN_PKG_DIR;
if (dir) {
  const sha = f => 'sha384-' + crypto.createHash('sha384').update(fs.readFileSync(f)).digest('base64');
  const check = (label, file, want) => { try { if (sha(file) !== want) bad(label + ' hash does not match ' + file); } catch (e) { bad(label + ': ' + e.message); } };
  check('POLY_SRI', path.join(dir, 'bd/package/dist/iife/ponyfill.js'), polySri);
  check('TESS_SRI', path.join(dir, 'tess/package/dist/tesseract.min.js'), tessSri);
} else console.log('(skipped hash-vs-package check: set CDN_PKG_DIR to run it)');

console.log(failed ? failed + ' failed' : 'cdn-pins: all checks passed (' + urls.length + ' pinned URLs, 2 integrity hashes)');
process.exit(failed ? 1 : 0);
