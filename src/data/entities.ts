import type { Entity } from "../types/entity";
import { entity as universitasBaiturrahmah } from "../content/entities/universitas-baiturrahmah";
import { entity as rsgmpBaiturrahmah } from "../content/entities/rsgmp-baiturrahmah";

export const entities: Entity[] = [universitasBaiturrahmah, rsgmpBaiturrahmah];

export function getEntity(slug: string): Entity | undefined {
  return entities.find(entity => entity.slug === slug);
}
