export function formatCurrency(value, currency = 'BRL') {
  const safeValue = Number(value) || 0;

  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(safeValue);
  } catch (e) {
    return `${currency} ${safeValue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;
  }
}

export function calcFinancing({ price, downPayment, months, rate = 1.49 }) {
  const principal = price - downPayment;
  if (principal <= 0) return 0;
  const r = rate / 100;
  const installment = principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return installment;
}
