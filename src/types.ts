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
