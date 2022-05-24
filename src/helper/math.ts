import { OtherType } from "src/types/Others.type";

import * as d3 from "d3";
import faker from "@faker-js/faker";

/**
 *
 * @param num
 * @returns number of digit after floating point
 */
export const getNumberOfFloatingDigit = (num: number) => {
  return String(num).replace(/[^0-9]*[.]/g, "").length;
};

type IDistributionItem<T> = {
  frequency: number;
} & OtherType<T>;

/**
 * Roulette wheel selection: https://en.wikipedia.org/wiki/Fitness_proportionate_selection
 * Step 1: Generate an array of frequencies by sum increment for each item
 * @param distributions
 * @returns
 */
export const getCumulativeFrequencies = <Type>(
  distributions: IDistributionItem<Type>[]
): IDistributionItem<Type>[] => {
  let previousSum: number = 0;

  const newDistributions = distributions.map((distribution) => {
    previousSum += Math.abs(distribution.frequency);

    return {
      ...distribution,
      frequency: previousSum,
    };
  });

  return newDistributions;
};

/**
 *
 * Roulette wheel selection: https://en.wikipedia.org/wiki/Fitness_proportionate_selection
 * Step 2: Select a random range
 * @param distributions
 */
export const pickRandomDistribution = <Type>(
  distributions: IDistributionItem<Type>[]
): IDistributionItem<Type> | undefined => {
  if (distributions.length === 0) {
    return undefined;
  }

  const sumOfFitness = distributions[distributions.length - 1].frequency;
  const precisionCount = d3.max(distributions, (item) =>
    getNumberOfFloatingDigit(item.frequency)
  ) as number;
  const randomNumber = faker.datatype.float({
    min: 0,
    max: sumOfFitness,
    precision: precisionCount + 1,
  });

  let selectedIndexRange = 0;

  distributions.some((freq, index) => {
    if (randomNumber < freq.frequency) {
      selectedIndexRange = index;
      return true;
    }
  });

  return distributions[selectedIndexRange];
};
