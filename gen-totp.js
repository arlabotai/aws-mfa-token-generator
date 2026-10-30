import "dotenv/config";
import { authenticator } from "otplib";


function readSecretFromEnv() {
  const rawSecret = process.env.AWS_MFA_SECRET;
  if (!rawSecret || typeof rawSecret !== "string") {
    throw new Error("AWS_MFA_SECRET no está definido");
  }
  const cleaned = rawSecret.replace(/\s+/g, "").toUpperCase();
  return cleaned;
}

function getTotpOptions() {
  return {
    step: 30,
    digits: 6,
    algorithm: "sha1",
  };
}

function configureAuthenticator(options) {
  authenticator.options = options;
}

function generateCurrentTotp(secret) {
  return authenticator.generate(secret);
}

function getSecondsRemaining() {
  const step = authenticator.options.step;
  const epochSeconds = Math.floor(Date.now() / 1000);
  const remaining = step - (epochSeconds % step);
  return remaining;
}

export function generateTotp() {
  const secret = readSecretFromEnv();
  const options = getTotpOptions();
  configureAuthenticator(options);
  const code = generateCurrentTotp(secret);
  const remaining = getSecondsRemaining();
  return { code, seconds_remaining: remaining };
}
