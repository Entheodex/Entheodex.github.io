import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export function registerRoutes(app: Express): Server {
  if (!app || typeof app.get !== 'function') {
    console.error("CRITICAL ERROR: registerRoutes received an invalid Express app object.");
    return createServer();
  }

  app.get("/api/doses", async (_req, res) => {
    try {
      const allDoses = await storage.getDoses();
      res.json(allDoses);
    } catch (error) {
      console.error("Fetch error:", error);
      res.status(500).json({ message: "Failed to fetch doses" });
    }
  });

  app.post("/api/doses", async (req, res) => {
    try {
      const doseData = req.body;
      console.log("Receiving dose log for:", doseData.substance);

      if (!doseData.substance || !doseData.doseTime) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newDose = await storage.createDose({
        substance: doseData.substance,
        doseTime: new Date(doseData.doseTime),
        quantity: doseData.quantity || "1",
        unit: doseData.unit || "mg"
      });

      res.json(newDose);
    } catch (error) {
      console.error("Dose creation error:", error);
      res.status(500).json({ message: "Failed to log dose" });
    }
  });

  app.delete("/api/doses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      await storage.deleteDose(id);
      res.status(200).json({ message: "Dose deleted successfully" });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ message: "Failed to delete dose" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
