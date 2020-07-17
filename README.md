# SBanken NodeJS Client
A node module written in Typescript for interacting with SBanken's API.

## Creating your ID and secret
> If these steps are outdated you can find the updated instructions [here](https://sbanken.no/bruke/utviklerportalen/) and please create an issue or PR here :)
1. Enable the Beta program on your account.
  You can do this on the [Beta settings page](https://secure.sbanken.no/Home/Settings/BetaProgram).
2. Then goto your [API overview page](https://secure.sbanken.no/Personal/ApiBeta/Info) to register a new application.
3. Create a new application, an application key will be shown on the page.
  This is your `applicationId` in this module.
4. Generate a new password, this is your `applicationSecret` in this module.
5. Your `customerId` is your [norwegian "personnummer" (11 digits)](https://en.wikipedia.org/wiki/National_identification_number#Norway)

## Usage
### Typescript
```typescript
import { SBanken, ClientParamOptions } from '@sherex/sbanken'

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
```

### Javascript
```javascript
const { SBanken } = require('@sherex/sbanken')

const options = {
  applicationId: process.env.SB_APPLICATION_ID,
  applicationSecret: process.env.SB_APPLICATION_SECRET,
  customerId: process.env.SB_CUSTOMER_ID
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
  const transactions = await client.getTransactions(accounts[0].accountId, {
    startDate: '2020-04-01',
    endDate: '2020-06-14',
    index: '20',
    length: '30'
  })
  console.log(transactions.length)
})()
```

## Currently supported APIs
### Bank - [Swagger docs](https://api.sbanken.no/exec.bank/swagger/index.html)
- [X] [Accounts](https://api.sbanken.no/exec.bank/swagger/accounts_v1/swagger.json)
- [X] [Transactions](https://api.sbanken.no/exec.bank/swagger/transactions_v1/swagger.json)
- [ ] [Cards](https://api.sbanken.no/exec.bank/swagger/cards_v1/swagger.json)
- [ ] [Efakturas](https://api.sbanken.no/exec.bank/swagger/efakturas_v1/swagger.json)
- [ ] [Payments](https://api.sbanken.no/exec.bank/swagger/payments_v1/swagger.json)
- [ ] [Standingorders](https://api.sbanken.no/exec.bank/swagger/standingorders_v1/swagger.json)
- [ ] [Transfers](https://api.sbanken.no/exec.bank/swagger/transfers_v1/swagger.json)
### Customers - [Swagger docs](https://api.sbanken.no/exec.customers/swagger/index.html)
- [X] [Customers](https://api.sbanken.no/exec.customers/swagger/customers_v1/swagger.json)
- [ ] [Myprofiles](https://api.sbanken.no/exec.customers/swagger/myprofiles_v1/swagger.json)

## Development
```sh
$ git clone https://github.com/Sherex/node-sbanken
$ cd node-sbanken
$ npm i
$ npm run dev sandbox.ts
```

### Updating swaggers and typings
To update the swagger schemas and typings run **`npm run spec:update-all`**.
Then run **`npm run spec:lint:fix`** to fix the linting errors in those files only.

### Adding a new schema
To add a new schema to the module, uncomment (or add) the entry in [`./tools/update-specs.ts`](./tools/update-specs.ts).
Then run **`npm run spec:update-all`** and **`npm run spec:lint:fix`**.

Now add the new import and exports in [`./src/types/sbanken-api.types.ts`](src/types/sbanken-api.types.ts), in the same format as the others.
Splitting the API response data and the actual data and other sections if needed.

### Code running
For running code while developing, use `npm run dev {file_name}` (for example `npm run dev sandbox.ts`).  
This uses [`ts-node-dev`](https://github.com/whitecolor/ts-node-dev) to build and run the code automatically.

### Code linting
This repo is using the [Standard with Typescript](https://github.com/standard/eslint-config-standard-with-typescript) ESlint config.

To check linting run:  
`npm run lint`  
To fix the linting run:  
`npm run lint:fix`

### Docs
- https://openbanking.sbanken.no/portal-sandbox/product
- https://openbanking.sbanken.no/portal-sandbox/documentation
- https://api.sbanken.no/exec.customers/swagger/index.html
- https://api.sbanken.no/exec.bank/swagger/index.html

# LICENSE
[MIT](LICENSE)