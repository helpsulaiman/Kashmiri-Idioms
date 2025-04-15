import Head from "next/head";
import { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import IdiomCard from "../components/IdiomCard";
import { supabase } from "../lib/supabase";

// Helper function to convert string to sentence case
// Makes the first letter uppercase and the rest lowercase
const toSentenceCase = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function Home() {
  // State variables to manage data and UI
  const [idioms, setIdioms] = useState([]); // Stores all idioms from the database
  const [searchQuery, setSearchQuery] = useState(""); // Tracks what the user is searching for
  const [selectedTags, setSelectedTags] = useState([]); // Keeps track of selected filter tags
  const [availableTags, setAvailableTags] = useState([]); // All available tags for filtering
  const [loading, setLoading] = useState(true); // Tracks if data is still loading

  // Fetch idioms from the database when the page loads
  useEffect(() => {
    async function fetchIdioms() {
      try {
        setLoading(true); // Start loading
        const { data, error } = await supabase.from("idioms").select("*");

        if (error) {
          throw error; // Handle any database errors
        }

        if (data) {
          setIdioms(data); // Save the idioms to state

          // Extract all unique tags from the idioms
          const tags = data.reduce((acc, idiom) => {
            if (idiom.tags && Array.isArray(idiom.tags)) {
              // Convert each tag to sentence case
              return [...acc, ...idiom.tags.map((tag) => toSentenceCase(tag))];
            }
            return acc;
          }, []);

          // Get unique tags and convert to sentence case
          setAvailableTags(
            [...new Set(tags)]
              .filter(Boolean)
              .map((tag) => toSentenceCase(tag)),
          );
        }
      } catch (error) {
        console.error("Error fetching idioms:", error);
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    }

    fetchIdioms(); // Call the function to fetch data
  }, []); // Empty dependency array means this runs once when component mounts

  // Function to toggle a tag selection
  const toggleTag = (tag) => {
    setSelectedTags(
      (prev) =>
        prev.includes(tag)
          ? prev.filter((t) => t !== tag) // Remove tag if already selected
          : [...prev, tag], // Add tag if not already selected
    );
  };

  // Function to clear all selected tags
  const clearTags = () => {
    setSelectedTags([]);
  };

  // Filter idioms based on search query and selected tags
  // useMemo prevents unnecessary recalculations when other state changes
  const filteredIdioms = useMemo(() => {
    return idioms.filter((idiom) => {
      // Skip filtering if no tags or search query
      if (selectedTags.length === 0 && searchQuery === "") {
        return true;
      }

      // Check tags if we have any selected
      const hasMatchingTag =
        selectedTags.length === 0 ||
        (idiom.tags &&
          selectedTags.every((tag) =>
            idiom.tags.some((idiomTag) => toSentenceCase(idiomTag) === tag),
          ));

      // Check search query
      const hasMatchingSearch =
        searchQuery === "" ||
        (idiom.idiom_kashmiri &&
          idiom.idiom_kashmiri
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (idiom.transliteration &&
          idiom.transliteration
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (idiom.translation &&
          idiom.translation
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (idiom.meaning &&
          idiom.meaning.toLowerCase().includes(searchQuery.toLowerCase()));

      return hasMatchingTag && hasMatchingSearch;
    });
  }, [idioms, selectedTags, searchQuery]); // Recalculate when these dependencies change

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <Head>
        {/* Page title and meta tags for SEO */}
        <title>Kashmiri Idioms</title>
        <meta
          name="description"
          content="Explore Kashmiri idioms with translations and meanings"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      {/* Main site header with navigation */}

      <main
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}
      >
        {/* Page title and description */}
        <div
          style={{
            maxWidth: "56rem",
            margin: "0 auto",
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "1rem",
              textTransform: "uppercase",
              letterSpacing: "0.025em",
            }}
          >
            Kashmiri Idioms
          </h1>
          <p
            style={{
              color: "#4b5563",
              fontSize: "1.125rem",
              maxWidth: "42rem",
              margin: "0 auto",
            }}
          >
            Explore the rich cultural heritage of Kashmir through its idioms.
            Each idiom includes the original Kashmiri text, transliteration,
            translation, and meaning.
          </p>
        </div>

        {/* Search and filter section */}
        <div
          style={{
            maxWidth: "56rem",
            margin: "0 auto",
            marginBottom: "2rem",
            backgroundColor: "white",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "1.5rem",
            }}
            className="search-filter-container"
          >
            {/* Search input */}
            <div style={{ gridColumn: "span 1" }} className="search-container">
              <label
                htmlFor="search"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Search Idioms
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by idiom, translation, or meaning..."
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  backgroundColor: "white",
                  color: "#111827",
                  "::placeholder": { color: "#6b7280" },
                }}
              />
            </div>

            {/* Tag filter buttons */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Filter by Tags
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {/* Map through available tags and create a button for each */}
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "9999px",
                      fontSize: "0.875rem",
                      transition: "all 0.2s",
                      backgroundColor: selectedTags.includes(tag)
                        ? "#2563eb"
                        : "#dbeafe",
                      color: selectedTags.includes(tag) ? "white" : "#1e40af",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {tag}
                  </button>
                ))}

                {/* Clear all tags button - only shown when tags are selected */}
                {selectedTags.length > 0 && (
                  <button
                    onClick={clearTags}
                    style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "9999px",
                      fontSize: "0.875rem",
                      backgroundColor: "#fee2e2",
                      color: "#b91c1c",
                      transition: "all 0.2s",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Grid of idiom cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
            maxWidth: "72rem",
            margin: "0 auto",
          }}
          className="idiom-grid"
        >
          {/* Map through filtered idioms and create a card for each */}
          {filteredIdioms.map((idiom) => (
            <IdiomCard key={idiom.id} idiom={idiom} />
          ))}

          {/* Show message when no idioms match the filters */}
          {filteredIdioms.length === 0 && (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "3rem 0",
              }}
            >
              <p style={{ color: "#6b7280", fontSize: "1.125rem" }}>
                No idioms found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Site footer */}
      <footer
        style={{
          backgroundColor: "#1f2937",
          color: "white",
          padding: "1.5rem 0",
          marginTop: "3rem",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1rem",
            textAlign: "center",
          }}
        >
          <p> {new Date().getFullYear()} Kashmiri Idioms Project</p>
        </div>
      </footer>
    </div>
  );
}
