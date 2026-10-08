const pool = require("./pool");
async function testConnection() {
  const result = await pool.query("SELECT * FROM PATIENTS");
  console.log(result.rows.length);
}
testConnection();
