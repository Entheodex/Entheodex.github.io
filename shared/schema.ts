import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const doses = pgTable("doses", {
  id: serial("id").primaryKey(),
  substance: text("substance").notNull(),
  // --- NEW FIELDS ---
  quantity: text("quantity").notNull().default("1"), // Stored as text to handle "1.5" etc easily
  unit: text("unit").notNull().default("mg"),
  // ------------------
  doseTime: timestamp("dose_time").notNull(),
});

export const insertDoseSchema = createInsertSchema(doses).pick({
  substance: true,
  doseTime: true,
  quantity: true,
  unit: true,
});

export type InsertDose = z.infer<typeof insertDoseSchema>;
export type Dose = typeof doses.$inferSelect;