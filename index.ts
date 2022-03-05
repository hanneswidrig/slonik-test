import { createPool, sql } from 'slonik';

type Book = { id: number; rank: number; name: string };

const db = createPool('postgres://postgres:postgres@localhost:9999/postgres', { captureStackTrace: false });

await db.connect(async (connection) => {
    await connection.query(sql`
    CREATE TABLE IF NOT EXISTS books
    (
        id   integer not null constraint books_pk primary key,
        rank integer,
        name text
    );
    DELETE FROM books;

    INSERT INTO public.books (id, rank, name) VALUES (1, 3, 'The Great Gatsby');
    INSERT INTO public.books (id, rank, name) VALUES (2, 6, 'Dune');
    INSERT INTO public.books (id, rank, name) VALUES (3, 9, 'Jurassic Park');`);

    await connection.any(sql<Book>`SELECT * FROM books WHERE id = ANY(${sql.array([1, 3, 4], 'int4')})`);
    await connection.any(sql<Book>`SELECT * FROM books WHERE id IN (${sql.join([1, 3, 4], sql`, `)})`);
});
