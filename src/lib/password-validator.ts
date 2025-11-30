/**
 * Password Validator Utility
 * Provides secure password validation and strength checking
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "medium" | "strong" | "very-strong";
  score: number; // 0-100
}

export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecialChar: boolean;
}

// Default password requirements for secure passwords
const DEFAULT_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

/**
 * Validates password against security requirements
 * Returns detailed validation result with strength score
 */
export function validatePassword(
  password: string,
  requirements: PasswordRequirements = DEFAULT_REQUIREMENTS
): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  // Check minimum length
  if (password.length < requirements.minLength) {
    errors.push(
      `Password must be at least ${requirements.minLength} characters long`
    );
  } else {
    score += 20;
  }

  // Check for uppercase letter
  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  } else if (requirements.requireUppercase) {
    score += 20;
  }

  // Check for lowercase letter
  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  } else if (requirements.requireLowercase) {
    score += 20;
  }

  // Check for number
  if (requirements.requireNumber && !/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  } else if (requirements.requireNumber) {
    score += 20;
  }

  // Check for special character
  if (
    requirements.requireSpecialChar &&
    !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  ) {
    errors.push("Password must contain at least one special character");
  } else if (requirements.requireSpecialChar) {
    score += 20;
  }

  // Additional length bonus
  if (password.length >= 12) {
    score += 10;
  }
  if (password.length >= 16) {
    score += 10;
  }

  // Determine strength level
  let strength: "weak" | "medium" | "strong" | "very-strong";
  if (score < 50) {
    strength = "weak";
  } else if (score < 70) {
    strength = "medium";
  } else if (score < 90) {
    strength = "strong";
  } else {
    strength = "very-strong";
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score: Math.min(score, 100),
  };
}

/**
 * Get password requirements as a human-readable list
 */
export function getPasswordRequirements(): string[] {
  return [
    `At least ${DEFAULT_REQUIREMENTS.minLength} characters long`,
    "One uppercase letter (A-Z)",
    "One lowercase letter (a-z)",
    "One number (0-9)",
    "One special character (!@#$%^&*)",
  ];
}

/**
 * Get strength color for UI display
 */
export function getStrengthColor(
  strength: PasswordValidationResult["strength"]
): string {
  switch (strength) {
    case "weak":
      return "text-red-500";
    case "medium":
      return "text-yellow-500";
    case "strong":
      return "text-blue-500";
    case "very-strong":
      return "text-green-500";
    default:
      return "text-gray-500";
  }
}

/**
 * Get strength background color for progress bar
 */
export function getStrengthBgColor(
  strength: PasswordValidationResult["strength"]
): string {
  switch (strength) {
    case "weak":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    case "strong":
      return "bg-blue-500";
    case "very-strong":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
}

