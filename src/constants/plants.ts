import { createEnumGuard } from "../utils/typeGuards";

export const GrowthFormList = [
  "tree",
  "shrub",
  "herb",
  "grass",
  "vine",
  "succulent",
  "fern",
  "moss",
] as const;
export type GrowthForm = (typeof GrowthFormList)[number];
export const isGrowthForm = createEnumGuard(GrowthFormList);
export const OriginList = ["wild", "cultivated"] as const;
export type Origin = (typeof OriginList)[number];
export const isOrigin = createEnumGuard(OriginList);
//typescript trick: T[number] → “give me the type of whatever is stored inside this tuple/array” because arrays/tuples are indexed by numbers:
//the array is literal tuple (as const);
