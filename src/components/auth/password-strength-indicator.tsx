"use client";

import { validatePassword, getPasswordRequirements } from "@/lib/password-validator";
import { Check, X } from "lucide-react";

const INK = "#0E0E0C";
const SAFFRON = "#E8763A";

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

export function PasswordStrengthIndicator({
  password,
  showRequirements = true,
}: PasswordStrengthIndicatorProps) {
  if (!password) {
    return null;
  }

  const validation = validatePassword(password);
  const requirements = getPasswordRequirements();

  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  ];

  const barColor =
    validation.strength === "weak"
      ? "#B42318"
      : validation.strength === "medium"
      ? SAFFRON
      : "#1F6F43";

  return (
    <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: INK, opacity: 0.55 }}>STRENGTH</span>
          <span style={{ color: barColor, fontWeight: 600 }}>
            {validation.strength.replace("-", " ")}
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: 3,
            background: "rgba(14,14,12,0.12)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${validation.score}%`,
              background: barColor,
              transition: "width 240ms ease, background 240ms ease",
            }}
          />
        </div>
      </div>

      {showRequirements && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 4 }}>
          {requirements.map((req, idx) => {
            const passed = checks[idx];
            return (
              <li
                key={req}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.08em",
                  color: passed ? "#1F6F43" : INK,
                  opacity: passed ? 1 : 0.5,
                }}
              >
                {passed ? (
                  <Check style={{ width: 11, height: 11, flexShrink: 0 }} />
                ) : (
                  <X style={{ width: 11, height: 11, flexShrink: 0 }} />
                )}
                <span>{req}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
