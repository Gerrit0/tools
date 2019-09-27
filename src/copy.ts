export function stripCopy (text: string): string {
  return text.split('\n').slice(0, -2).join('\n')
}
