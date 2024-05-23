const { sql } = require('@vercel/postgres');

const topupHandler = async (req, res) => {
  const userId = req.userId;
  const { amount } = req.body;

  if (amount > 10000000) {
    return res.status(400).send({ message: 'Invalid top up amount' });
  }

  try {
    const inquiryAccounts = await sql`SELECT * FROM accounts WHERE user_id=${userId}`;

    if (inquiryAccounts.rowCount !== 1) {
      return res.status(404).send({ message: 'Account Not Found' });
    }

    const transactionDate = new Date().toISOString().split('T')[0];

    const insertTransactions = await sql`INSERT INTO transactions (
      sender_id,
      beneficiary_id,
      type,
      status,
      description,
      amount,
      created_date
    ) VALUES (
      ${userId},
      ${userId},
      'topup',
      'success',
      'top up balance',
      ${amount},
      ${transactionDate}
    )`;

    if (!insertTransactions.rows) {
      return res.status(500).send({ message: 'Top up failed' });
    }

    const newBalance = parseInt(inquiryAccounts.rows[0].total_balance) + parseInt(amount);

    const updateBalance = await sql`UPDATE accounts SET 
      total_balance = ${newBalance}, last_updated = ${transactionDate} WHERE user_id = ${userId}`;

    if (updateBalance.rows) {
      return res.status(200).send({ message: 'Success' });
    }
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
};

const transferHandler = async (req, res) => {
  const userId = req.userId;
  const { to_username, amount } = req.body;

  try {
    const userBalance = await sql`SELECT total_balance FROM accounts WHERE user_id=${userId}`;
    const destinationAccounts = await sql`SELECT u.id, u.name, u.email, a.status, a.account_number, a.total_balance
     FROM accounts AS a JOIN users AS u ON u.email=${to_username} AND u.id=a.user_id`;

    if (userBalance.rows && destinationAccounts.rows && userBalance.rows[0].total_balance >= amount) {

      const transactionDate = new Date().toISOString().split('T')[0];

      const insertTransactions = await sql`INSERT INTO transactions (
        sender_id,
        beneficiary_id,
        type,
        status,
        description,
        amount,
        created_date
      ) VALUES (
        ${userId},
        ${destinationAccounts.rows[0].id},
        'transfer',
        'success',
        'transfer',
        ${amount},
        ${transactionDate}
      )`;

      if (insertTransactions) {
        const userTotalBalance = parseInt(userBalance.rows[0].total_balance) - parseInt(amount);
        const destinationTotalBalance = parseInt(destinationAccounts.rows[0].total_balance) + parseInt(amount);

        await sql`UPDATE accounts SET total_balance=${userTotalBalance} WHERE user_id=${userId}`;
        await sql`UPDATE accounts SET total_balance=${destinationTotalBalance} WHERE user_id=${destinationAccounts.rows[0].id}`;

        return res.status(201).send({ message: 'Success transfer' });
      }
      
    } else {
      return res.status(400).send({ message: 'Insufficient balance' });
    }

  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
};

const transactionHistoryHandler = async (req, res) => {
  const userId = req.userId;

  try {
    const transactionOut = await sql`SELECT t.sender_id, t.beneficiary_id, t.type, t.amount, t.created_date, u.name, u.email
      FROM transactions t JOIN users u ON t.beneficiary_id=u.id WHERE sender_id=${userId} ORDER BY created_date DESC`;
    const transactionIn = await sql`SELECT t.sender_id, t.beneficiary_id, t.type, t.amount, t.created_date, u.name, u.email
      FROM transactions t JOIN users u ON t.sender_id=u.id WHERE beneficiary_id=${userId} ORDER BY created_date DESC`;

    if ( transactionOut.rowCount > 0 || transactionIn.rowCount > 0) {
      const arrTransaction = [
        ...transactionIn.rows,
        ...transactionOut.rows,
      ];

      arrTransaction.forEach((item, i) => {
        if (item.sender_id === userId && item.type === 'transfer') {
          item.description = `Transfer to ${item.name} within email ${item.email}`;
          item.mutation = 'out';
        } else if (item.beneficiary_id === userId && item.type === 'transfer') {
          item.description = `Receive money from ${item.name} within email ${item.email}`;
          item.mutation = 'in';
        } else {
          item.description = `Top up balance`;
          item.mutation = 'in';
        }
      });

      return res.status(200).send({ message: 'Success', data: arrTransaction });
    };

    return res.status(500).send({ message: 'Internal server error' });
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
};


module.exports = {
  topupHandler,
  transferHandler,
  transactionHistoryHandler,
};

