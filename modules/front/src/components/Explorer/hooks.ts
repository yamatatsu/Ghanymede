import { gql } from "apollo-boost"
import { useQuery } from "../../hooks/useQuery"
import { GQLTree, GQLTreeEntry } from "../../../schema"

type Params = {
  owner: string
  name: string
  expression: string
}
type Result = { loading: true } | { loading: false; entities: GQLTreeEntry[] }

export const useRepoEntities = (params: Params): Result => {
  const { owner, name, expression } = params

  const result = useQuery(gqlGetRepoEntities, {
    variables: { owner, name, expression },
  })

  if (result.type === "Loading") return { loading: true }

  const object = result.data.repository?.object

  if (!object) {
    throw new Error("No data is fetched")
  }
  const entities =
    (object as GQLTree).entries?.sort((a, b) => (a.type > b.type ? -1 : 1)) ??
    []

  return { loading: false, entities }
}

const gqlGetRepoEntities = gql`
  query getRepoEntities($owner: String!, $name: String!, $expression: String!) {
    repository(owner: $owner, name: $name) {
      object(expression: $expression) {
        ... on Tree {
          entries {
            name
            type
          }
        }
      }
    }
  }
`
