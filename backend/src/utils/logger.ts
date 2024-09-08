/* 
Logging and Monitoring
Why: Logging every request and error helps track the performance and behavior of your app. In production, you’ll need detailed logs for debugging and performance analysis.
How: Use a logging library such as winston or pino to log requests and errors.
*/

import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",  // Log info and above (error, warn)
  format: format.combine(
    format.timestamp(),  // Add timestamps to logs
    format.json()  // Log in JSON format
  ),
  transports: [
    new transports.Console(),  // Log to the console
    new transports.File({ filename: "logs/error.log", level: "error" }),  // Log errors to error.log
    new transports.File({ filename: "logs/combined.log" }),  // Log all messages to combined.log
  ],
});

export default logger;
