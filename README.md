<h1 align=center >SBanken NodeJS Client</h1>
<div align="center">
  <img src="https://img.shields.io/github/workflow/status/sherex/node-sbanken/Tests?label=Tests&style=for-the-badge"/><img src="https://img.shields.io/github/workflow/status/sherex/node-sbanken/Publish?label=Publish&style=for-the-badge"/><img src="https://img.shields.io/npm/v/@sherex/sbanken?style=for-the-badge&color=success"/>
</div>
<div align="center">
  <a href="https://github.com/Sherex/node-sbanken"><img src="https://img.shields.io/static/v1?logo=github&label=&message=GITHUB&color=black&style=for-the-badge"/></a><a href="https://www.npmjs.com/package/@sherex/sbanken"><img src="https://img.shields.io/static/v1?logo=npm&label=&message=NPM&color=red&style=for-the-badge"/></a>
</div>

<br>
<p align=center style="font-size: 1.3em;" >A node module written in Typescript to interact with SBanken's API.</p>
<br>

## Setup
### Creating your ID and secret
> If these steps are outdated you can find the updated instructions [here](https://sbanken.no/bruke/utviklerportalen/) and please create an issue or PR here :)
1. Enable the Beta program on your account.
  You can do this on the [Beta settings page](https://secure.sbanken.no/Home/Settings/BetaProgram).
2. Then goto your [API overview page](https://secure.sbanken.no/Personal/ApiBeta/Info) to register a new application.
3. Create a new application, an application key will be shown on the page.
  This is your `applicationId` in this module.

  > **Note:** Sometimes the API will respond with `{ error: "invalid_client" }` with the new secret, just give it a few miutes to catch up.

4. Generate a new password, this is your `applicationSecret` in this module.
5. Your `customerId` is your [norwegian "personnummer" (11 digits)](https://en.wikipedia.org/wiki/National_identification_number#Norway)

## Usage
### Install
`npm i @sherex/sbanken`

### Typescript

<details>
  <summary>Example</summary>

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

</details>

### Javascript

<details>
  <summary>Example</summary>

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

</details>

## Code API
> Hot tip! Use an IDE with Typescript support to get auto-complete for all parameters and data returned. I recommend VSCode.

### new SBanken(options)
Create a new SBanken client. Used in the following calls.

### SBanken#getToken(): [TokenData](./src/types/sbanken-api.types.ts#L19)
Returns the token and information about it.

### SBanken#getAccounts(): [Account[]](./src/types/accounts-sbanken.types.ts)
Returns all of your accounts.

### SBanken#getAccount(accountId): [Account](./src/types/accounts-sbanken.types.ts)
Returns specified account.

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| accountId | string | undefined | An account ID you got from .getAccounts() or your account number. |

### SBanken#getTransactions(accountId, options?): [Transaction](./src/types/transactions-sbanken.types.ts)
Returns transactions for specified account ID, within constraints in `options`.

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| accountId | string | undefined | An account ID you got from .getAccounts() or an account number (If you use an account number, it will use `.getAccount()` to get the `accountId`). |
| options.startDate | string | `endDate` -30 days | Date part of ISO-8601 [`2020-07-11`]. The start of the query time span. Must be less than or equal to `endDate`, and less than or equal to the current date +1 day. |
| options.endDate | string | current date | Date part of ISO-8601 [`2020-08-10`]. The end of the query time span. Must be greater than or equal to `startDate`, and less than or equal to the current date +1 day. |
| options.index | string | '0' | The index of the first item to be retrieved, within the time span. |
| options.length | string | '100' | Return a number of items items up to this value, starting from `options.index`. |

### SBanken#getCustomer(): [Customer](./src/types/customers-sbanken.types.ts)
Get information about you as a customer.

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
git clone https://github.com/Sherex/node-sbanken
cd node-sbanken
npm i
npm run dev sandbox.ts
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
