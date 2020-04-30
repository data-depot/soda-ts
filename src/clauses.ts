import { Query, Clause } from './types'

/**
 * fn to generate clauses
 *
 * @param clauseName
 */
export const createClause = (
  clauseName: Clause['name']
) => (query: Query, value: string): Query => ({
  ...query,
  clauses: [...query.clauses, { name: clauseName, value }]
})

export const where = createClause('$where')
export const select = createClause('$select')

type GotReqParams = [Clause['name'], Clause['value']]

export const clauseTransformer = (
  clause: Clause
): GotReqParams => [clause.name, clause.value]

export const queryClauseTransformer = (
  clauses: Clause[]
): GotReqParams[] => {
  return clauses.map(clauseTransformer)
}
