import { Router } from "express";

import { authenticateRoutes } from "./authenticate.routes";
import { carsRoutes } from "./cars.routes";
import { categoriesRoutes } from "./categories.routes";
import { passwordRoutes } from "./password.routes";
import { rentalRoutes } from "./rental.routes";
import { specificationsRoutes } from "./specifications.routes";
import { usersRoutes } from "./users.routes";

const routes = Router();

routes.use(usersRoutes);
routes.use(passwordRoutes);
routes.use(carsRoutes);
routes.use(categoriesRoutes);
routes.use(specificationsRoutes);
routes.use(authenticateRoutes);
routes.use(rentalRoutes);

export { routes };
