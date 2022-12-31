export function fetchBodyPartCost(bodyParts: BodyPartConstant[]): number {
  let cost = 0;
  bodyParts.forEach(bodyPart => {
    cost = cost + BODYPART_COST[bodyPart];
  });
  return cost;
}
