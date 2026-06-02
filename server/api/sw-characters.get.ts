// Fetches Star Wars character names from swapi.tech
// Returns a small random selection of names for use as collection examples.
// swapi.tech response: { total_pages, results: [{ uid, name, url }] }

interface SwapiTechPeopleResponse {
  total_pages: number;
  results: { uid: string; name: string; url: string }[];
}

export default defineEventHandler(async () => {
  // Fetch page 1 first to find out how many pages exist
  const first = await $fetch<SwapiTechPeopleResponse>(
    "https://swapi.tech/api/people/?page=1&limit=10",
  );

  const totalPages = first.total_pages ?? 9;
  const randomPage = Math.floor(Math.random() * totalPages) + 1;

  const data =
    randomPage === 1
      ? first
      : await $fetch<SwapiTechPeopleResponse>(
          `https://swapi.tech/api/people/?page=${randomPage}&limit=10`,
        );

  // Shuffle and take up to 5 names
  const shuffled = [...data.results].sort(() => Math.random() - 0.5);
  const names = shuffled.slice(0, 5).map((p) => p.name);

  return { names };
});
