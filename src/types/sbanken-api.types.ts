import { components as AccountsTypes } from '../types/accounts-sbanken.types'
import { components as CustomersTypes } from '../types/customers-sbanken.types'
import { components as TransactionsTypes } from '../types/transactions-sbanken.types'

// ./accounts-sbanken.types.ts
export type APIAccounts = AccountsTypes['schemas']['ListResult.Account.v1']
export type APIAccount = AccountsTypes['schemas']['ItemResult.Account.v1']
export type Account = AccountsTypes['schemas']['Account.v1']

// ./customers-sbanken.types.ts
export type APICustomer = CustomersTypes['schemas']['ItemResult.Customer.v1']
export type Customer = CustomersTypes['schemas']['Customer.v1']

// ./customers-sbanken.types.ts
export type APITransactions = TransactionsTypes['schemas']['ListResult.Transaction.v1']
export type Transaction = TransactionsTypes['schemas']['Transaction.v1']

// Token API
export interface TokenAPIResponse {
  access_token: string
  expires_in: number
  token_type: string
  scope: string
}
