// Controllo prima della pubblicazione: nelle pagine pubbliche generate non devono restare
// segnaposto "[[...]]" né "DA CONFERMARE". Eseguito dopo ogni build (npm run build).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const roots = [".next/server/app/it", ".next/server/app/en", ".next/server/app/it.html", ".next/server/app/en.html"];
const bad = [];

function walk(p) {
  let st;
  try {
    st = statSync(p);
  } catch {
    return;
  }
  if (st.isDirectory()) return readdirSync(p).forEach((f) => walk(join(p, f)));
  if (!p.endsWith(".html")) return;
  const text = readFileSync(p, "utf8");
  for (const re of [/\[\[[A-ZÀ-Ý][^\]]{0,80}\]\]/g, /DA CONFERMARE/g]) {
    for (const m of text.matchAll(re)) bad.push(`${p}: ${m[0]}`);
  }
}

roots.forEach(walk);
if (bad.length) {
  console.error(`\n✗ Segnaposto ancora presenti nelle pagine pubbliche (${bad.length}):`);
  console.error([...new Set(bad)].slice(0, 20).join("\n"));
  process.exit(1);
}
console.log("✓ Nessun segnaposto nelle pagine pubbliche.");
