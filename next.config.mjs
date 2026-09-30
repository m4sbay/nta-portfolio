import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** Keep dev assets separate from production builds and preview servers. */
export default function nextConfig(phase) {
  return {
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next"
  };
}
