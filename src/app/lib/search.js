// lib/search.js
const GRAPHQL_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/graphql/`;

const PACKAGES_QUERY = `
  query GetPackages($mood: String, $maxPrice: Float, $isActive: Boolean) {
    packages(mood: $mood, maxPrice: $maxPrice, isActive: $isActive) {
      id
      title
      description
      price
      services
      images {
        id
        mediaFile
      }
      moods {
        id
        name
      }
    }
  }
`;

/**
 * Fetches event packages from the GraphQL API.
 * 
 * @param {{ mood?: string, maxPrice?: number, isActive?: boolean }} filters
 * @returns {Promise<Array>} array of package objects
 */
export async function fetchPackages({ mood = null, maxPrice = null, isActive = true } = {}) {
    const res = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: PACKAGES_QUERY,
            variables: { mood, maxPrice, isActive },
        }),
        // Revalidate every minute
        next: { revalidate: 60 },
    });

    const json = await res.json();
    if (json.errors) {
        console.error("GraphQL errors:", json.errors);
        throw new Error("Failed to fetch packages");
    }
    return json.data.packages;
}
