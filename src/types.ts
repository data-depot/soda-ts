import { URLSearchParams } from 'url'
/**
 * clauses to be attachec to queries
 */
export interface Clause {
  /** name of the clause */
  name: string
  /** value of the clause */
  value: string
}

/**
 * all query requests are defined as a `Query`. They are
 * consumed by a runner or manager to make SODA SoQL requests
 */
export interface Query {
  /** data source identifier */
  src: string
  /** domain of data source */
  domain: string
  /** clauses to run w/ the query */
  clauses: Array<Clause> | []
  // TODO: refactor into enum
  /** rest path associated with api and domain */
  apiPath: 'resource' | 'api/views' | 'api/catalog/v1'
}
export interface AuthOpts {
  // apiToken?: string
  /** appToken userd to make authenticated req */
  appToken?: string
  /** whether to serialize response keys to camelCase */
  keysCamelCased?: boolean
  /** where to use json or csv files */
  ext?: string
}
export interface RequestOption {
  headers: {}
  searchParams: URLSearchParams
}
