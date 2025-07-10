const { Pool } = require("pg");
import dotenv from 'dotenv';

const pool = new Pool({
  user: "Nexedgeserver01",
  password: "Konproz12##",
  host: "test-nexedge-db.c3wswiousmsm.ap-south-1.rds.amazonaws.com",
  port: 5432,
  database: "authentication",
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;