import { Relic } from "./types";

export const RELICS: Record<string, Relic> = {
  relogio_chronos: {
    id: "relogio_chronos",
    name: "Relogio Chronos",
    weight: 0.3,
    value: 1200,
    quantity: 1,
    ratio: 4000,
    icon: "relogio_chronos.svg",
  },
  coracao_dragao: {
    id: "coracao_dragao",
    name: "Coracao do Dragao Rubro",
    weight: 1.5,
    value: 4500,
    quantity: 1,
    ratio: 3000,
    icon: "coracao_dragao.svg",
  },
  coroa_rei: {
    id: "coroa_rei",
    name: "Coroa do Rei Afogado",
    weight: 0.8,
    value: 2400,
    quantity: 1,
    ratio: 3000,
    icon: "coroa_rei.svg",
  },
  mascara_cervo: {
    id: "mascara_cervo",
    name: "Mascara do Deus Cervo",
    weight: 0.6,
    value: 1200,
    quantity: 1,
    ratio: 2000,
    icon: "mascara_cervo.svg",
  },
  lanterna_eltar: {
    id: "lanterna_eltar",
    name: "Lanterna de Eltar",
    weight: 0.5,
    value: 900,
    quantity: 2,
    ratio: 1800,
    icon: "lanterna_eltar.svg",
  },
  adaga_eclipse: {
    id: "adaga_eclipse",
    name: "Adaga Eclipse",
    weight: 0.7,
    value: 1050,
    quantity: 3,
    ratio: 1500,
    icon: "adaga_eclipse.svg",
  },
  excalibur: {
    id: "excalibur",
    name: "Excalibur",
    weight: 2.5,
    value: 3500,
    quantity: 1,
    ratio: 1400,
    icon: "excalibur.svg",
  },
  grimorio_vazio: {
    id: "grimorio_vazio",
    name: "Grimorio do Vazio",
    weight: 1.2,
    value: 1440,
    quantity: 2,
    ratio: 1200,
    icon: "grimorio_vazio.svg",
  },
  manopla_tita: {
    id: "manopla_tita",
    name: "Manopla do Tita",
    weight: 4.0,
    value: 3200,
    quantity: 2,
    ratio: 800,
    icon: "manopla_tita.svg",
  },
};

export function getRelicsSortedByRatio(): Relic[] {
  return Object.values(RELICS).sort((a, b) => b.ratio - a.ratio);
}

export function getAllRelics(): Relic[] {
  return Object.values(RELICS);
}
