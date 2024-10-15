import express from "express";
import {
  createBridgeRequestSchema,
  CreateBridgeRequest,
} from "@home-assistant-matter-hub/common";
import { PortAlreadyInUseError } from "../errors/port-already-in-use-error.js";
import { BridgeService } from "../matter/bridge-service.js";
import { bridgeToJson } from "../utils/json/bridge-to-json.js";
import { deviceToJson } from "../utils/json/device-to-json.js";
import { Ajv } from "ajv";

const ajv = new Ajv();

export function matterApi(matterServer: BridgeService): express.Router {
  const router = express.Router();
  router.get("/", (req, res) => {
    res.status(200).json(matterServer);
  });

  router.get("/bridges", (_, res) => {
    res.status(200).json(matterServer.bridges.map(bridgeToJson));
  });

  router.post("/bridges", async (req, res) => {
    const body = req.body as CreateBridgeRequest;
    const isValid = ajv.validate(createBridgeRequestSchema, body);
    if (!isValid) {
      res.status(400).json(ajv.errors);
    } else {
      try {
        const bridge = await matterServer.create(body);
        res.status(200).json(bridgeToJson(bridge));
      } catch (error: unknown) {
        if (error instanceof PortAlreadyInUseError) {
          res.status(400).json({ error: error.message });
        }
        throw error;
      }
    }
  });

  router.get("/bridges/:bridgeId", async (req, res) => {
    const bridgeId = req.params.bridgeId;
    const bridge = matterServer.bridges.find((b) => b.id === bridgeId);
    if (bridge) {
      res.status(200).json(bridgeToJson(bridge));
    } else {
      res.status(404).send("Not Found");
    }
  });

  router.delete("/bridges/:bridgeId", async (req, res) => {
    const bridgeId = req.params.bridgeId;
    await matterServer.delete(bridgeId);
    res.status(204).send();
  });

  router.get("/bridges/:bridgeId/devices", async (req, res) => {
    const bridgeId = req.params.bridgeId;
    const bridge = matterServer.bridges.find((b) => b.id === bridgeId);
    if (bridge) {
      res.status(200).json(bridge.devices.map(deviceToJson));
    } else {
      res.status(404).send("Not Found");
    }
  });

  return router;
}