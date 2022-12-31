export {};
declare global {
  interface LoggingConfiguration {
    severity: "emergency" | "alert" | "critical" | "error" | "warning" | "notice" | "informational" | "debug";
  }
}
