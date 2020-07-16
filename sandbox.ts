/* eslint-disable */
import dotenv from 'dotenv'
import { SBanken } from './src'

dotenv.config()

const client = new SBanken({
  applicationId: process.env.SB_APPLICATION_ID!,
  applicationSecret: process.env.SB_APPLICATION_SECRET!,
  customerId: process.env.SB_CUSTOMER_ID!
})

;(async () => {
  console.log('##### Accounts')
  const accounts = await client.getAccounts()
  console.log(accounts[0].balance)

  // console.log('##### Customer')
  // const customer = await client.getCustomer()
  // console.log(customer.firstName)

  console.log('##### Transactions')
  const transactions = await client.getTransactions(accounts[0].accountId!, {
    startDate: '2020-04-01',
    endDate: '2020-06-14',
    index: '20',
    length: '30'
  })
  console.log(transactions.length)
})()
