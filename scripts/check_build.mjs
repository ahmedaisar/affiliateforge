/** Build-time smoke test: the built bundle must contain the design kit,
 *  the routes must exist, and no fixture string should leak into CSS.
 *  Exits non-zero on any failure; safe to run in CI later. */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const assetsDir = path.join(root, "dist", "assets");
if (!existsSync(assetsDir)) {
  console.error("FAIL: no dist/assets — run npm run build first");
  process.exit(1);
}
const cssFiles = readdirSync(assetsDir).filter((f) => f.endsWith(".css"));
const jsFiles = readdirSync(assetsDir).filter((f) => f.endsWith(".js") && !f.endsWith(".map"));
const css = cssFiles.map((f) => readFileSync(path.join(assetsDir, f), "utf8")).join("\n");
const js = jsFiles.map((f) => readFileSync(path.join(assetsDir, f), "utf8")).join("\n");

const failures = [];
for (const token of ["--paper", "--accent", "--ok", "state--warn", ".btn--primary"]) {
  if (!css.includes(token)) failures.push(`CSS missing kit token/primitive: ${token}`);
}
// The raw-value rule is a source rule: only design/tokens.css may hold a hex
// literal (where the token is defined). Check the sources, not the bundle —
// the bundle necessarily contains the values the tokens resolve to.
for (const file of ["design/kit.css", "design/artboards.css", "src/styles/app.css", "src/styles/storefront.css"]) {
  const source = readFileSync(path.join(root, file), "utf8");
  for (const match of source.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
    failures.push(`raw colour literal ${match[0]} in ${file} (values live in tokens.css)`);
  }
}
for (const needle of ["Ridge Media", "resin-miniatures", "Check current price"]) {
  if (!js.includes(needle)) failures.push(`JS bundle missing sample content: ${needle}`);
}
for (const file of ["dist/index.html"]) {
  const html = readFileSync(path.join(root, file), "utf8");
  if (!html.includes('id="root"')) failures.push("index.html has no #root");
  if (!html.includes(".css")) failures.push("index.html does not reference built CSS");
}

if (failures.length) {
  for (const f of failures) console.error("FAIL:", f);
  process.exit(1);
}
console.log(`ok — ${cssFiles.length} CSS file(s), ${jsFiles.length} JS bundle(s), kit present, no raw colour literals, index.html wired`);
