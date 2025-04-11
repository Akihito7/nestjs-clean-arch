import { UUIDTypes } from "uuid";
import { BaseEntity } from "../entities/base-entity";

export interface BaseRepository<T extends BaseEntity> {
  insert(entity: T): Promise<void>
  findById(id: string): Promise<T | null>
  findAll(): Promise<T[]>
  update(entity: T): Promise<void>
  delete(id: UUIDTypes): Promise<void>
}