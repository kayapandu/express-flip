const { sql } = require('@vercel/postgres');

const balanceHandler = async (req, res) => {
  const userId = req.userId;

  try {
    const data = await sql`SELECT total_balance FROM accounts WHERE user_id=${userId}`;

    res.status(200).send({ 
      message: 'Success',
      data: data.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({ 
      message: 'Error',
      data: null,
    });
  }
};

const inquiryHandler = async (req, res) => {
  const { to_username } = req.body;
  
  try {
    const userAccounts = await sql`SELECT u.name, u.email, a.status, a.account_number
     FROM accounts AS a JOIN users AS u ON u.email=${to_username} AND u.id=a.user_id`;
    
    if (userAccounts.rowCount > 0) {
      return res.status(200).send({ message: 'Success', data: userAccounts.rows[0] });
    } else {
      return res.status(404).send({ message: 'Destination user not found', data: {}});
    }
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = {
  balanceHandler,
  inquiryHandler,
};

