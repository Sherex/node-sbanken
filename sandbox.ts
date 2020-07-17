/* eslint-disable */
import dotenv from 'dotenv'
import { SBanken, ClientParamOptions, TransactionParamOptions } from './src'

dotenv.config()

const options: ClientParamOptions = {
  applicationId: process.env.SB_APPLICATION_ID!,
  applicationSecret: process.env.SB_APPLICATION_SECRET!,
  customerId: process.env.SB_CUSTOMER_ID!
}

const client = new SBanken(options)

;(async () => {
  console.log('##### Accounts')
  const accounts = await client.getAccounts()
  console.log(accounts[0].balance)

  console.log('##### Customer')
  const customer = await client.getCustomer()
  console.log(`${customer.firstName} ${customer.lastName}`)

  console.log('##### Transactions')
  const transactionsOptions: TransactionParamOptions = {
    startDate: '2020-04-01',
    endDate: '2020-06-14',
    index: '20',
    length: '30'
  }
  const transactions = await client.getTransactions(accounts[0].accountId!, transactionsOptions)
  console.log(transactions.length)
})()
