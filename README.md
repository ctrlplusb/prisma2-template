# Prisma 2 Scratchpad

This is a template for Prisma 2 is intended to allow rapid schema experimentation / development.

Any time you make a change to your Prisma schema the SQLite DB will be destroyed and rebuilt utilising the new schema definition. Any data that you may have inserted into the database will be lost with any change that you make to the schema. After the database is migrated to match the schema the Photon instance will also be regenerated.

In addition to this the Nexus GraphQL schema are also configured to automatically regenerate any time their associated files change. restart the server when you make changes to your Prisma schema, Nexus schema, or server source files.

The GraphQL playground should be available to you in the browser. You may need to refresh the browser preview panel if you would like the GraphQL Playground to load the latest version of the GraphQL Schema to help with code completion etc.

## Example queries

Create a post:

```graphql
mutation {
  createOnePost(
    data: {
      title: "My post"
      content: "Lorem ipsum"
      category: { create: { name: "Examples" } }
    }
  ) {
    title
  }
}
```

Query for posts:

```graphql
query {
  posts {
    title
    category {
      name
    }
  }
}
```

## Running locally

Clone the repo and install deps:

```
git clone https://github.com/ctrlplusb/prisma2-template
cd prisma2-template
yarn install
```

Start the development server:

```
yarn develop
```
