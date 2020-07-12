import swaggerToTs from '@manifoldco/swagger-to-ts'
import axios from 'axios'
import fs from 'fs/promises'

const swaggerSchemas = {
  'accounts-sbanken': 'https://api.sbanken.no/exec.bank/swagger/accounts_v1/swagger.json',
  'customers-sbanken': 'https://api.sbanken.no/exec.customers/swagger/customers_v1/swagger.json'
}

async function convertToTs (): Promise<void> {
  for (const [name, url] of Object.entries(swaggerSchemas)) {
    console.log(`| ${name} | Getting schema from - "${url}"`)
    const { data: schema } = await axios.get(url)
    console.log(`| ${name} | Got schema`)

    const path = `./src/lib/${name}.types.ts`
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
