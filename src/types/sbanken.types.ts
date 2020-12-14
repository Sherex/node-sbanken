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

/**
 * Parameters for the `.getTransactions` method
 */
export interface TransactionParamOptions {
  /**
   * The start of the query time span. Must be less than or equal to `endDate`, and less than or equal to the current date + 1 day.
   * Default value is `endDate` -30 days. Minimum value is `2000-01-01`. (Note: relative to GMT+1)
   */
  startDate?: string
  /**
   * The end of the query time span. Must be greater than or equal to startDate, and less than or equal to the current date +1 day.
   * Query cannot span more than 366 days. Default value is the current date. (Note: relative to GMT+1)
   * */
  endDate?: string
  /** The index of the first item to be retrieved. Minimum value is `0`, which is the first item within the query time span. Default value is `0`. */
  index?: string
  /** Return a number of items items up to this value. Minimum value is `1`, maximum value is `1000`. The default value is `100`. */
  length?: string
}

type ErrorTypes =
  | 'System'
  | 'Input'
  | 'State'
  | 'ServiceUnavailable'
  | 'CustomHttpStatus'
  | 'NotFound'

interface ErrorBody {
  errorType?: ErrorTypes
  isError?: boolean
  errorCode?: number | null
  errorMessage?: string | null
  traceId?: string | null
}

export class APIError extends Error {
  public readonly sbankenError: ErrorBody
  constructor (message: string | undefined, sbankenError: ErrorBody) {
    super(message)
    this.sbankenError = sbankenError
  }
}

export class AuthError extends Error {
  public readonly sbankenError: ErrorBody
  constructor (message: string | undefined, sbankenError: ErrorBody) {
    super(message)
    this.sbankenError = sbankenError
  }
}
