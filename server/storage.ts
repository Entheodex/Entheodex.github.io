import type { Dose, InsertDose } from "@shared/schema";

export interface IStorage {
  getDoses(): Promise<Dose[]>;
  createDose(dose: InsertDose): Promise<Dose>;
  deleteDose(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private doses: Map<number, Dose> = new Map();
  private currentId = 1;

  async getDoses(): Promise<Dose[]> {
    return Array.from(this.doses.values()).sort(
      (a, b) => new Date(b.doseTime).getTime() - new Date(a.doseTime).getTime()
    );
  }

  async createDose(insertDose: InsertDose): Promise<Dose> {
    const id = this.currentId++;
    const dose: Dose = {
      id,
      substance: insertDose.substance,
      quantity: insertDose.quantity ?? "1",
      unit: insertDose.unit ?? "mg",
      doseTime: insertDose.doseTime,
    };
    this.doses.set(id, dose);
    return dose;
  }

  async deleteDose(id: number): Promise<void> {
    this.doses.delete(id);
  }
}

export const storage = new MemStorage();
