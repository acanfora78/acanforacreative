/*
 * Capitoli della home "dall'obiettivo alla scena" (fase 10).
 * Ogni capitolo corrisponde a una sezione HTML della home (data-chapter).
 *  - pin: la sezione resta ferma per `vh` di scroll mentre la scena 3D avanza.
 *  - stage: la sezione è trasparente e lascia vedere la tela 3D dietro di sé.
 * I capitoli non ancora costruiti (prototipo) scorrono normalmente: pin false.
 */
export type Chapter = {
  id: string;
  /** Durata dello scroll fissato, in percentuale dell'altezza dello schermo. */
  vh: { desktop: number; mobile: number };
  pin: boolean;
  stage: boolean;
};

export const chapters: Chapter[] = [
  { id: "obiettivo", vh: { desktop: 220, mobile: 150 }, pin: true, stage: true },
  { id: "manifesto", vh: { desktop: 260, mobile: 170 }, pin: true, stage: true },
  { id: "progetti", vh: { desktop: 400, mobile: 240 }, pin: false, stage: false },
  { id: "servizi", vh: { desktop: 360, mobile: 220 }, pin: false, stage: false },
  { id: "metodo", vh: { desktop: 280, mobile: 170 }, pin: false, stage: false },
  { id: "studio", vh: { desktop: 200, mobile: 130 }, pin: false, stage: false },
  { id: "contatto", vh: { desktop: 150, mobile: 100 }, pin: false, stage: false },
];

export const chapterIndex = (id: string) => chapters.findIndex((c) => c.id === id);
