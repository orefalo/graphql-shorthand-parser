import test from "ava";
import { parse } from "..";

test("parse StarWars schema", t => {
  try {
    const schema = `# A character in the Star Wars Trilogy
    interface Character {
      # The id of the character.
      id: ID!
    
      # The name of the character.
      name: String
    
      # The friends of the character, or an empty list if they have none.
      friends: [Character]
    
      # Which movies they appear in.
      appearsIn: [Episode]
    
      # All secrets about their past.
      secretBackstory: String
    }
    
    # A mechanical creature in the Star Wars universe.
    type Droid implements Character {
      # The id of the droid.
      id: ID!
    
      # The name of the droid.
      name: String
    
      # The friends of the droid, or an empty list if they have none.
      friends: [Character]
    
      # Which movies they appear in.
      appearsIn: [Episode]
    
      # Construction date and the name of the designer.
      secretBackstory: String
    
      # The primary function of the droid.
      primaryFunction: String
    }
    
    # One of the films in the Star Wars Trilogy
    enum Episode {
      # Released in 1977.
      NEWHOPE
    
      # Released in 1980.
      EMPIRE
    
      # Released in 1983.
      JEDI
    }
    
    # A humanoid creature in the Star Wars universe.
    type Human implements Character {
      # The id of the human.
      id: ID!
    
      # The name of the human.
      name: String
    
      # The friends of the human, or an empty list if they have none.
      friends: [Character]
    
      # Which movies they appear in.
      appearsIn: [Episode]
    
      # The home planet of the human, or null if unknown.
      homePlanet: String
    
      # Where are they from and how they came to be who they are.
      secretBackstory: String
    }
    
    # Root Mutation
    type Mutation {
      # Save the favorite episode.
      favorite(
        # Favorite episode.
        episode: Episode!
      ): Episode
    }
    
    # Root query
    type Query {
      # Return the hero by episode.
      hero(
        # If omitted, returns the hero of the whole saga. If provided, returns the hero of that particular episode.
        episode: Episode
      ): Character
    
      # Return the Human by ID.
      human(
        # id of the human
        id: ID!
      ): Human
    
      # Return the Droid by ID.
      droid(
        # id of the droid
        id: ID!
      ): Droid
    }`
   
    const  actual= parse(schema);
    //console.log(JSON.stringify(actual, null, 2));

    return t.pass("good");
  } catch (e) {
    console.log(e);
    return t.throws(e);
  }
});

test("parse Github schema", t => {
  try {
    const schema = `type Test {
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
    `
   
    const [actual] = parse(schema);
    return t.pass("good");
  } catch (e) {
    console.log(e);
    return t.throws(e);
  }
});

test("parse Cheatsheet schema", t => {
  try {
    const schema = `
    # define Entity interface
    interface Entity {
     id: ID!
     name: String
    }
    # define custom Url scalar
    scalar Url
    # User type implements Entity interface
    type User implements Entity {
     id: ID!
     name: String
     age: Int
     balance: Float
     is_active: Boolean
     friends: [User]!
     homepage: Url
    }
    # root Query type
    type Query {
     me: User
     friends(limit: Int = 10): [User]!
    }
    # custom complex input type
    input ListUsersInput {
     limit: Int
     since_id: ID
    }
    # root mutation type
    type Mutation {
     users(params: ListUsersInput): [User]!
    }
    # GraphQL root schema type
    schema {
     query: Query
     mutation: Mutation
    }
    `
   
    const [actual] = parse(schema);
    return t.pass("good");
  } catch (e) {
    console.log(e);
    return t.throws(e);
  }
});


