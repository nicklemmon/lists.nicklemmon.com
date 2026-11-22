import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { gzipSync } from "node:zlib";

const html = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((match) => match[1]);

// Guard the single-request output and keep the initial payload small.
assert.doesNotMatch(html, /<script\b[^>]*\bsrc=/i);
assert.doesNotMatch(html, /<link\b[^>]*rel="(?:stylesheet|modulepreload)"/i);
assert.match(html, /<style>[\s\S]+<\/style>/);
assert.ok(Buffer.byteLength(html) < 15_000, "Initial HTML must stay below 15 kB");
assert.ok(gzipSync(html).length < 4_000, "Compressed HTML must stay below 4 kB");
assert.equal((html.match(/<article\b/g) || []).length, 5);
assert.equal((html.match(/target="_blank"/g) || []).length, 9);
for (const code of ["75A-968", "76K-P7S", "C9T-B6D"]) {
  assert.ok(html.includes(`ugiftcode=${code}`));
}
assert.ok(html.includes("(But I really just want 529 contributions for the kids!)"));
for (const match of html.matchAll(/<meta\b[^>]*content="https:\/\/lists\.nicklemmon\.com\/([^\"]+\.png)"/g)) {
  readFileSync(new URL(`../dist/${match[1]}`, import.meta.url));
}

// Run the actual built scripts, including initialization before the page body.
for (const saved of [null, "system", "light", "dark", "invalid"]) {
  for (const storageBlocked of [false, true]) {
    const root = { dataset: {} };
    let onChange;
    const select = { value: "system", addEventListener(event, handler) {
      assert.equal(event, "change");
      onChange = handler;
    } };
    const writes = [];
    const context = {
      document: { documentElement: root, querySelector(selector) {
        assert.equal(selector, "#theme");
        return select;
      } },
      localStorage: {
        getItem() { if (storageBlocked) throw Error("Storage unavailable"); return saved; },
        setItem(key, value) { if (storageBlocked) throw Error("Storage unavailable"); writes.push([key, value]); },
      },
    };
    for (const script of scripts) runInNewContext(script, context);
    assert.equal(select.value, !storageBlocked && ["light", "dark"].includes(saved) ? saved : "system");
    for (const theme of ["dark", "light", "system"]) {
      select.value = theme;
      onChange();
      assert.equal(root.dataset.theme, theme);
      if (!storageBlocked) assert.deepEqual(writes.at(-1), ["wishlist-theme", theme]);
    }
  }
}
console.log(`Build checks passed: one page request, ${Buffer.byteLength(html)} bytes (${gzipSync(html).length} gzip), all cards and theme behavior preserved.`);
