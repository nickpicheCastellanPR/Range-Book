export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/** Population standard deviation — used as a "how wide is the miss pattern" spread. */
export function stdev(nums: number[]): number {
  if (nums.length === 0) return 0;
  const mean = avg(nums);
  return Math.sqrt(avg(nums.map((n) => (n - mean) ** 2)));
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
