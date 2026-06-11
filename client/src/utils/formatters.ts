export function formatCurrency(amount: number): string {
  return `$ ${amount.toFixed(2)}`;
}

export function formatBalanceSpeech(amount: number): string {
  const fixed = amount.toFixed(2);
  const [whole, cents] = fixed.split(".");
  return `${whole} dólares con ${cents} centavos`;
}

export function formatPhoneTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function getInitials(name: string): string {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
}

export function getDisplayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export function generateInvoiceNumber(): string {
  return `F${String(Date.now()).slice(-6)}`;
}
