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
  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      },
      body: JSON.stringify({
        query: PACKAGES_QUERY,
        variables: { mood, maxPrice, isActive },
      }),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Network error: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();

    if (json.errors) {
      console.error("❌ GraphQL errors:", json.errors);
      return []; // Prevent build crash
    }

    if (!json.data?.packages) {
      console.warn("⚠️ No package data returned from API.");
      return [];
    }

    return json.data.packages;
  } catch (error) {
    console.error("🚨 Failed to fetch packages:", error.message);
    // Return empty list instead of throwing, to let Next.js build continue
    return [];
  }
}
