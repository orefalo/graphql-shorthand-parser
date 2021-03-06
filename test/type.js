import test from "ava"
import { parse } from ".."

test("type definition", t => {
  const [actual] = parse(`
    // A humanoid creature in the Star Wars universe
    type Human implements Character {
      id: String!
      name: String
      friends: [Character]
      appearsIn: [Episode]
      homePlanet: String
    }
  `)

  const expected = {
    type: "TYPE",
    name: "Human",
    description: "A humanoid creature in the Star Wars universe",
    fields: {
      id: {
        type: "String",
        required: true
      },
      name: {
        type: "String"
      },
      friends: {
        type: {
          type: "Character"
        },
        array: true
      },
      appearsIn: {
        type: {
          type: "Episode"
        },
        array: true
      },
      homePlanet: {
        type: "String"
      }
    },
    implements: ["Character"]
  }

  return t.deepEqual(actual, expected)
})

test("type definition with parameters", t => {
  const [actual] = parse(`
    type Query {
      hero(episode: Episode): Character
      human(id: String!): Human
      droid(id: String!): Droid
    }
  `)

  const expected = {
    type: "TYPE",
    name: "Query",
    fields: {
      hero: {
        type: "Character",
        args: {
          episode: {
            type: "Episode"
          }
        }
      },
      human: {
        type: "Human",
        args: {
          id: {
            type: "String",
            required: true
          }
        }
      },
      droid: {
        type: "Droid",
        args: {
          id: {
            type: "String",
            required: true
          }
        }
      }
    }
  }

  return t.deepEqual(actual, expected)
})

test("type definition with multiple interfaces", t => {
  const [actual] = parse(`
    type Human implements Character, AnotherThing {
      id: String!
      name: String
      friends: [Character]
      appearsIn: [Episode]
      homePlanet: String
    }
  `)

  const expected = {
    type: "TYPE",
    name: "Human",
    fields: {
      id: {
        type: "String",
        required: true
      },
      name: {
        type: "String"
      },
      friends: {
        type: {
          type: "Character"
        },
        array: true
      },
      appearsIn: {
        type: {
          type: "Episode"
        },
        array: true
      },
      homePlanet: {
        type: "String"
      }
    },
    implements: ["Character", "AnotherThing"]
  }
  return t.deepEqual(actual, expected)
})

test("type definition with [!]!", t => {
  const [actual] = parse(`
    type Human  {
      friends: [Character!]!
    }
  `)

  const expected = {
    type: "TYPE",
    name: "Human",
    fields: {
      friends: {
        type: {
          type: "Character",
          required: true
        },
        array: true,
        required: true
      }
    }
  }

  return t.deepEqual(actual, expected)
})

test("type definition with [[!]!]", t => {
  const [actual] = parse(`
  type ticTacToe {
    board: [[String!]!]!
  }
  `)

  const expected = {
    type: "TYPE",
    name: "ticTacToe",
    fields: {
      board: {
        type: {
          type: {
            type: "String",
            required: true
          },
          array: true,
          required: true
        },
        array: true,
        required: true
      }
    }
  }

  return t.deepEqual(actual, expected)
})

test("type definition with default value", t => {
  const [actual] = parse(`
  type Query {
    identification(
      type: String = "personal-identity-code"
    ): [Identification]!
  }
  `)

  const expected = {
    type: "TYPE",
    name: "Query",
    fields: {
      identification: {
        type: {
          type: "Identification"
        },
        array: true,
        required: true,
        args: {
          type: {
            type: "String",
            defaultValue: "personal-identity-code"
          }
        }
      }
    }
  }

  return t.deepEqual(actual, expected)
})

test("test EMPTY type", t => {
  const [actual] = parse(`
    type Human  {
    }
  `)

  const expected = {
    type: "TYPE",
    name: "Human"
  }

  return t.deepEqual(actual, expected)
})

