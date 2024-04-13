import { z } from "zod";
import { createPool, sql } from "slonik";

const pool = await createPool("postgres://postgres:postgres@localhost:5432/postgres", { captureStackTrace: false });

await pool.query(sql.unsafe`
CREATE TABLE IF NOT EXISTS books
(
    id   integer not null constraint books_pk primary key,
    rank integer,
    name text
);`);

await pool.query(sql.unsafe`DELETE FROM books;`);
await pool.query(sql.unsafe`INSERT INTO public.books (id, rank, name) VALUES (1, 3, 'The Great Gatsby');`);
await pool.query(sql.unsafe`INSERT INTO public.books (id, rank, name) VALUES (2, 6, 'Dune');`);
await pool.query(sql.unsafe`INSERT INTO public.books (id, rank, name) VALUES (3, 9, 'Jurassic Park');`);

const Book = z.object({
	id: z.number(),
	rank: z.number(),
	name: z.string(),
});

console.log(await pool.any(sql.type(Book)`SELECT * FROM books WHERE id = ANY(${sql.array([1, 3, 4], "int4")})`));
console.log(await pool.any(sql.type(Book)`SELECT * FROM books WHERE id IN (${sql.join([1, 3, 4], sql.fragment`, `)})`));

await pool.end();
