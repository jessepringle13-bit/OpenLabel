// Scanner barcode logic (index.html): which numbers are accepted, how UPC-E is expanded, how noisy digit-reader text is read.
// These decide which product a person sees, so they are checked against real barcodes and an independent check-digit calculation.
// Runs the real code pulled out of index.html. No jsdom, no network. Run: node tests/scanner-barcodes.test.cjs
const fs = require('fs'), vm = require('vm'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const NAMES = ['barcodeDigits', 'norm', 'barcodeEquivalent', 'barcodeCandidates', 'gtinValid', 'upceExpand', 'scannedCode', 'pickGtin'];
let src = '';
for (const n of NAMES) {
  const m = html.match(new RegExp('function ' + n + '\\([^\\n]*'));
  if (!m) { console.error('FAIL: function ' + n + ' not found in index.html'); process.exit(1); }
  src += m[0] + '\n';
}
const ctx = {}; vm.createContext(ctx);
vm.runInContext(src + 'this.f={' + NAMES.join(',') + '};', ctx);
const f = ctx.f;

let failed = 0, total = 0;
function eq(label, got, want) { total++; if (JSON.stringify(got) !== JSON.stringify(want)) { failed++; console.log('FAIL  ' + label + '\n      got  ' + JSON.stringify(got) + '\n      want ' + JSON.stringify(want)); } }

// independent check digit for a body of digits (GS1: weights 3,1,3,1 from the right)
function check(body) { let s = 0; for (let i = body.length - 1, w = 3; i >= 0; i--, w = 4 - w) s += Number(body[i]) * w; return (10 - s % 10) % 10; }

// 1. real barcodes are accepted; broken ones are not
for (const c of ['036000291452', '4006381333931', '3017620422003', '96385074', '012345678905', '00036000291452']) eq('valid ' + c, f.gtinValid(c), true);
eq('wrong check digit', f.gtinValid('036000291453'), false);
eq('11 digits', f.gtinValid('03600029145'), false);
eq('letters', f.gtinValid('03600029145A'), false);
eq('empty', f.gtinValid(''), false);
eq('spaces and hyphens are removed', f.barcodeDigits(' 0 36000-29145 2 '), '036000291452');

// 2. equivalent forms of the same product
eq('UPC-A equals padded EAN-13', f.barcodeEquivalent('036000291452', '0036000291452'), true);
eq('different products are not equivalent', f.barcodeEquivalent('036000291452', '4006381333931'), false);
eq('UPC-A also tried as EAN-13', f.barcodeCandidates('036000291452').includes('0036000291452'), true);
eq('EAN-13 starting with 0 also tried as UPC-A', f.barcodeCandidates('0036000291452').includes('036000291452'), true);
eq('invalid code has no candidates', f.barcodeCandidates('036000291453'), []);

// 3. UPC-E expansion: known pairs, then every pattern built with the independent check digit
eq('Wikipedia pair 04252614', f.upceExpand('04252614'), '042100005264');
eq('GS1 pair 01234565', f.upceExpand('01234565'), '012345000065');
const patterns = { // last digit of the six middle digits decides where the zeros go
  '0': d => d.slice(0, 2) + '0' + '0000' + d.slice(2, 5), '1': d => d.slice(0, 2) + '1' + '0000' + d.slice(2, 5), '2': d => d.slice(0, 2) + '2' + '0000' + d.slice(2, 5),
  '3': d => d.slice(0, 3) + '00000' + d.slice(3, 5), '4': d => d.slice(0, 4) + '00000' + d[4],
  '5': d => d.slice(0, 5) + '0000' + '5', '6': d => d.slice(0, 5) + '0000' + '6', '7': d => d.slice(0, 5) + '0000' + '7', '8': d => d.slice(0, 5) + '0000' + '8', '9': d => d.slice(0, 5) + '0000' + '9',
};
for (const ns of ['0', '1']) for (const first5 of ['12345', '98765', '42526']) for (const l of '0123456789') {
  const mid = first5 + l, upca11 = ns + patterns[l](mid), k = check(upca11);
  eq('expand ' + ns + mid + k, f.upceExpand(ns + mid + k), upca11 + k);
  eq('wrong check digit rejected ' + ns + mid, f.upceExpand(ns + mid + ((k + 1) % 10)), '');
}
eq('number system 2 is not UPC-E', f.upceExpand('24252614'), '');
eq('7 digits', f.upceExpand('0425261'), '');
eq('letters', f.upceExpand('0425261A'), '');

// 4. what the scanner does with a reader result
eq('UPC-E reading becomes UPC-A', f.scannedCode({ format: 'upc_e', rawValue: '04252614' }), '042100005264');
eq('UPC-E already expanded is kept', f.scannedCode({ format: 'upc_e', rawValue: '042100005264' }), '042100005264');
eq('EAN-13 as is', f.scannedCode({ format: 'ean_13', rawValue: '4006381333931' }), '4006381333931');
eq('EAN-8 as is (not read as UPC-E)', f.scannedCode({ format: 'ean_8', rawValue: '96385074' }), '96385074');
eq('bad check digit rejected', f.scannedCode({ format: 'ean_13', rawValue: '4006381333932' }), '');
eq('no format, valid UPC-A', f.scannedCode({ rawValue: '036000291452' }), '036000291452');
eq('missing result', f.scannedCode(null), '');

// 5. digit reader (OCR) text: messy but real numbers are found, invented ones are not
eq('digits split by spaces', f.pickGtin('Barcode\n0 36000 29145 2\nxyz'), '036000291452');
eq('number inside a line', f.pickGtin('EAN 4006381333931 made in DE'), '4006381333931');
eq('13 digits found inside a longer run', f.pickGtin('x1234006381333931'), '4006381333931');
eq('invalid digits give nothing', f.pickGtin('0 36000 29145 3'), null);
eq('empty text', f.pickGtin(''), null);
eq('no digits', f.pickGtin('NUTRITION FACTS'), null);

console.log(failed ? failed + ' of ' + total + ' checks failed' : 'scanner-barcodes: all ' + total + ' checks passed');
process.exit(failed ? 1 : 0);
