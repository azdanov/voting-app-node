import * as Hashids from "hashids";

export { assignValidationsToSession } from "./session";
export { pugHelpers } from "./pugHelpers";
export { setupPassport } from "../auth/passport";
export { catchAsyncErrors } from "./catchAsyncErrors";
export { logger, logStream } from "./logger";
export { normalizePort, onError, onListening } from "./server";

// type cast to any is necessary for Hashids until @types is updated.
export const hashids = new (<any>Hashids)(process.env.SITE_NAME || "test");
