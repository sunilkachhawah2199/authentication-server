// Database table names
const schema = process.env.SCHEMA;
const table = process.env.TABLE;
const TABLES = {
  CLIENT_MASTER: `${schema}.${table}`,
};

// Database column names
const COLUMNS = {
  USER: {
    UUID: "uuid",
    NAME: "name",
    EMAIL: "email",
    PASSWORD: "password",
    ORGANIZATION: "organization",
    TOOL: "tool",
    TERMS_ACCEPTED: "is_terms_accepted",
  },
};

// SQL Queries
const QUERIES = {
  USER: {
    FIND_BY_EMAIL: `SELECT ${COLUMNS.USER.EMAIL}, ${COLUMNS.USER.PASSWORD}, ${COLUMNS.USER.NAME}, ${COLUMNS.USER.ORGANIZATION}, ${COLUMNS.USER.TOOL}
                    FROM ${TABLES.CLIENT_MASTER} 
                    WHERE ${COLUMNS.USER.EMAIL} = $1`,

    INSERT_USER: `INSERT INTO ${TABLES.CLIENT_MASTER} (${COLUMNS.USER.EMAIL}, ${COLUMNS.USER.NAME}, ${COLUMNS.USER.PASSWORD}, ${COLUMNS.USER.TOOL}, ${COLUMNS.USER.ORGANIZATION}, ${COLUMNS.USER.UUID}) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
  },
};

module.exports = {
  TABLES,
  COLUMNS,
  QUERIES,
};
