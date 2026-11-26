import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Scena 3D del viaggio (fase 10): con React Three Fiber gli oggetti Three.js si modificano
  // a ogni fotogramma dentro useFrame, per scelta della libreria (niente setState per fotogramma).
  // Queste due regole del React Compiler (non attivo nel progetto) lo segnalerebbero come errore.
  {
    files: ["components/journey/canvas/**"],
    rules: { "react-hooks/immutability": "off", "react-hooks/use-memo": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
