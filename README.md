# GraphQL Shorthand &  Parser

[![Build Status](https://travis-ci.org/cameronhunter/graphql-shorthand-parser.svg?branch=master)](https://travis-ci.org/cameronhunter/graphql-shorthand-parser) [![NPM Version](https://img.shields.io/npm/v/graphql-shorthand-parser.svg)](https://npmjs.org/package/graphql-shorthand-parser) [![License](https://img.shields.io/npm/l/graphql-shorthand-parser.svg)](https://github.com/cameronhunter/graphql-shorthand-parser/blob/master/LICENSE.md)

Parse GraphQL shorthand notation into a JSON object that can be used to auto-generate schema files.

Can parse schemas and queries.

## Motivation

* smaller, faster than the graphql library
* no dependency
* gracefull grammar
* easy to modify

### Shorthand notation
```
// One of the films in the Star Wars Trilogy
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}

// A character in the Star Wars Trilogy
interface Character {
  id: String!
  name: String
  friends: [Character]
  appearsIn: [Episode]
}

// A humanoid creature in the Star Wars universe
type Human implements Character {
  id: String!
  name: String
  friends: [Character]
  appearsIn: [Episode]
  homePlanet: String
}

// A mechanical creature in the Star Wars universe
type Droid implements Character {
  id: String!
  name: String
  friends: [Character]
  appearsIn: [Episode]
  primaryFunction: String
}

type Query {
  hero(episode: Episode): Character
  human(id: String!): Human
  droid(id: String!): Droid
}
```

### Parsed notation to JSON
```json
[
  {
    "type": "ENUM",
    "name": "Episode",
    "description": "One of the films in the Star Wars Trilogy",
    "values": [
      "NEWHOPE",
      "EMPIRE",
      "JEDI"
    ]
  },
  {
    "type": "INTERFACE",
    "name": "Character",
    "description": "A character in the Star Wars Trilogy",
    "fields": {
      "id": {
        "type": "String",
        "required": true
      },
      "name": {
        "type": "String"
      },
      "friends": {
        "type": "Character",
        "list": true
      },
      "appearsIn": {
        "type": "Episode",
        "list": true
      }
    }
  },
  {
    "type": "TYPE",
    "name": "Human",
    "description": "A humanoid creature in the Star Wars universe",
    "fields": {
      "id": {
        "type": "String",
        "required": true
      },
      "name": {
        "type": "String"
      },
      "friends": {
        "type": "Character",
        "list": true
      },
      "appearsIn": {
        "type": "Episode",
        "list": true
      },
      "homePlanet": {
        "type": "String"
      }
    },
    "interfaces": [
      "Character"
    ]
  },
  {
    "type": "TYPE",
    "name": "Droid",
    "description": "A mechanical creature in the Star Wars universe",
    "fields": {
      "id": {
        "type": "String",
        "required": true
      },
      "name": {
        "type": "String"
      },
      "friends": {
        "type": "Character",
        "list": true
      },
      "appearsIn": {
        "type": "Episode",
        "list": true
      },
      "primaryFunction": {
        "type": "String"
      }
    },
    "interfaces": [
      "Character"
    ]
  },
  {
    "type": "TYPE",
    "name": "Query",
    "fields": {
      "hero": {
        "type": "Character",
        "args": {
          "episode": {
            "type": "Episode"
          }
        }
      },
      "human": {
        "type": "Human",
        "args": {
          "id": {
            "type": "String",
            "required": true
          }
        }
      },
      "droid": {
        "type": "Droid",
        "args": {
          "id": {
            "type": "String",
            "required": true
          }
        }
      }
    }
  }
]
```

### Authors
* Olivier Refalo - [2018 refresh](https://github.com/orefalo/graphql-shorthand-parser)
* Cameron Hunter - [Origin code](https://github.com/cameronhunter/graphql-shorthand-parser)
