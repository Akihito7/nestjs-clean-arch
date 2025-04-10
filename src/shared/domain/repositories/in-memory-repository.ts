import { NotFoundError } from "@/shared/errors/not-found-error";
import { BaseEntity } from "../entities/base-entity";
import { BaseRepository } from "./base-repository.interface";

interface GetItemResponse<T> {
  item: T,
  index: number
}

export abstract class InMemoryRepository<T extends BaseEntity> implements BaseRepository<T> {
  public items: T[] = [];

  async insert(entity: T): Promise<void> {
    this.items.push(entity)
  }

  async findById(id: string): Promise<T | null> {
    return this.items.find((item) => item.id === id) ?? null
  }

  async findAll(): Promise<T[]> {
    return this.items;
  }

  async update(entity: T): Promise<void> {
    if (!entity.id) {
      throw new Error("Entity precisa ter um ID para ser atualizada.");
    }
    const { index } = this.getItem(entity.id.toString())
    this.items[index] = entity
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter(item => item.id !== id);
  }

  protected getItem(id: string): GetItemResponse<T> {
    const item = this.items.find(item => item.id === id)
    if (!item) {
      throw new NotFoundError(`Item com id ${id} não encontrado.`)
    }
    const index = this.items.findIndex(item => item.id === id);
    return {
      item,
      index
    }
  }

}