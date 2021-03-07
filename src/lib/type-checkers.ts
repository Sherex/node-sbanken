export function isAccountNumber (accountNumber: string): boolean {
  return /\d{11}/.test(accountNumber)
}

export function isAccountId (accountId: string): boolean {
  return /[A-Z0-9]{32}/.test(accountId)
}
