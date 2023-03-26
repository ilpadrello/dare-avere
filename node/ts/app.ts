/**
 * app.ts
 *
 * This is the main Express app. It handles request routing as well as error
 * handlers configuration. Middlewares should be inserted here.
 */

import bodyparser from "body-parser";
import compression from "compression";
import cookieparser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import helmetCSP from "helmet-csp";
import { resolve } from "path";

const app = express();

// security settings
app.set("trust proxy", 1);
app.use(helmet());
app.use(compression());
app.use(
  helmetCSP({
    directives: {
      defaultSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      frameSrc: ["'none'"],
      imgSrc: ["'self'", "data: *"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
    reportOnly: false,
  })
);
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// middlewares
app.use(cookieparser());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// 404
app.use(function (req: Request, res: Response) {
  return res
    .status(404)
    .json({ status: "FAILURE", code: 404, error: "Not found" });
});

// Errors
app.use((req: Request, res: Response) => {
  return res
    .status(500)
    .json({ status: "FAILURE", code: 500, error: "Unhandled error" });
});
