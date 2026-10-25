from html.parser import HTMLParser
from urllib.parse import urlsplit
from pathlib import Path

TARGETS = ('evidence-provenance.js', 'product-comparison.js', 'comparison-ui.js', 'saved-food-comparison.js')
INSERT = '<script src="product-comparison.js?v=20261025-compare1"></script><script src="comparison-ui.js?v=20261025-compare1"></script><script src="saved-food-comparison.js?v=20261025-savedcompare1"></script>'

def require(condition, message):
    if not condition:
        raise ValueError(message + '; review before editing')

class Scripts(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.text, self.records, self.current = text, [], None
        self.lines = [0]
        for line in text.splitlines(keepends=True):
            self.lines.append(self.lines[-1] + len(line))
        self.feed(text)
        self.close()
        require(self.current is None, 'Unclosed script')

    def position(self):
        line, column = self.getpos()
        return self.lines[line - 1] + column

    def handle_starttag(self, tag, attrs):
        if tag != 'script':
            return
        attrs = dict(attrs)
        src = attrs.get('src') or ''
        url = urlsplit(src)
        name = url.path.rsplit('/', 1)[-1]
        self.current = dict(name=name, start=self.position(), attrs=attrs)
        if name in TARGETS:
            require(not url.scheme and not url.netloc and url.path in (name, './' + name), 'Unexpected script location: ' + src)
            require('async' not in attrs and attrs.get('type', '').lower() in ('', 'text/javascript', 'application/javascript'), 'Unexpected execution mode: ' + src)

    def handle_endtag(self, tag):
        if tag == 'script' and self.current is not None:
            self.current['end'] = self.text.index('>', self.position()) + 1
            self.records.append(self.current)
            self.current = None

    def handle_startendtag(self, tag, attrs):
        require(tag != 'script', 'Self-closing script')

def wire(text):
    records = Scripts(text).records
    found = {name: [r for r in records if r['name'] == name] for name in TARGETS}
    require(len(found[TARGETS[0]]) == 1, 'Expected exactly one provenance script')
    counts = [len(found[name]) for name in TARGETS[1:]]
    anchor = found[TARGETS[0]][0]
    if counts == [0, 0, 0]:
        require('defer' not in anchor['attrs'], 'Deferred provenance anchor')
        end = anchor['end']
        return text[:end] + INSERT + text[end:], 'inserted'
    require(counts == [1, 1, 1], 'Partial or duplicate comparison wiring')
    ordered = [found[name][0] for name in TARGETS]
    positions = [r['start'] for r in ordered]
    require(positions == sorted(positions), 'Comparison scripts out of order')
    require(len({'defer' in r['attrs'] for r in ordered}) == 1, 'Mixed deferred and immediate scripts')
    return text, 'already-wired'

if __name__ == '__main__':
    page = Path('index.html')
    original = page.read_text()
    updated, status = wire(original)
    if updated != original:
        page.write_text(updated)
    print('Comparison wiring:', status)
