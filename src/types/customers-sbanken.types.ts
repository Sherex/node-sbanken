/**
 * This file was auto-generated by swagger-to-ts.
 * Do not make direct changes to the file.
 */

export interface components {
  schemas: {
    'Address.v1': {
      addressLine1?: string | null
      addressLine2?: string | null
      addressLine3?: string | null
      addressLine4?: string | null
      country?: string | null
      zipCode?: string | null
      city?: string | null
    }
    'PhoneNumber.v1': { countryCode?: string | null, number?: string | null }
    'Customer.v1': {
      customerId?: string | null
      firstName?: string | null
      lastName?: string | null
      emailAddress?: string | null
      dateOfBirth?: string | null
      postalAddress?: components['schemas']['Address.v1']
      streetAddress?: components['schemas']['Address.v1']
      phoneNumbers?: Array<components['schemas']['PhoneNumber.v1']> | null
    }
    'ErrorType.':
    | 'System'
    | 'Input'
    | 'State'
    | 'ServiceUnavailable'
    | 'CustomHttpStatus'
    | 'NotFound'
    'ItemResult.Customer.v1': {
      item?: components['schemas']['Customer.v1']
      errorType?: components['schemas']['ErrorType.']
      isError?: boolean
      errorCode?: number | null
      errorMessage?: string | null
      traceId?: string | null
    }
  }
}
