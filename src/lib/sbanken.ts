import axios, { AxiosInstance, AxiosResponse } from 'axios'
import * as SBanken from '../types/sbanken.types'
import { isAccountNumber } from '../lib/type-checkers'
import toUrlEncodedFormData from './to-url-encoded-form-data'
import {
  TokenAPIResponse,
  APIAccounts,
  APIAccount,
  APICustomer,
  APITransactions,
  Account,
  Customer,
  Transaction
} from '../types/sbanken-api.types'

export default class SBankenClient {
  private readonly client: AxiosInstance
  private readonly options: SBanken.ClientOptionsData
  private tokenData: SBanken.TokenData | undefined
  public lastResponseRaw: AxiosResponse | undefined

  constructor (options: SBanken.ClientParamOptions) {
    if (typeof options.baseUrlApi !== 'string') options.baseUrlApi = 'https://api.sbanken.no'
    if (typeof options.baseUrlAuth !== 'string') options.baseUrlAuth = 'https://auth.sbanken.no'
    if (!SBanken.isClientOptionsData(options)) throw Error('Coding error: parameter "options" is of wrong type!')
    this.options = options

    this.client = axios.create({
      baseURL: options.baseUrlApi,
      headers: {
        customerId: options.customerId
      }
    })
  }

  async getToken (): Promise<SBanken.TokenData> {
    if (this.tokenData?.expires !== undefined && this.tokenData.expires > Date.now()) {
      return this.tokenData
    }

    const baseUrlAuth = this.options.baseUrlAuth
    const data = toUrlEncodedFormData({ grant_type: 'client_credentials' })
    const response = await axios.post(baseUrlAuth + '/identityserver/connect/token', data, {
      auth: {
        username: this.options.applicationId,
        password: this.options.applicationSecret
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).catch(error => {
      if (error.response?.data?.error === 'invalid_client') {
        throw new SBanken.AuthError('Invalid credentials, are they expired?', error.response?.data?.error)
      }
      throw error
    })
    const tokenResponse = response.data as TokenAPIResponse

    const expiresBuffer = 30 // seconds
    this.tokenData = {
      accessToken: tokenResponse.access_token,
      tokenType: tokenResponse.token_type,
      expires: Date.now() + (tokenResponse.expires_in - expiresBuffer),
      scopes: tokenResponse.scope.split(' ') as SBanken.TokenData['scopes']
    }

    if (this.tokenData.tokenType.match(/bearer/i) === null) throw Error(`Received unknown token from API: "${this.tokenData.tokenType}"`)

    return this.tokenData
  }

  private async updateClientToken (): Promise<void> {
    const tokenData = await this.getToken()
    const bearerToken = `${tokenData.tokenType} ${tokenData.accessToken}`
    this.client.defaults.headers.common.Authorization = bearerToken
  }

  async getAccounts (): Promise<Account[]> {
    await this.updateClientToken()
    const response = await this.client.get('/exec.bank/api/v1/accounts')
    this.lastResponseRaw = response
    const data = response.data as APIAccounts

    if (!Array.isArray(data.items)) throw new SBanken.APIError('Received invalid response body. See \'.sbankenError\' for details', data)

    return data.items
  }

  async getAccount (accountId: string): Promise<Account> {
    if (typeof accountId !== 'string') throw new Error('Missing required argument \'accountId\'!')

    if (isAccountNumber(accountId)) {
      const accounts = await this.getAccounts()
      const account = accounts.find(account => account.accountNumber === accountId)
      if (account === undefined) throw new Error('Invalid accountId!')
      return account
    }

    await this.updateClientToken()
    const response = await this.client.get(`/exec.bank/api/v1/accounts/${accountId}`)
    const data = response.data as APIAccount

    if (typeof data.item !== 'object') throw new SBanken.APIError('Received invalid response body. See \'.sbankenError\' for details', data)

    return data.item
  }

  async getCustomer (): Promise<Customer> {
    await this.updateClientToken()
    const response = await this.client.get('/exec.customers/api/v1/Customers')
    const data = response.data as APICustomer

    if (typeof data.item !== 'object') throw new SBanken.APIError('Received invalid response body. See \'.sbankenError\' for details', data)

    return data.item
  }

  async getTransactions (accountId: string, options?: SBanken.TransactionParamOptions): Promise<Transaction[]> {
    if (typeof accountId !== 'string') throw new Error('Missing required argument \'accountId\'!')

    if (isAccountNumber(accountId)) {
      const account = await this.getAccount(accountId)
      if (typeof account.accountId !== 'string') throw new Error('Account did not contain accountId. This is most likely an API error.')
      accountId = account.accountId
    }

    await this.updateClientToken()
    let query = toUrlEncodedFormData({
      startDate: options?.startDate,
      endDate: options?.endDate,
      index: options?.index,
      length: options?.length
    }).toString()
    query = query !== '' ? `?${query}` : ''
    const response = await this.client.get(`/exec.bank/api/v1/Transactions/${accountId}${query}`)
    this.lastResponseRaw = response
    const data = response.data as APITransactions

    if (!Array.isArray(data.items)) throw new SBanken.APIError('Received invalid response body. See \'.sbankenError\' for details', data)

    return data.items
  }
}
