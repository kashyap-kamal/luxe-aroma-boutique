"use client";

import { validatePassword, getPasswordRequirements, getStrengthBgColor } from "@/lib/password-validator";
import { Check, X } from "lucide-react";

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

  // Check individual requirements
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  return (
    <div className="space-y-3 mt-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Password strength:</span>
          <span
            className={`font-medium ${
              validation.strength === "weak"
                ? "text-red-500"
                : validation.strength === "medium"
                ? "text-yellow-500"
                : validation.strength === "strong"
                ? "text-blue-500"
                : "text-green-500"
            }`}
          >
            {validation.strength
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthBgColor(
              validation.strength
            )}`}
            style={{ width: `${validation.score}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            Password requirements:
          </p>
          <ul className="space-y-1 text-xs">
            <li
              className={`flex items-center gap-2 ${
                checks.length ? "text-green-600" : "text-gray-500"
              }`}
            >
              {checks.length ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
              <span>{requirements[0]}</span>
            </li>
            <li
              className={`flex items-center gap-2 ${
                checks.uppercase ? "text-green-600" : "text-gray-500"
              }`}
            >
              {checks.uppercase ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
              <span>{requirements[1]}</span>
            </li>
            <li
              className={`flex items-center gap-2 ${
                checks.lowercase ? "text-green-600" : "text-gray-500"
              }`}
            >
              {checks.lowercase ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
              <span>{requirements[2]}</span>
            </li>
            <li
              className={`flex items-center gap-2 ${
                checks.number ? "text-green-600" : "text-gray-500"
              }`}
            >
              {checks.number ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
              <span>{requirements[3]}</span>
            </li>
            <li
              className={`flex items-center gap-2 ${
                checks.special ? "text-green-600" : "text-gray-500"
              }`}
            >
              {checks.special ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
              <span>{requirements[4]}</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

