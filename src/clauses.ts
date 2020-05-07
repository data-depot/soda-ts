// local
import { Query, Clause } from './types'

/**
 * convert clause qeuries template string into raw string.
 * used internally by createClause to hadnle tempalate string
 * clause values
 *
 * @param values raw string array from templates
 * @param extras args passed into the template
 *
 * @returns clause value as string
 */
export const templateToString = (
  values: TemplateStringsArray,
  extras?: Array<string>
): string => {
  return values
    .map((str, i) => `${str}${extras?.[i] ?? ''}`)
    .join('')
    .replace(/\s\s+/g, ' ')
    .trim()
}

/**
 * take clause inputs and serialize them into strings
 *
 * @param value raw value
 * @param extras args passed into the template
 *
 * @returns clause value as string from any input
 */
export const clauseValueSerializer = (
  value: string | TemplateStringsArray | number,
  extras?: Array<string>
): Clause['value'] => {
  if (typeof value === 'string') {
    return value
  } else if (typeof value === 'number') {
    return value.toString()
  } else {
    return templateToString(value, extras)
  }
}

/**
 * fn to generate clauses
 *
 * @param clauseName name of the clause the generated fn to be assciated w/
 *
 * @returns clause curry fn which takes value and can be called with a query
 */
export const createClause = (
  clauseName: Clause['name']
) => (
  value: string | TemplateStringsArray | number,
  ..._args: string[]
) => (query: Query): Query => ({
  ...query,
  clauses: [
    ...query.clauses,
    {
      name: clauseName,
      value: clauseValueSerializer(value, _args)
    }
  ]
})

/**
 * fn to attach `$where` clause to query
 *
 * @param value to select with
 *
 * @returns fn that can can consume and generate a new query
 *
 * **Usage**
 * @example
 * const whereCurrFn = where`magnitude > 3.0`
 *
 * pipe(
 *  whereCurrFn
 *  runner
 * )(query)
 */
export const where = createClause('$where')

/**
 * fn to attach `$select` clause to query
 *
 * @param value to filter with
 *
 * @returns fn that can can consume and generate a new query
 */
export const select = createClause('$select')

/**
 * fn to attach `$limit` clause to query for pagination
 *
 * @param value number of items to be returned
 *
 * @returns fn that can can consume and generate a new query
 */
export const limit = createClause('$limit')

/**
 * fn to attach `$offset` clause to query for pagination
 *
 * @param value to offset by
 *
 * @returns fn that can can consume and generate a new query
 */
export const offset = createClause('$offset')

type URLReqParams = [Clause['name'], Clause['value']]

/**
 * transform clause in `URLParam` arrays
 *
 * @param clause clause to be transformed
 *
 * @returns `GotReqParams` which are consumable with `URLParams`
 */
export const clauseTransformer = (
  clause: Clause
): URLReqParams => [clause.name, clause.value]

/**
 * transform clauses in query into consumption in `URLParams`
 *
 * @param clauses takes clauses from query object
 *
 * @returns `GotReqParams[]` which are directly passed
 */
export const queryClauseTransformer = (
  clauses: Clause[]
): URLReqParams[] => clauses.map(clauseTransformer)
