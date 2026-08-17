/**
 * Calcula quem deve a quem, com base nas despesas reais em que cada pessoa
 * participou — não num saldo abstrato do grupo.
 *
 * Passo 1: para cada despesa, cada participante (exceto quem pagou) fica a
 *          dever ao pagador a sua fatia.
 * Passo 2: um pagamento ("marcar pago") reduz o que a pessoa que pagou devia
 *          a quem recebeu.
 * Passo 3: para cada par de pessoas, se A deve a B e B deve a A ao mesmo
 *          tempo (porque participaram em despesas uma da outra), isso é
 *          deduzido — fica só a diferença, numa única direção.
 *
 * Retorna uma lista de { from, to, amount } — from deve `amount` a to.
 */
export function computeSettlements(feed, members) {
  const EPS = 0.005;

  // debts[A][B] = quanto A deve a B (bruto, antes de deduzir o inverso)
  const debts = {};
  members.forEach((m) => {
    debts[m] = {};
  });

  feed.forEach((item) => {
    if (item.type === "expense") {
      const participants = item.participants && item.participants.length ? item.participants : members;
      const share = item.amount / participants.length;
      participants.forEach((p) => {
        if (p !== item.person) {
          debts[p][item.person] = (debts[p]?.[item.person] || 0) + share;
        }
      });
    } else if (item.type === "payment") {
      // um pagamento de "from" a "to" reduz o que "from" devia a "to"
      debts[item.from][item.to] = (debts[item.from]?.[item.to] || 0) - item.amount;
    }
  });

  // Deduz cada par: só interessa a diferença, numa única direção.
  const settlements = [];
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const a = members[i];
      const b = members[j];
      const aOwesB = debts[a]?.[b] || 0;
      const bOwesA = debts[b]?.[a] || 0;
      const net = Math.round((aOwesB - bOwesA) * 100) / 100;

      if (net > EPS) {
        settlements.push({ from: a, to: b, amount: net });
      } else if (net < -EPS) {
        settlements.push({ from: b, to: a, amount: -net });
      }
    }
  }

  return settlements;
}
