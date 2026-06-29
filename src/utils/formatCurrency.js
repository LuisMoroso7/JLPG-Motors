export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function calcFinancing({ price, downPayment, months, rate = 1.49 }) {
  const principal = price - downPayment;
  if (principal <= 0) return 0;
  const r = rate / 100;
  const installment = principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return installment;
}
