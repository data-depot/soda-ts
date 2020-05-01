// local
import { Query, Clause } from './types'

/**
 * fn to generate clauses
 *
 * @param clauseName name of the clause the generated fn to be assciated w/
 * @returns clause curry fn which takes value and can be call with a query
 */
export const createClause = (
  clauseName: Clause['name']
) => (
  value: string | TemplateStringsArray,
  ..._args: string[]
) => (query: Query): Query => ({
  ...query,
  clauses: [
    ...query.clauses,
    {
      name: clauseName,
      value:
        typeof value === 'string'
          ? value
          : value
              .map((str, i) => `${str}${_args[i] ?? ''}`)
              .join('')
              .trim()
    }
  ]
})

/**
 * fn to attach `$where` clause to query
 *
 * @param value to select with
 * @returns fn that can can consume and generate a new query
 */
export const where = createClause('$where')

/**
 * fn to attach `$select` clause to query
 *
 * @param value to filter with
 * @returns fn that can can consume and generate a new query
 */
export const select = createClause('$select')

/**
 * fn to attach `$limit` clause to query for pagination
 *
 * @param value number of items to be returned
 * @returns fn that can can consume and generate a new query
 */
export const limit = createClause('$limit')

/**
 * fn to attach `$offset` clause to query for pagination
 *
 * @param value to offset by
 * @returns fn that can can consume and generate a new query
 */
export const offset = createClause('$offset')

type URLReqParams = [Clause['name'], Clause['value']]

/**
 * transform clause in `URLParam` arrays
 *
 * @param clause clause to be transformed
 * @returns `GotReqParams` which are consumable with `URLParams`
 */
export const clauseTransformer = (
  clause: Clause
): URLReqParams => [clause.name, clause.value]

/**
 * transform clauses in query into consumption in `URLParams`
 *
 * @param clauses takes clauses from query object
 * @returns `GotReqParams[]` which are directly passed
 */
export const queryClauseTransformer = (
  clauses: Clause[]
): URLReqParams[] => clauses.map(clauseTransformer)
