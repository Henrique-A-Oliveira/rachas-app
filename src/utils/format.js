/**
 * Formata um valor em euros, arredondado a 2 casas decimais.
 * Mostra "16€" se for um número inteiro, ou "16.67€" caso contrário —
 * evita dízimas longas causadas por divisões (ex: 50 / 3 = 16.666666...).
 */
export function formatEuro(amount) {
  const rounded = Math.round((amount || 0) * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}
