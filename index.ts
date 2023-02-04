import { z } from "zod";
import { createPool, sql } from "slonik";

const Book = z.object({
	id: z.number(),
	rank: z.number(),
	name: z.string(),
});

const db = await createPool("postgres://postgres:postgres@localhost:5432/postgres", { captureStackTrace: false });

await db.connect(async (connection) => {
	await connection.query(sql.unsafe`
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

	console.log(
		await connection.any(sql.type(Book)`SELECT * FROM books WHERE id = ANY(${sql.array([1, 3, 4], "int4")})`)
	);
	console.log(
		await connection.any(sql.type(Book)`SELECT * FROM books WHERE id IN (${sql.join([1, 3, 4], sql.fragment`, `)})`)
	);
});
