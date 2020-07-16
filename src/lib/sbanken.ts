import axios, { AxiosInstance } from 'axios'
import * as SBanken from '../types/sbanken.types'
import toUrlEncodedFormData from './to-url-encoded-form-data'
import {
  TokenAPIResponse,
  APIAccounts,
  APIAccount,
  APICustomer
} from '../types/sbanken-api.types'

export default class SBankenClient {
  private readonly client: AxiosInstance
  private readonly options: SBanken.ClientOptionsData
  private tokenData: SBanken.TokenData | undefined

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
    })
    const tokenResponse = response.data as TokenAPIResponse

    const expiresBuffer = 30 // seconds
    this.tokenData = {
      accessToken: tokenResponse.access_token,
      tokenType: tokenResponse.token_type,
      expires: Date.now() + (tokenResponse.expires_in - expiresBuffer),
      scopes: response.data.scope.split(' ')
    }

    if (this.tokenData.tokenType.match(/bearer/i) === null) throw Error(`Received unknown token from API: "${this.tokenData.tokenType}"`)

    return this.tokenData
  }

  private async updateClientToken (): Promise<void> {
    const tokenData = await this.getToken()
    const bearerToken = `${tokenData.tokenType} ${tokenData.accessToken}`
    this.client.defaults.headers.common.Authorization = bearerToken
  }

  async getAccounts (): Promise<APIAccounts> {
    await this.updateClientToken()
    const { data } = await this.client.get('/exec.bank/api/v1/accounts')

    return data as APIAccounts
  }

  async getAccount (accountId?: string): Promise<APIAccount> {
    await this.updateClientToken()
    const { data } = await this.client.get(`/exec.bank/api/v1/accounts/${accountId !== undefined ? accountId : ''}`)

    return data as APIAccount
  }

  async getCustomer (): Promise<APICustomer> {
    await this.updateClientToken()
    const { data } = await this.client.get('/exec.customers/api/v1/Customers')

    return data as APICustomer
  }
}
