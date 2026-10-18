// Bot protection utilities

// Generate a simple math challenge for bot protection
export function generateMathChallenge(): { question: string; answer: number } {
  const num1 = Math.floor(Math.random() * 10) + 1
  const num2 = Math.floor(Math.random() * 10) + 1
  return {
    question: `What is ${num1} + ${num2}?`,
    answer: num1 + num2,
  }
}

// Validate form submission timing (too fast = bot)
export function validateSubmissionTiming(startTime: number): boolean {
  const minimumTime = 3000 // 3 seconds minimum to fill form
  const elapsed = Date.now() - startTime
  return elapsed >= minimumTime
}

// Sanitize user input to prevent XSS
export function sanitizeInput(input: string): string {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").trim()
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone format (basic)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-+()]{7,20}$/
  return phoneRegex.test(phone)
}

// Rate limiting check (uses localStorage on client)
export function checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  if (typeof window === "undefined") return true

  const storageKey = `rate_limit_${key}`
  const now = Date.now()

  try {
    const data = localStorage.getItem(storageKey)
    if (!data) {
      localStorage.setItem(storageKey, JSON.stringify({ attempts: 1, windowStart: now }))
      return true
    }

    const { attempts, windowStart } = JSON.parse(data)

    // Reset window if time has elapsed
    if (now - windowStart > windowMs) {
      localStorage.setItem(storageKey, JSON.stringify({ attempts: 1, windowStart: now }))
      return true
    }

    // If max attempts reached, still check if window has passed
    if (attempts >= maxAttempts) {
      if (now - windowStart > windowMs) {
        localStorage.setItem(storageKey, JSON.stringify({ attempts: 1, windowStart: now }))
        return true
      }
      return false
    }

    localStorage.setItem(storageKey, JSON.stringify({ attempts: attempts + 1, windowStart }))
    return true
  } catch {
    // On error, allow submission
    return true
  }
}

// Record successful submission for rate limiting
export function recordSubmission(key: string): void {
  if (typeof window === "undefined") return

  const storageKey = `submission_${key}`
  const now = Date.now()

  try {
    localStorage.setItem(storageKey, JSON.stringify({ timestamp: now }))
  } catch {
    // Ignore storage errors
  }
}
