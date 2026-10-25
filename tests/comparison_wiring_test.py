import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('guard', Path(__file__).resolve().parents[1] / '.github/scripts/comparison_wiring.py')
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)

class WiringTests(unittest.TestCase):
    def test_insertion_and_rerun(self):
        anchor = '<script src="evidence-provenance.js?v=old"></script>'
        wired, status = guard.wire(anchor)
        self.assertEqual(status, 'inserted')
        self.assertEqual(guard.wire(wired), (wired, 'already-wired'))

    def test_existing_variants(self):
        anchor = '<script src="evidence-provenance.js?v=new"></script>'
        wired = anchor + guard.INSERT.replace('20261025-compare1', 'new')
        variants = [wired, wired.replace('src="', 'src="./'), wired.replace('"', "'"), wired.replace('<script src="saved-food', '<script src="comparison-source.js?v=new"></script><script src="saved-food')]
        for html in variants:
            with self.subTest(html=html):
                self.assertEqual(guard.wire(html), (html, 'already-wired'))

    def test_comment_and_closing_whitespace(self):
        anchor = '<script src="evidence-provenance.js"></script >'
        html = anchor + '<!-- saved-food-comparison.js -->'
        self.assertEqual(guard.wire(html), (anchor + guard.INSERT + '<!-- saved-food-comparison.js -->', 'inserted'))

    def test_rejects_unsafe_states(self):
        anchor = '<script src="evidence-provenance.js"></script>'
        wired = anchor + guard.INSERT
        cases = [guard.INSERT, anchor + wired, anchor + '<script src="product-comparison.js"></script>', wired + '<script src="comparison-ui.js"></script>', guard.INSERT + anchor, wired.replace('src="comparison-ui.js', 'src="https://example.invalid/comparison-ui.js'), wired.replace('<script src="comparison-ui.js', '<script async src="comparison-ui.js'), wired.replace('<script src="comparison-ui.js', '<script defer src="comparison-ui.js'), anchor + '<script src="product-comparison.js">', anchor + '<script src="comparison-ui.js"/>']
        for html in cases:
            with self.subTest(html=html), self.assertRaises(ValueError):
                guard.wire(html)

if __name__ == '__main__':
    unittest.main()
