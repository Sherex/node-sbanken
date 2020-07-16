import swaggerToTs from '@manifoldco/swagger-to-ts'
import axios from 'axios'
import fs from 'fs/promises'

const swaggerSchemas = {
  'accounts-sbanken': 'https://api.sbanken.no/exec.bank/swagger/accounts_v1/swagger.json',
  'customers-sbanken': 'https://api.sbanken.no/exec.customers/swagger/customers_v1/swagger.json'
  // 'myprofiles-sbanken': 'https://api.sbanken.no/exec.customers/swagger/myprofiles_v1/swagger.json',
  // 'cards-sbanken': 'https://api.sbanken.no/exec.bank/swagger/cards_v1/swagger.json',
  // 'efakturas-sbanken': 'https://api.sbanken.no/exec.bank/swagger/efakturas_v1/swagger.json',
  // 'payments-sbanken': 'https://api.sbanken.no/exec.bank/swagger/payments_v1/swagger.json',
  // 'standingorders-sbanken': 'https://api.sbanken.no/exec.bank/swagger/standingorders_v1/swagger.json',
  // 'transactions-sbanken': 'https://api.sbanken.no/exec.bank/swagger/transactions_v1/swagger.json',
  // 'transfers-sbanken': 'https://api.sbanken.no/exec.bank/swagger/transfers_v1/swagger.json'
}

async function convertToTs (): Promise<void> {
  for (const [name, url] of Object.entries(swaggerSchemas)) {
    console.log(`| ${name} | Getting schema from - "${url}"`)
    let schema: any
    try {
      const response = await axios.get(url)
      schema = response.data
    } catch (error) {
      const status: number | string = typeof error.response.status === 'number' ? error.response.status : 'N/A'
      console.log(`| ${name} | Failed to get schema - status: ${status} - "${url}"`)
      continue
    }
    const swaggerPath = `./tools/swaggers/${name}.swagger.json`
    console.log(`| ${name} | Got schema - writing to file - ${swaggerPath}`)
    await fs.writeFile(swaggerPath, JSON.stringify(schema, null, 2))

    const path = `./src/types/${name}.types.ts`
    const ts = swaggerToTs(schema)
    await fs.writeFile(path, ts)
    console.log(`| ${name} | Schema is converted and written to "${path}"`)
  }
}

convertToTs()
  .then(() => {
    console.log('All done! You should probably run "npm run spec:lint:fix" :) - Exiting')
    process.exit(0)
  })
  .catch(error => {
    console.log('Failed! Error:')
    console.error(error)
    process.exit(1)
  })
