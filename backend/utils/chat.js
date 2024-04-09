const client = require('../db/conn');

const addChat = async (data) => {
  const result = await client.query('INSERT into chats (sender,receiver,message) VALUES ($1,$2,$3)',
  [data.sender,data.receiver,data.message]);
  return result.rowCount;
}

const getChats = async (data) => {
    const result = await client.query('SELECT * from chats where (sender = $1 AND receiver = $2) OR (sender = $2 AND receiver = $1)',
    [data.sender,data.receiver]);
    return result.rows;
}

module.exports = {addChat,getChats};