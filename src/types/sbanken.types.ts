export interface ClientParamOptions {
  baseUrlApi?: string
  baseUrlAuth?: string
  applicationId: string
  applicationSecret: string
  customerId: string
}

export interface ClientOptionsData extends ClientParamOptions {
  baseUrlApi: string
  baseUrlAuth: string
}

export function isClientOptionsData (options: ClientParamOptions): options is ClientOptionsData {
  if (typeof options.baseUrlApi !== 'string') return false
  if (typeof options.baseUrlAuth !== 'string') return false
  return true
}

export interface TokenData {
  accessToken: string
  tokenType: string
  expires: number
  scopes: [
    'Exec.Bank.Accounts.read_access',
    'Exec.Bank.Cards.read_access',
    'Exec.Bank.EFakturas.full_access',
    'Exec.Bank.Payments.read_access',
    'Exec.Bank.StandingOrders.read_access',
    'Exec.Bank.Transactions.read_access',
    'Exec.Bank.Transfers.full_access',
    'Exec.Customers.Customers.read_access'
  ]
}
