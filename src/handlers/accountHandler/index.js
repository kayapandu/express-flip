const { sql } = require('@vercel/postgres');

const { statusCode } = require("../../utils");

const mockUid = '410544b2-4001-4271-9855-fec4b6a6442b';

const balanceHandler = async (req, res) => {
  console.log(req);
  try {
    const data = await sql`SELECT total_balance FROM accounts WHERE user_id=${mockUid}`;
    console.log(data);
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

module.exports = {
  balanceHandler,
};

