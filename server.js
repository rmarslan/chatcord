const path = require("path");
const express = require("express");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.NODE_ENV || 3000;
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}...`);
});
