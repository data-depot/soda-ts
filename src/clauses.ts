// local
import { Query, Clause } from './types'

/**
 * fn to generate clauses
 *
 * @param clauseName name of the clause the generated fn to be assciated w/
 * @returns clause fn
 */
export const createClause = (
  clauseName: Clause['name']
) => (query: Query, value: string): Query => ({
  ...query,
  clauses: [...query.clauses, { name: clauseName, value }]
})

/**
 * fn to attach `$where` clause to query
 *
 * @param query
 * @param value to select with
 */
export const where = createClause('$where')

/**
 * fn to attach `$select` clause to query
 *
 * @param query
 * @param value to filter with
 */
export const select = createClause('$select')

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
 *
 * @param clauses takes clauses from query object
 *
 * @returns `GotReqParams[]` which are directly passed
 */
export const queryClauseTransformer = (
  clauses: Clause[]
): URLReqParams[] => clauses.map(clauseTransformer)
