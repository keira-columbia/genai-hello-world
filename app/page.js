export const dynamic = "force-dynamic";

export default async function Home() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing.");
  }

  const endpoint = new URL("/rest/v1/countries", url);
  endpoint.searchParams.set("select", "country,capital,area_sq_km");
  endpoint.searchParams.set("order", "area_sq_km.desc");

  const response = await fetch(endpoint, {
    headers: { apikey: key },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load countries from Supabase.");
  }

  const countries = await response.json();

  return (
    <main>
      <h1>Largest Countries by Area</h1>
      {countries.length === 0 ? (
        <p>No countries yet.</p>
      ) : (
        <ul>
          {countries.map((item) => (
            <li key={item.country}>
              <strong>{item.country}</strong>
              <span>Capital: {item.capital}</span>
              <span>Area: {item.area_sq_km.toLocaleString()} km²</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
