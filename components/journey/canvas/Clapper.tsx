"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { BoxGeometry, CanvasTexture, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace, type Group } from "three";
import { subject } from "../layout";
import { currentChapter, ease, journey, lerp, span } from "../progress";
import { CLAP_AT, methodStep } from "./fx";

/*
 * Capitolo 5 — Metodo: un ciak procedurale (corpo, barra fissa, stecca incernierata).
 * TODO: se arriva /public/models/ciak.glb (stecca come nodo separato, perno sulla cerniera),
 * sostituire le geometrie qui sotto mantenendo la stessa logica di apertura e chiusura.
 * A ogni passo (Ascolto, Direzione, Produzione, Lancio) la stecca si chiude con un colpo
 * (scossa della camera e lampo in fx.ts) e sulla lavagna compare "SCENA 01…04".
 */
const W = 1.6;
const OPEN = 0.52; // apertura della stecca (radianti)

function stripes() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 32;
  const g = c.getContext("2d")!;
  g.fillStyle = "#f7f4ec";
  g.fillRect(0, 0, 256, 32);
  g.fillStyle = "#111111";
  for (let x = -32; x < 256; x += 48) {
    g.beginPath();
    g.moveTo(x, 32);
    g.lineTo(x + 24, 32);
    g.lineTo(x + 48, 0);
    g.lineTo(x + 24, 0);
    g.fill();
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = RepeatWrapping;
  return t;
}

function slate(label: string, n: number) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 640;
  drawSlate(c, label, n);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function drawSlate(c: HTMLCanvasElement, label: string, n: number) {
  const g = c.getContext("2d")!;
  g.fillStyle = "#151412";
  g.fillRect(0, 0, 1024, 640);
  g.strokeStyle = "rgba(247,244,236,0.35)";
  g.lineWidth = 3;
  g.strokeRect(40, 40, 944, 560);
  g.beginPath();
  g.moveTo(40, 250);
  g.lineTo(984, 250);
  g.moveTo(512, 250);
  g.lineTo(512, 600);
  g.stroke();
  const display = getComputedStyle(document.querySelector(".font-display") ?? document.body).fontFamily;
  const sans = getComputedStyle(document.body).fontFamily;
  g.fillStyle = "rgba(247,244,236,0.6)";
  g.font = `28px ${sans}`;
  g.fillText("ACANFORA CREATIVE", 70, 100);
  g.fillStyle = "#f7f4ec";
  g.font = `120px ${display}`;
  g.fillText(label, 70, 210);
  g.font = `220px ${display}`;
  g.fillText(String(n).padStart(2, "0"), 600, 520);
  g.fillStyle = "rgba(247,244,236,0.6)";
  g.font = `28px ${sans}`;
  g.fillText("TAKE 1", 70, 320);
}

/** Angolo della stecca come funzione pura dell'avanzamento del capitolo. */
export function stickAngle(p: number) {
  if (p < 0.15) return OPEN;
  const { step, q } = methodStep(p);
  const close = ease.in(span(q, CLAP_AT - 0.14, CLAP_AT));
  const reopen = step < 3 ? ease.inOut(span(q, 0.86, 1)) : 0;
  return OPEN * (1 - close) + OPEN * reopen * close;
}

export function Clapper() {
  const group = useRef<Group>(null);
  const stick = useRef<Group>(null);
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);
  const shown = useRef(-1);
  const res = useMemo(() => {
    const stripeTex = stripes();
    // Le 4 lavagne (SCENA 01–04) preparate subito: al colpo si scambia solo la texture.
    // Presenti fin dall'inizio, così lo shader viene compilato con la texture (vedi Warmup).
    const slates = [1, 2, 3, 4].map((n) => slate(journey.sceneLabel, n));
    const body = new MeshStandardMaterial({ map: slates[0], color: 0xffffff, roughness: 0.55, metalness: 0.05, transparent: true });
    const side = new MeshStandardMaterial({ color: 0x151412, roughness: 0.6, metalness: 0.1, transparent: true });
    const bar = new MeshStandardMaterial({ map: stripeTex, roughness: 0.45, metalness: 0.05, transparent: true });
    return {
      stripeTex,
      slates,
      body,
      side,
      bar,
      bodyGeo: new BoxGeometry(W, 1.07, 0.08),
      barGeo: new BoxGeometry(W, 0.18, 0.09),
      stickGeo: new BoxGeometry(W, 0.2, 0.07),
    };
  }, []);
  // Lavagne ridisegnate quando i font sono pronti e caricate subito sulla GPU (niente scatti al colpo).
  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => {
      if (!alive) return;
      res.slates.forEach((t, i) => {
        drawSlate(t.image as HTMLCanvasElement, journey.sceneLabel, i + 1);
        t.needsUpdate = true;
        gl.initTexture(t);
      });
    });
    return () => { alive = false; };
  }, [res, gl]);
  useEffect(
    () => () => {
      res.slates.forEach((t) => t.dispose());
      Object.values(res).forEach((r) => (r as { dispose?: () => void }).dispose?.());
    },
    [res],
  );

  useFrame(() => {
    const g = group.current, s = stick.current;
    if (!g || !s) return;
    const ch = currentChapter();
    const p = journey.local[ch];
    const fadeIn = ch === 4 ? span(p, 0.1, 0.2) : 0;
    const fadeOut = ch === 5 ? 1 - span(p, 0, 0.08) : 0;
    const a = Math.max(fadeIn, fadeOut);
    g.visible = a > 0.001;
    if (!g.visible) return;
    for (const m of [res.body, res.side, res.bar]) m.opacity = a;
    // Lavagna: numero della scena, aggiornato solo quando cambia.
    const n = ch === 4 ? methodStep(p).step + 1 : 4;
    if (n !== shown.current) {
      shown.current = n;
      res.body.map = res.slates[n - 1];
    }
    s.rotation.z = ch === 4 ? stickAngle(p) : 0;
    const sub = subject(size.width / size.height);
    g.position.set(sub.x, sub.y + (sub.wide ? 0.12 : -0.05), 0);
    g.scale.setScalar(sub.s * lerp(0.92, 1, a));
    g.rotation.set(-journey.pointer.y * 0.08, -0.28 + journey.pointer.x * 0.12, 0.03);
  });

  return (
    <group ref={group} visible={false}>
      {/* Corpo: la faccia frontale (indice 4) porta la lavagna, le altre sono scure. */}
      <mesh geometry={res.bodyGeo} material={[res.side, res.side, res.side, res.side, res.body, res.side]} position={[0, -0.215, 0]} />
      <mesh geometry={res.barGeo} material={res.bar} position={[0, 0.41, 0]} />
      {/* Stecca incernierata a sinistra. */}
      <group ref={stick} position={[-W / 2, 0.5, 0]}>
        <mesh geometry={res.stickGeo} material={res.bar} position={[W / 2, 0.1, 0]} />
      </group>
    </group>
  );
}
