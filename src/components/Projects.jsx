import { useEffect, useState, useRef } from "react";
import CavernBackdrop from "./CavernBackdrop";

// Parameter GITHUB_USERNAME: Username GitHub target untuk fetching repositori otomatis
const GITHUB_USERNAME = "alifmakruf";

// Jumlah maksimal kartu per halaman (User Request: Maksimal menampilkan 3 card saja)
const CARDS_PER_PAGE = 3;

// Sub-komponen Kartu Project GitHub (Card Project)
// Parameter ProjectCard:
// - repo (object): Data repositori dari API GitHub
// - index (number): Urutan kartu untuk animasi staggered delay bounce
function ProjectCard({ repo, index }) {
  const category = repo.language || (repo.topics && repo.topics[0]) || "Web Project";

  return (
    <div
      className="project-card"
      style={{
        animationDelay: `${(index % 3) * 0.09}s`,
      }}
    >
      <div className="project-card-badge">{category}</div>
      <h3 className="project-card-title">{repo.name}</h3>
      <p className="project-card-desc">
        {repo.description ||
          "Proyek aplikasi digital interaktif yang dikembangkan dengan fokus pada performa dan pengalaman pengguna."}
      </p>

      <div className="project-card-footer">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="project-card-btn primary"
        >
          <span>Lihat Code</span>
          <svg viewBox="0 0 24 24" className="btn-icon">
            <path
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              fill="currentColor"
            />
          </svg>
        </a>

        {repo.homepage && (
          <a
            href={repo.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card-btn secondary"
          >
            <span>Live Demo</span>
            <svg viewBox="0 0 24 24" className="btn-icon">
              <path
                d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3zM5 5h6v2H5v12h12v-6h2v8H3V5h2z"
                fill="currentColor"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

// Komponen Utama Section 4: GitHub Projects & Repositories
export default function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef(null);

  // Fetch data repositori live dari GitHub API
  useEffect(() => {
    async function fetchRepos() {
      try {
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=24`
        );
        if (!res.ok) throw new Error("Gagal mengambil data GitHub");
        const data = await res.json();
        setRepos(data.filter((r) => !r.fork));
      } catch (err) {
        console.warn("[Projects] Gagal fetch GitHub repos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRepos();
  }, []);

  // Daftar kategori unik untuk filter
  const categories = [
    "All",
    ...new Set(repos.map((r) => r.language).filter(Boolean)),
  ];

  const filteredRepos =
    activeFilter === "All"
      ? repos
      : repos.filter((r) => r.language === activeFilter);

  // Perhitungan Halaman (Maksimal 3 card per halaman)
  const totalPages = Math.ceil(filteredRepos.length / CARDS_PER_PAGE);
  const currentRepos = filteredRepos.slice(
    currentPage * CARDS_PER_PAGE,
    (currentPage + 1) * CARDS_PER_PAGE
  );

  // Fungsi ganti filter kategori (reset ke halaman pertama)
  const handleFilterChange = (cat) => {
    if (cat === activeFilter) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveFilter(cat);
      setCurrentPage(0);
      setIsAnimating(false);
    }, 240);
  };

  // Fungsi ganti halaman dengan transisi bounce out -> in
  const handlePageChange = (newPage) => {
    if (newPage === currentPage || isAnimating || newPage < 0 || newPage >= totalPages) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsAnimating(false);
    }, 240);
  };

  return (
    <section className="projects-section" id="projects" ref={sectionRef}>
      {/* 4 Lapisan Siluet Gua dengan Efek Paralaks Kedalaman 3D (Desain Asli section-4.svg) */}
      <CavernBackdrop />

      <div className="grain" />

      {/* Header Section Projects */}
      <div className="projects-header">
        {/* <span className="profile-divider" aria-hidden="true">
          开源 · REPOSITORIES
        </span> */}
        <h2 className="projects-title">GitHub Project</h2>
        <p className="projects-subtitle">
          {" "}
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="github-user-link"
          >
            @{GITHUB_USERNAME}
          </a>
        </p>

        {/* Filter Bar Kategori */}
        {categories.length > 1 && (
          <div className="projects-filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeFilter === cat ? "active" : ""}`}
                onClick={() => handleFilterChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid Kartu Repositori (Maksimal 3 Card Per Tampilan) */}
      <div className={`projects-grid ${isAnimating ? "page-exit" : ""}`}>
        {loading ? (
          <div className="projects-loading">
            <span className="loading-spinner" />
            <p>Mengambil data repositori GitHub...</p>
          </div>
        ) : currentRepos.length > 0 ? (
          currentRepos.map((repo, idx) => (
            <ProjectCard
              key={`${currentPage}-${repo.id}`}
              repo={repo}
              index={idx}
            />
          ))
        ) : (
          <p className="projects-empty">Tidak ada proyek ditemukan untuk kategori ini.</p>
        )}
      </div>

      {/* Kontrol Navigasi Pagination (Prev / Next & Dots) */}
      {!loading && totalPages > 1 && (
        <div className="projects-pagination">
          <button
            type="button"
            className="pagination-btn prev"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0 || isAnimating}
            aria-label="Previous Page"
          >
            <svg viewBox="0 0 24 24" className="page-icon">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor" />
            </svg>
            <span>Prev</span>
          </button>

          <div className="pagination-pills">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                className={`pagination-pill ${currentPage === i ? "active" : ""}`}
                onClick={() => handlePageChange(i)}
                disabled={isAnimating}
                aria-label={`Ke halaman ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="pagination-btn next"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1 || isAnimating}
            aria-label="Next Page"
          >
            <span>Next</span>
            <svg viewBox="0 0 24 24" className="page-icon">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
