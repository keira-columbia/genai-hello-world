export const dynamic = "force-dynamic";

export default async function Home() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing.");
  }

  const endpoint = new URL("/rest/v1/books", url);
  endpoint.searchParams.set("select", "id,title,author");
  endpoint.searchParams.set("order", "id.asc");

  const response = await fetch(endpoint, {
    headers: { apikey: key },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load books from Supabase.");
  }

  const books = await response.json();

  return (
    <main>
      <h1>Reading List</h1>
      {books.length === 0 ? (
        <p>No books yet.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <strong>{book.title}</strong>
              <span>{book.author}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
