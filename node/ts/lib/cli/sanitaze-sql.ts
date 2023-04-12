function sanitizeSqlQuery(query: string): string | undefined {
  const forbiddenKeywords = [
    "DELETE",
    "DROP",
    "TRUNCATE",
    "ALTER",
    "CREATE",
    "INSERT",
    "UPDATE",
    "MERGE",
    "GRANT",
    "REVOKE",
    "COMMIT",
    "ROLLBACK",
    "TRIGGER",
    "SAVEPOINT",
    "SET",
    "FUNCTION",
    "EXECUTE",
    "EXEC",
    "CALL",
    "LOCK",
  ];

  for (const keyword of forbiddenKeywords) {
    if (query.toUpperCase().includes(keyword)) {
      return undefined;
    }
  }

  return query;
}

export default sanitizeSqlQuery;
