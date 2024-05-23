const { sql } = require('@vercel/postgres');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginHandler = async (req, res) => {
  
  try {
    const { username, password } = req.body;

    const data = await sql`SELECT * FROM users WHERE email=${username}`

    if (!data) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const user = data.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    return res.status(200).json({ token });

  } catch (error) {
    return res.status(500).json({ error: 'Login failed' });
  }
};

const registerHandler = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const checkUser = await sql`SELECT COUNT(*) FROM users WHERE email=${email}`;

    if (checkUser.rows[0].count > 0) {
      return res.status(409).send({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertedUsers = await sql`
        INSERT INTO users (name, email, password)
        VALUES (${name}, ${email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING
        RETURNING id
        ;
      `;

    const userId = insertedUsers.rows[0].id;
    const accountNumber = ("" + Math.random()).substring(2, 8);
    const transactionDate = new Date().toISOString().split('T')[0];

    const insertedAccount = await sql`
      INSERT INTO accounts (user_id, account_number, total_balance, status, last_updated)
      VALUES (${userId}, ${accountNumber}, ${0}, 'active', ${transactionDate});
    `
    if (insertedAccount) {
      return res.status(201).send({ message: 'Success' });
    } else {
      return res.status(500).send({ message: 'Internal server error!' });
    }
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error!' });
  }
};


module.exports = {
  loginHandler,
  registerHandler,
};

