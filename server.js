const express = require("express");

const app = express();

const PORT = process.env.NODE_ENV || 3000;
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}...`);
});
