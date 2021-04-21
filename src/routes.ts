import { Router } from "express";
import { SettingsController } from "./controllers/SettingsController";

const routes = Router();

/**
 * Tipos de parametros
 * Route = parametros de rota
 * query = filtros e busca (marcados por ?)
 * body = objetos json
 */

const settingsController = new SettingsController();

routes.post("/settings", settingsController.create);

export { routes };
