const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    port : 5432,
    user: 'postgres',
    password: 'password',
    database: 'merchant_db'
  },
  debug: true,
  pool: { min: 0, max: 7 }
});

const app = express();


// Convert sql merchant field to DOA
function rowToMerchant(row) {
  return {
    id: row.id,
    merchantName: row.merchant_name,
    phoneNumber: row.phone_number,
    latitude: row.latitude,
    longitude: row.longitude,
    isActive: row.is_active,
    recordedDateTime: row.recorded_date_time,
  };
}

// Define the GraphQL schema
const schema = buildSchema(`
  type Merchant {
    id: Int!
    merchantName: String!
    phoneNumber: String!
    latitude: Float!
    longitude: Float!
    isActive: Boolean!
    recordedDateTime: String!
  }

  type Query {
    merchant(id: Int!): Merchant
    merchants: [Merchant]
  }

  type Mutation {
    createMerchant(merchantName: String!, phoneNumber: String!, latitude: Float!, longitude: Float!, isActive: Boolean): Merchant
    updateMerchant(id: Int!, merchantName: String!, phoneNumber: String!, latitude: Float!, longitude: Float!, isActive: Boolean): Merchant
    deleteMerchant(id: Int!): Merchant
    updateBulk(isActive: Boolean!, merchantIds: [Int!]) : [Merchant]
  }
`);

// Define the resolvers for the GraphQL queries and mutations
const rootValue = {

  // GET a single merchant by ID
  merchant: ({ id }) => {
    return knex('merchants').where({ id }).first().then(row=>rowToMerchant(row));
  },

  // GET all merchants
  merchants: () => {
    return knex('merchants').returning('*').then(data => data.map(row=>rowToMerchant(row)));
  },
  // POST a new merchant
  createMerchant: ({ merchantName, phoneNumber, latitude, longitude, isActive = false }) => {
    const recordedDateTime = new Date().toISOString();
    return knex('merchants')
      .insert({ "merchant_name" : merchantName,"phone_number" : phoneNumber, latitude, longitude, "is_active" :isActive,
       "recorded_date_time": recordedDateTime })
      .returning('*')
      .then(rows => rowToMerchant(rows[0]));
  },
  // PUT an existing merchant by ID
  updateMerchant: ({ id, merchantName, phoneNumber, latitude, longitude, isActive = false }) => {
    return knex('merchants')
      .where({ id })
      .update({ "merchant_name" : merchantName, "phone_number": phoneNumber, latitude, longitude, "is_active" : isActive })
      .returning('*')
      .then(rows => rowToMerchant(rows[0]))
      .catch((err)=>{
        console.error(err);
        throw new Error('Invalid id ' + id);
      });
  },
  // DELETE an existing merchant by ID
  deleteMerchant: ({ id }) => {
    return knex('merchants')
      .where({ id })
      .del()
      .returning('*')
      .then(rows => rowToMerchant(rows[0]))
      .catch((err)=>{
        console.error(err);
        throw new Error('Error deleting merchant');
      });
  },
  // POST endpoint to update 'is_active' field in bulk
  updateBulk: ({ isActive, merchantIds }) => {
    console.warn(merchantIds)
    return knex('merchants')
      .whereIn('id', merchantIds)
      .update({ "is_active": isActive })
      .returning('*')
      .then(data => data.map(row=>rowToMerchant(row)))
      .catch((err) => {
        console.error(err);
        throw new Error('Error updating merchants');
      });
  },
};

// Set up the GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue,
  graphiql: true
}));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
