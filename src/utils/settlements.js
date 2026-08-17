/**
 * A partir dos saldos líquidos de cada pessoa (computeBalances), calcula o
 * conjunto mínimo de transferências para todos ficarem a zero.
 *
 * Isto resolve o caso de haver mais do que um "pagador" no grupo: em vez de
 * assumir que toda a gente deve dinheiro diretamente a quem está a ver o
 * ecrã, distribui corretamente entre todos os credores.
 *
 * Retorna uma lista de { from, to, amount } — from deve `amount` a to.
 */
export function computeSettlements(balances) {
  const EPS = 0.005;

  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([name, balance]) => {
    const rounded = Math.round(balance * 100) / 100;
    if (rounded > EPS) creditors.push({ name, amount: rounded });
    else if (rounded < -EPS) debtors.push({ name, amount: -rounded });
  });

  // Maiores primeiro — minimiza o número de transferências geradas.
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.amount, creditor.amount);

    if (amount > EPS) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(amount * 100) / 100,
      });
    }

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount <= EPS) i++;
    if (creditor.amount <= EPS) j++;
  }

  return settlements;
}
