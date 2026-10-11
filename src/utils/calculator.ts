// Safe and versatile mathematical evaluation for MathSphere

export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    return NaN;
  }
  if (n > 170) return Infinity; // JS max float limit
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

export function formatResult(num: number): string {
  if (isNaN(num)) return 'Error';
  if (!isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity';

  // Fix floating point precision artifacts like 0.0000000000000001 or 0.999999999999999
  const rounded = Number(num.toPrecision(12));

  // If number is very large or very small (and non-zero), use exponential notation if needed
  const abs = Math.abs(rounded);
  if ((abs >= 1e12 || (abs < 1e-6 && abs > 0))) {
    return rounded.toExponential(6).replace(/\.?0+e/, 'e');
  }

  // Format standard float cleanly
  const fixed = Number(rounded.toFixed(10));
  return fixed.toString();
}

/**
 * Evaluates a mathematical expression string in DEG or RAD angle mode.
 */
export function evaluateExpression(rawExpr: string, isDegreeMode: boolean): { success: boolean; result: string; rawValue: number } {
  try {
    if (!rawExpr || rawExpr.trim() === '') {
      return { success: true, result: '0', rawValue: 0 };
    }

    let expr = rawExpr.trim();

    // Replace visual symbols with internal representations
    expr = expr.replace(/×/g, '*');
    expr = expr.replace(/÷/g, '/');
    expr = expr.replace(/−/g, '-');
    expr = expr.replace(/π/g, '(Math.PI)');
    expr = expr.replace(/\be\b/g, '(Math.E)');

    // Percentage handling: e.g. 50% -> (50/100) or number% -> (number*0.01)
    expr = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

    // Power handling: ^ -> **
    expr = expr.replace(/\^/g, '**');

    // Square root: sqrt( -> Math.sqrt(
    expr = expr.replace(/√\(/g, 'Math.sqrt(');
    expr = expr.replace(/sqrt\(/g, 'Math.sqrt(');

    // Natural log & log10
    expr = expr.replace(/ln\(/g, 'Math.log(');
    expr = expr.replace(/log\(/g, 'Math.log10(');

    // Trigonometry functions with DEG vs RAD support
    // For DEG mode, sin(x) becomes Math.sin((x) * Math.PI / 180)
    if (isDegreeMode) {
      expr = expr.replace(/sin\(/g, '__deg_sin(');
      expr = expr.replace(/cos\(/g, '__deg_cos(');
      expr = expr.replace(/tan\(/g, '__deg_tan(');
    } else {
      expr = expr.replace(/sin\(/g, 'Math.sin(');
      expr = expr.replace(/cos\(/g, 'Math.cos(');
      expr = expr.replace(/tan\(/g, 'Math.tan(');
    }

    // Factorials: e.g. 5! -> factorial(5) or (3+2)! -> factorial(3+2)
    expr = expr.replace(/(\d+(\.\d+)?|\([^)]+\))!/g, '__fact($1)');

    // Balance closing parentheses automatically if user omitted trailing ones
    const openParens = (expr.match(/\(/g) || []).length;
    const closeParens = (expr.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      expr += ')'.repeat(openParens - closeParens);
    }

    // Helper trigonometric implementations with degree zero-snapping
    const __deg_sin = (deg: number) => {
      const normalized = ((deg % 360) + 360) % 360;
      if (normalized === 0 || normalized === 180) return 0;
      if (normalized === 90) return 1;
      if (normalized === 270) return -1;
      return Math.sin((deg * Math.PI) / 180);
    };

    const __deg_cos = (deg: number) => {
      const normalized = ((deg % 360) + 360) % 360;
      if (normalized === 90 || normalized === 270) return 0;
      if (normalized === 0) return 1;
      if (normalized === 180) return -1;
      return Math.cos((deg * Math.PI) / 180);
    };

    const __deg_tan = (deg: number) => {
      const normalized = ((deg % 360) + 360) % 360;
      if (normalized === 90 || normalized === 270) return Infinity;
      if (normalized === 0 || normalized === 180) return 0;
      if (normalized === 45 || normalized === 225) return 1;
      if (normalized === 135 || normalized === 315) return -1;
      return Math.tan((deg * Math.PI) / 180);
    };

    const __fact = factorial;

    // Build safe execution function with injected Math context
    const fn = new Function('Math', '__deg_sin', '__deg_cos', '__deg_tan', '__fact', `"use strict"; return (${expr});`);
    const evaluated = fn(Math, __deg_sin, __deg_cos, __deg_tan, __fact);

    if (typeof evaluated !== 'number' || isNaN(evaluated)) {
      return { success: false, result: 'Error', rawValue: NaN };
    }

    return {
      success: true,
      result: formatResult(evaluated),
      rawValue: evaluated,
    };
  } catch {
    return { success: false, result: 'Error', rawValue: NaN };
  }
}
  



