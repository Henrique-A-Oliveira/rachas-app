/**
 * Calcula o saldo líquido de cada pessoa a partir do histórico do feed.
 * Positivo = devem-lhe dinheiro. Negativo = essa pessoa deve dinheiro.
 * A soma de todos os saldos é sempre 0.
 */
export function computeBalances(feed, members) {
  const balances = {};
  members.forEach((m) => (balances[m] = 0));

  feed.forEach((item) => {
    if (item.type === "expense") {
      const participants = item.participants && item.participants.length ? item.participants : members;
      const share = item.amount / participants.length;
      balances[item.person] = (balances[item.person] || 0) + item.amount;
      participants.forEach((p) => {
        balances[p] = (balances[p] || 0) - share;
      });
    } else if (item.type === "payment") {
      balances[item.from] = (balances[item.from] || 0) + item.amount;
      balances[item.to] = (balances[item.to] || 0) - item.amount;
    }
  });

  return balances;
}