test("comment bug1", t => {
  const [actual] = parse(`
  # Autogenerated input type of AcceptTopicSuggestion
  input AcceptTopicSuggestionInput {
  
    clientMutationId: String
  
    name: String!
  }  
  `)

  const expected = {
    type: "INPUT",
    name: "AcceptTopicSuggestionInput",
    description: "Autogenerated input type of AcceptTopicSuggestion",
    fields: {
      clientMutationId: {
        type: "String"
      },
      name: {
        type: "String",
        required: true
      }
    }
  }

  return t.deepEqual(actual, expected)
})

test("comment bug2 default values", t => {
  const [actual] = parse(`
  type Test {
    # A list of direct forked repositories.
    forks(
      # Affiliation options for repositories returned from the connection
      affiliations: [RepositoryAffiliation] = [OWNER, COLLABORATOR]
  
      # Returns the elements in the list that come after the specified global ID.
      after: String
  
      # Returns the elements in the list that come before the specified global ID.
      before: String
  
      # Returns the first _n_ elements from the list.
      first: Int
  
      # If non-null, filters repositories according to whether they have been locked
      isLocked: Boolean
  
      # Returns the last _n_ elements from the list.
      last: Int
  
      # Ordering options for repositories returned from the connection
      orderBy: RepositoryOrder
  
      # If non-null, filters repositories according to privacy
      privacy: RepositoryPrivacy
    ): RepositoryConnection!
  
    # A list of users who are members of this team.
    members(
      # Returns the elements in the list that come after the specified global ID.
      after: String
  
      # Returns the elements in the list that come before the specified global ID.
      before: String
  
      # Returns the first _n_ elements from the list.
      first: Int
  
      # Returns the last _n_ elements from the list.
      last: Int
  
      # Filter by membership type
      membership: TeamMembershipType = ALL
  
      # The search string to look for.
      query: String
  
      # Filter by team member role
      role: TeamMemberRole
    ): TeamMemberConnection!
  
    # The HTTP path for the team' members
    membersResourcePath: URI!
  }
  
  `)

  const expected = {
    type: "TYPE",
    name: "Test",
    fields: {
      forks: {
        type: "RepositoryConnection",
        required: true,
        args: {
          affiliations: {
            type: {
              type: "RepositoryAffiliation"
            },
            array: true,
            description: "Affiliation options for repositories returned from the connection",
            defaultValue: "[OWNER, COLLABORATOR]"
          },
          after: {
            type: "String",
            description: "Returns the elements in the list that come after the specified global ID."
          },
          before: {
            type: "String",
            description: "Returns the elements in the list that come before the specified global ID."
          },
          first: {
            type: "Int",
            description: "Returns the first _n_ elements from the list."
          },
          isLocked: {
            type: "Boolean",
            description: "If non-null, filters repositories according to whether they have been locked"
          },
          last: {
            type: "Int",
            description: "Returns the last _n_ elements from the list."
          },
          orderBy: {
            type: "RepositoryOrder",
            description: "Ordering options for repositories returned from the connection"
          },
          privacy: {
            type: "RepositoryPrivacy",
            description: "If non-null, filters repositories according to privacy"
          }
        },
        description: "A list of direct forked repositories."
      },
      members: {
        type: "TeamMemberConnection",
        required: true,
        args: {
          after: {
            type: "String",
            description: "Returns the elements in the list that come after the specified global ID."
          },
          before: {
            type: "String",
            description: "Returns the elements in the list that come before the specified global ID."
          },
          first: {
            type: "Int",
            description: "Returns the first _n_ elements from the list."
          },
          last: {
            type: "Int",
            description: "Returns the last _n_ elements from the list."
          },
          membership: {
            type: "TeamMembershipType",
            description: "Filter by membership type",
            defaultValue: "ALL"
          },
          query: {
            type: "String",
            description: "The search string to look for."
          },
          role: {
            type: "TeamMemberRole",
            description: "Filter by team member role"
          }
        },
        description: "A list of users who are members of this team."
      },
      membersResourcePath: {
        type: "URI",
        required: true,
        description: "The HTTP path for the team' members"
      }
    }
  }

  return t.deepEqual(actual, expected)
})
