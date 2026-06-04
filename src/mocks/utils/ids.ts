let idCounter = 0;

export function createId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function resetIdCounter(): void {
  idCounter = 0;
}
