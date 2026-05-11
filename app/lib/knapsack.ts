import { getRelicsSortedByRatio } from "./relics";
import {
  KnapsackResponse,
  RelicAllocation,
  GreedyStep,
} from "./types";

export const BACKPACK_CAPACITY = 12;

export function solveKnapsack(): KnapsackResponse {
  // ordena reliquias
  const sortedRelics = getRelicsSortedByRatio();

  let remainingCapacity = BACKPACK_CAPACITY;
  let totalValue = 0;
  let totalWeight = 0;

  const selectedRelics: RelicAllocation[] = [];
  const skippedRelics: RelicAllocation[] = [];
  const steps: GreedyStep[] = [];
  let stepOrder = 1;

  for (const relic of sortedRelics) {
    //calcula quantas unidades inteiras cabem no espaco restante da mochila
    const maxThatFit = Math.floor(remainingCapacity / relic.weight);

    //restringe a quantidade pelo que realmente existe no inventario da dungeon
    const quantityTaken = Math.min(maxThatFit, relic.quantity);

    const allocation: RelicAllocation = {
      relicId: relic.id,
      name: relic.name,
      icon: relic.icon,
      unitWeight: relic.weight,
      unitValue: relic.value,
      ratio: relic.ratio,
      quantityAvailable: relic.quantity,
      quantityTaken,
      totalWeight: roundTo(quantityTaken * relic.weight, 2),
      totalValue: quantityTaken * relic.value,
    };

    //se couber pelo menos uma unidade, adiciona a mochila e atualiza os totais
    if (quantityTaken > 0) {
      selectedRelics.push(allocation);
      remainingCapacity -= allocation.totalWeight;
      totalValue += allocation.totalValue;
      totalWeight += allocation.totalWeight;

      steps.push({
        order: stepOrder++,
        relicId: relic.id,
        name: relic.name,
        ratio: relic.ratio,
        quantityTaken,
        totalValueAdded: allocation.totalValue,
        remainingCapacity: roundTo(remainingCapacity, 2),
        description:
          `${relic.name}: razao ${relic.ratio} gp/kg, ` +
          `pegou ${quantityTaken}x (${allocation.totalWeight}kg) ` +
          `valendo ${allocation.totalValue} gp. ` +
          `resta ${roundTo(remainingCapacity, 2)}kg na mochila.`,
      });
    } else {
      //se o peso unitario for maior que o espaco restante, pula a reliquia inteira
      skippedRelics.push(allocation);

      steps.push({
        order: stepOrder++,
        relicId: relic.id,
        name: relic.name,
        ratio: relic.ratio,
        quantityTaken: 0,
        totalValueAdded: 0,
        remainingCapacity: roundTo(remainingCapacity, 2),
        description:
          `${relic.name}: razao ${relic.ratio} gp/kg, ` +
          `peso unitario ${relic.weight}kg nao cabe nos ` +
          `${roundTo(remainingCapacity, 2)}kg restantes. pulou.`,
      });
    }
  }

  return {
    capacity: BACKPACK_CAPACITY,
    selectedRelics,
    skippedRelics,
    totalValue,
    totalWeight: roundTo(totalWeight, 2),
    steps,
  };
}

//arredonda valores para evitar problemas de precisao com ponto flutuante no javascript
function roundTo(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}
