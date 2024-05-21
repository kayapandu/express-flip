const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@yandmail.com',
    password: '123456',
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6452a',
    name: 'Mahmud',
    email: 'mahmud@yandmail.com',
    password: '123456',
  },
];

const accounts = [
  {
    user_id: users[0].id,
    account_number: 21348909,
    total_balance: 0,
    status: 'active',
    last_updated: '2022-12-06',
  },
  {
    user_id: users[1].id,
    account_number: 21348910,
    total_balance: 10000,
    status: 'active',
    last_updated: '2024-01-06',
  }
];

const transactions = [
  {
    sender_id: users[0].id,
    beneficiary_id: users[1].id,
    type: 'transfer',
    status: 'success',
    description: 'pemindahan dana',
    amount: 10000,
    created_date: '2024-01-06'
  }
]


module.exports = {
  users,
  accounts,
  transactions
};