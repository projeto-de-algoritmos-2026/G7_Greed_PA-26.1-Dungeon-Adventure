import { getRelicsSortedByRatio } from "./relics";
import {
  KnapsackResponse,
  RelicAllocation,
  GreedyStep,
} from "./types";

export const BACKPACK_CAPACITY = 74;

export function solveKnapsack(): KnapsackResponse {
  // ordena reliquias pela razao valor/peso (maior primeiro)
  const sortedRelics = getRelicsSortedByRatio();

  let remainingCapacity = BACKPACK_CAPACITY;
  let totalValue = 0;
  let totalWeight = 0;

  const selectedRelics: RelicAllocation[] = [];
  const skippedRelics: RelicAllocation[] = [];
  const steps: GreedyStep[] = [];
  let stepOrder = 1;

  for (const relic of sortedRelics) {
    // se a mochila ja esta cheia, nao precisa avaliar mais nada
    if (remainingCapacity <= 0) break;

    //calcula quantas unidades inteiras cabem no espaco restante da mochila
    const maxThatFit = Math.floor(remainingCapacity / relic.weight);

    //restringe a quantidade pelo que realmente existe no inventario da dungeon
    const quantityTaken = Math.min(maxThatFit, relic.quantity);

    // peso ocupado pelas unidades inteiras
    const weightOfWhole = quantityTaken * relic.weight;

    // verifica se sobra espaco para uma fracao do proximo item deste tipo
    let fractionTaken = 0;
    let fractionWeight = 0;
    let fractionValue = 0;

    const spaceAfterWhole = remainingCapacity - weightOfWhole;

    // se pegou todas as unidades inteiras disponiveis e ainda sobra espaco,
    // nao ha mais unidades para fracionar deste item.
    // se nao pegou todas (limitado pelo espaco), fracionamos a proxima unidade
    if (quantityTaken < relic.quantity && spaceAfterWhole > 0 && spaceAfterWhole < relic.weight) {
      fractionTaken = roundTo(spaceAfterWhole / relic.weight, 4);
      fractionWeight = roundTo(spaceAfterWhole, 2);
      fractionValue = roundTo(fractionTaken * relic.value, 2);
    }

    const allocTotalWeight = roundTo(weightOfWhole + fractionWeight, 2);
    const allocTotalValue = roundTo(quantityTaken * relic.value + fractionValue, 2);

    const allocation: RelicAllocation = {
      relicId: relic.id,
      name: relic.name,
      icon: relic.icon,
      unitWeight: relic.weight,
      unitValue: relic.value,
      ratio: relic.ratio,
      quantityAvailable: relic.quantity,
      quantityTaken,
      fractionTaken,
      totalWeight: allocTotalWeight,
      totalValue: allocTotalValue,
    };

    //se couber pelo menos uma unidade ou uma fracao, adiciona a mochila
    if (quantityTaken > 0 || fractionTaken > 0) {
      selectedRelics.push(allocation);
      remainingCapacity = roundTo(remainingCapacity - allocTotalWeight, 2);
      totalValue = roundTo(totalValue + allocTotalValue, 2);
      totalWeight = roundTo(totalWeight + allocTotalWeight, 2);

      // monta descricao do passo
      let desc = `${relic.name}: razao ${relic.ratio} gp/kg, `;

      if (quantityTaken > 0 && fractionTaken > 0) {
        desc +=
          `pegou ${quantityTaken}x inteiro(s) + ${roundTo(fractionTaken * 100, 1)}% fracao ` +
          `(${allocTotalWeight}kg) valendo ${allocTotalValue} gp. ` +
          `resta ${roundTo(remainingCapacity, 2)}kg na mochila.`;
      } else if (quantityTaken > 0) {
        desc +=
          `pegou ${quantityTaken}x (${allocTotalWeight}kg) ` +
          `valendo ${allocTotalValue} gp. ` +
          `resta ${roundTo(remainingCapacity, 2)}kg na mochila.`;
      } else {
        desc +=
          `pegou ${roundTo(fractionTaken * 100, 1)}% de 1 unidade ` +
          `(${allocTotalWeight}kg) valendo ${allocTotalValue} gp. ` +
          `resta ${roundTo(remainingCapacity, 2)}kg na mochila.`;
      }

      steps.push({
        order: stepOrder++,
        relicId: relic.id,
        name: relic.name,
        ratio: relic.ratio,
        quantityTaken,
        fractionTaken,
        totalValueAdded: allocTotalValue,
        remainingCapacity: roundTo(remainingCapacity, 2),
        description: desc,
      });
    } else {
      //se o peso unitario for maior que o espaco restante, fraciona
      if (remainingCapacity > 0 && relic.weight > remainingCapacity) {
        fractionTaken = roundTo(remainingCapacity / relic.weight, 4);
        fractionWeight = roundTo(remainingCapacity, 2);
        fractionValue = roundTo(fractionTaken * relic.value, 2);

        const fracAllocation: RelicAllocation = {
          relicId: relic.id,
          name: relic.name,
          icon: relic.icon,
          unitWeight: relic.weight,
          unitValue: relic.value,
          ratio: relic.ratio,
          quantityAvailable: relic.quantity,
          quantityTaken: 0,
          fractionTaken,
          totalWeight: fractionWeight,
          totalValue: fractionValue,
        };

        selectedRelics.push(fracAllocation);
        totalValue = roundTo(totalValue + fractionValue, 2);
        totalWeight = roundTo(totalWeight + fractionWeight, 2);
        remainingCapacity = 0;

        steps.push({
          order: stepOrder++,
          relicId: relic.id,
          name: relic.name,
          ratio: relic.ratio,
          quantityTaken: 0,
          fractionTaken,
          totalValueAdded: fractionValue,
          remainingCapacity: 0,
          description:
            `${relic.name}: razao ${relic.ratio} gp/kg, ` +
            `nao cabe inteiro (${relic.weight}kg), ` +
            `pegou ${roundTo(fractionTaken * 100, 1)}% de 1 unidade ` +
            `(${fractionWeight}kg) valendo ${fractionValue} gp. ` +
            `mochila cheia!`,
        });
      } else {
        skippedRelics.push(allocation);

        steps.push({
          order: stepOrder++,
          relicId: relic.id,
          name: relic.name,
          ratio: relic.ratio,
          quantityTaken: 0,
          fractionTaken: 0,
          totalValueAdded: 0,
          remainingCapacity: roundTo(remainingCapacity, 2),
          description:
            `${relic.name}: razao ${relic.ratio} gp/kg, ` +
            `peso unitario ${relic.weight}kg nao cabe nos ` +
            `${roundTo(remainingCapacity, 2)}kg restantes. pulou.`,
        });
      }
    }
  }

  return {
    capacity: BACKPACK_CAPACITY,
    selectedRelics,
    skippedRelics,
    totalValue: roundTo(totalValue, 2),
    totalWeight: roundTo(totalWeight, 2),
    steps,
  };
}

//arredonda valores para evitar problemas de precisao com ponto flutuante no javascript
function roundTo(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}
