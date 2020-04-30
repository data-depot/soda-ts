export interface Clause {
  name: string
  value: string
}

export interface Query {
  /** data source identifier */
  src: string
  /** domain of data source */
  domain: string
  /** clauses to run w/ the query */
  clauses: Array<Clause> | []
  /** rest path associated with api and domain */
  apiPath: 'resource' | 'api/views' | 'api/catalog/v1'
}

export interface Authorization {
  type: 'TOKEN' | 'USERNAME_PASS'
  username?: string
  password?: string
  token?: string
  domain: string
  timeout: number
}
