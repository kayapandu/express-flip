const { db } = require('@vercel/postgres');
const {
  transactions,
  accounts,
  users,
} = require('./data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedAccounts(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "accounts" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS accounts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    account_number INT NOT NULL,
    total_balance INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    last_updated DATE NOT NULL
  );
`;

    console.log(`Created "accounts" table`);

    // Insert data into the "invoices" table
    const insertedAccounts = await Promise.all(
      accounts.map(
        (account) => client.sql`
        INSERT INTO accounts (user_id, account_number, total_balance, status, last_updated)
        VALUES (${account.user_id}, ${account.account_number}, ${account.total_balance}, ${account.status}, ${account.last_updated})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedAccounts.length} accounts`);

    return {
      createTable,
      accounts: insertedAccounts,
    };
  } catch (error) {
    console.error('Error seeding accounts:', error);
    throw error;
  }
}

async function seedTransactions(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "transactions" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        sender_id UUID NOT NULL,
        beneficiary_id UUID NOT NULL,
        type VARCHAR(255) NOT NULL,
        status VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        amount INT NOT NULL,
        created_date DATE NOT NULL
      );
    `;

    console.log(`Created "transactions" table`);

    // Insert data into the "transactions" table
    const insertedTransactions = await Promise.all(
      transactions.map(
        (transaction) => client.sql`
        INSERT INTO transactions (sender_id, beneficiary_id, type, status, description, amount, created_date)
        VALUES (${transaction.sender_id}, ${transaction.beneficiary_id}, ${transaction.type}, ${transaction.status}, ${transaction.description}, ${transaction.amount}, ${transaction.created_date})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedTransactions.length} transactions`);

    return {
      createTable,
      transactions: insertedTransactions,
    };
  } catch (error) {
    console.error('Error seeding transactions:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedAccounts(client);
  await seedTransactions(client);


  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
