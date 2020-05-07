export const PAGINATION_OPTS = {
  limit: 5,
  offset: 0,
  pageSize: 0,
  currentPage: 0
}

export const MANAGER_OPTS = {
  limit: 5,
  offset: 0,
  authOpts: {
    appToken: process.env.APP_TOKEN
  }
}

export const MANAGER_OPTS_CAMEL_CASE_KEYS = {
  limit: 5,
  offset: 0,
  authOpts: {
    appToken: process.env.APP_TOKEN,
    keysCamelCased: true
  }
}

/* eslint-disable */
export const RAW_DATA = {
  license_nbr: '1187577-DCA',
  license_type: 'Individual',
  lic_expir_dd: '2021-02-28T00:00:00.000',
  license_status: 'Active',
  license_creation_date: '2006-01-19T00:00:00.000',
  industry: 'Home Improvement Salesperson',
  business_name: 'TOP, HAMIT',
  address_city: 'JAMAICA',
  address_state: 'NY',
  address_zip: '11432'
}
/* eslint-enable */

export type RawData = typeof RAW_DATA
