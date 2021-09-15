import { createPool, sql } from 'slonik';

type Book = { id: number; rank: number; name: string; author_id: number };

const db = createPool('postgres://postgres:postgres@localhost:9999/postgres', { captureStackTrace: false });

const main = async () => {
  db.connect(async (connection) => {
    await connection.any(sql<Book>`SELECT * FROM books WHERE id = ANY(${sql.array([1, 3, 4], 'int4')})`);
    await connection.any(sql<Book>`SELECT * FROM books WHERE id IN (${sql.join([1, 3, 4], sql`, `)})`);
  });
};

main();
