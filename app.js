const express = require("express");
const app = express();
const PORT = 3000;

app.get("/api/data",(req,res) => {
  res.json({message: "Un-throttled endpoint running"});
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});