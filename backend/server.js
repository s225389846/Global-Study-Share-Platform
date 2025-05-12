const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

mongoose.connect(process.env.MONGODB_URI).then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`Server on ${process.env.PORT}`)
  );
});

mongoose.connection.once("open", async () => {
  await seedSuperAdmin();
});
