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
  console.log(await client.getAccounts())
  console.log('##### Customer')
  console.log(await client.getCustomer())
})()
