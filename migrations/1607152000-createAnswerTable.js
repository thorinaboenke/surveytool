exports.up = async (sql) => {
  await sql`CREATE TABLE IF NOT EXISTS answers (
		answer_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
		score INTEGER NOT NULL,
		question_id INTEGER NOT NULL REFERENCES questions (question_id) ON DELETE CASCADE ON UPDATE CASCADE);`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE IF EXISTS answers;`;
};
