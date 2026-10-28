# PROJECT PROPOSAL: AURATUNE

---

## 1. INTRODUCTION

_Performed by: [Nguyễn Khánh Đăng], Reviewed by: [Lê Công Minh Nhựt, Mai Đăng Khoa, Thái Hoàng, Nguyễn Thanh Huy], Edited by: [Nguyễn Khánh Đăng]_

AuraTune is a smart music streaming platform that combines an open-copyright music distribution model with artificial intelligence. Unlike systems relying solely on standard SQL queries, AuraTune utilizes LLMs and Vector Databases to act as an AI DJ capable of deep semantic analysis, understanding the listener's mood and context. The system not only provides a continuous streaming experience but also builds a micro-social network where users can share playlists, follow artists, and receive personalized listening habit analytics.

---

## 2. TARGET USERS AND ENVIRONMENTS

_Performed by: [Nguyễn Khánh Đăng], Reviewed by: [Lê Công Minh Nhựt, Mai Đăng Khoa, Thái Hoàng, Nguyễn Thanh Huy], Edited by: [Nguyễn Khánh Đăng]_

- **Target Users**: Students, office workers, or individuals needing to adjust their focus and mood through complex music queries. The second group consists of independent artists needing an accessible launchpad for their music.
- **Environments**: A responsive Web Application that operates smoothly on web browsers.

---

## 3. ACTORS IDENTIFICATION

_Performed by: [Nguyễn Khánh Đăng], Reviewed by: [Lê Công Minh Nhựt, Mai Đăng Khoa, Thái Hoàng, Nguyễn Thanh Huy], Edited by: [Nguyễn Khánh Đăng]_

- **Listener**: General users who want to listen to music, search using AI, create/share playlists, follow others, and store their listening history.
- **Artist**: Independent artists who have the right to manage their artist profiles, and upload albums and songs to the system.
- **Administrator**: System administrators responsible for content moderation, account management, and ensuring the system does not contain commercially copyrighted music.

---

## 4. LEGAL ISSUES & COMPLIANCE

_Performed by: [Nguyễn Khánh Đăng], Reviewed by: [Lê Công Minh Nhựt, Mai Đăng Khoa, Thái Hoàng, Nguyễn Thanh Huy], Edited by: [Nguyễn Khánh Đăng]_

### 4.1. Legal Safe Zone

If the AuraTune system remains an internal research project, running on a localhost or internal server for academic reporting, database architecture testing, or AI recommendation model training, it will not violate Vietnamese copyright laws. According to Article 25 of the Intellectual Property Law, the non-commercial use of published works for teaching or scientific research is exempt from permission and royalty payments. Fetching APIs from external data repositories to serve as mock data within this scope does not constitute a copyright infringement.

### 4.2. Violation Risks Upon Public Release

As soon as the website is deployed to a public domain allowing external users to access, create accounts, and stream music, the team will face three major legal risks:

- **Copyright Infringement (Copyright & Related Rights)**: Using automated scripts to scrape data or utilizing third-party APIs to stream music on the web without a B2B contract is copyright infringement (Article 28 of the Intellectual Property Law). To operate legally, the team must sign paid contracts with VCPMC (Vietnam Center for Protection of Music Copyright - representing songwriters) and RIAV (Recording Industry Association of Vietnam - representing singers and record labels). Large-scale violations can lead to criminal prosecution (Article 225 of the Penal Code).
- **Website Operating License Violation**: If the website allows users to create playlists, comment, and share music with each other, the team is essentially operating a social network and strictly requires a Social Network Establishment License from the Ministry of Information and Communications.
- **Personal Data Protection Violation**: When the system features an AI music recommender, it inherently must collect and store listening history, habits, and user account information. According to Decree 13/2023/ND-CP, you must have a clear privacy policy displayed during registration, obtain user consent, and implement data encryption mechanisms. If the database is leaked, platform owners will face heavy administrative fines.

### 4.3. Proposed Solutions

If the team wishes to move the website out of the university environment to serve as a portfolio or public demo, all commercially copyrighted music should be removed. Instead, utilize NCS (NoCopyrightSounds) libraries or music under Creative Commons (CC0) licenses. The AI system and Database will still function perfectly to demonstrate technical capabilities, but legal risks will be reduced to zero.

---

## 5. FUNCTIONAL GROUPS & USE CASES

_Performed by: [Nguyễn Khánh Đăng], Reviewed by: [Lê Công Minh Nhựt, Mai Đăng Khoa, Thái Hoàng, Nguyễn Thanh Huy], Edited by: [Nguyễn Khánh Đăng]_

1. **Authentication** — sign up via email/OAuth, log in, log out.
2. **Home dashboard** — view AI-recommended songs and playlists, view recent plays, browse trending charts and new albums.
3. **Advanced search** — search by title/artist/album, AI-powered search by lyrics, filter and sort results.
4. **Core music player** — play/pause/skip/seek, adjust volume, sync real-time lyrics, shuffle/repeat, share, comment on tracks.
5. **Queue management** — view upcoming queue, drag-and-drop to reorder songs, add/remove songs, play next.
6. **Playlist management** — create/edit/delete playlist, add/remove songs, generate AI playlist, create collaborative playlist.
7. **Listening analytics** — view listening history, track total listening duration, view top favorite artists and genres.
8. **Album interaction** — view album details (cover, release year, duration), browse tracklist, save album, share album.
9. **Artist profile & studio** — view artist biography, follow artist, upload new songs (for artists), edit/hide/delete audio files (for artists).
10. **AI recommendation engine** — analyze listening habits, generate personalized streams based on mood, suggest contextual tracks.
11. **Platform administration** — ban violating users, manage and remove copyrighted songs, view system-wide statistics.

---

## 6. KEY FEATURES

_Performed by: [Nguyễn Khánh Đăng, Mai Đăng Khoa], Reviewed by: [Lê Công Minh Nhựt, Thái Hoàng, Nguyễn Thanh Huy], Edited by: [Nguyễn Khánh Đăng, Mai Đăng Khoa]_

### 6.1. Authentication

The authentication feature provides a secure onboarding process by allowing users to sign up and log in using either a local email account or quick OAuth integrations like Google and Facebook. This is essential because it allows the system to establish a distinct identity for each user, enabling the secure storage of their listening history and the continuous personalization of AI-driven music recommendations.

### 6.2. Home Dashboard

The home dashboard serves as a personalized music discovery hub, automatically aggregating AI-recommended playlists, trending charts, and recently played tracks into a single, organized interface. This feature is highly useful because it significantly reduces navigation time, allowing listeners to instantly jump back into familiar music or effortlessly discover new artists tailored to their distinct tastes the moment they open the app.

### 6.3. Advanced Search

This feature enables users to perform comprehensive queries by song title, artist, or album, while also leveraging AI to search for tracks using just semantic descriptions or fragments of lyrics. It effectively eliminates the frustration of forgetting a song's exact name, empowering listeners to find the exact audio track they are looking for relying solely on their incomplete memories or current feelings.

### 6.4. Core Music Player

The core music player provides comprehensive audio controls and maintains continuous background playback through a persistent mini-player, even as the user navigates across different pages of the application. It ensures a seamless, uninterrupted auditory experience while boosting listener engagement through integrated features like synchronized real-time lyrics, social sharing, and interactive commenting.

### 6.5. Queue Management

Queue management allows users to preview upcoming tracks, seamlessly drag and drop to reorder them, or manually add and remove songs from the waitlist on the fly. This gives listeners maximum control over their continuous audio stream, letting them dynamically curate their upcoming musical journey without ever interrupting the currently playing song.

### 6.6. Playlist Management

Playlist management empowers users to easily curate their own personal music spaces by creating, editing, and deleting custom playlists, as well as adding or removing tracks at any time. Additionally, users can generate AI-assisted playlists based on their mood or collaborate with friends on shared playlists, promoting dynamic content curation and social interaction across the platform.

### 6.7. Listening Analytics

Listening analytics collects and visualizes personal streaming data, giving users insights into their listening history, total playback duration, and top favorite artists and genres over time. This feature enhances user engagement by reflecting their personal music habits and emotional trends, while providing valuable interaction data to continuously refine recommendation accuracy.

### 6.8. Album Interaction

Album interaction allows users to explore rich album details, including album artwork, release year, total duration, and complete tracklists. Listeners can save favorite albums to their libraries or share them directly with friends, making content discovery more immersive and encouraging deeper engagement with curated music releases.

### 6.9. Artist Profile & Studio

Artist profile & studio provides independent musicians with a dedicated space to manage their public persona, display their biography, and upload new audio files directly to the platform. Artists have full control over editing, hiding, or deleting their tracks, giving them complete ownership over their content and enabling direct distribution to their fanbase.

### 6.10. AI Recommendation Engine

The AI recommendation engine continuously analyzes user listening habits, emotional contexts, and historical trends to generate personalized audio streams tailored to specific moods and activities. By suggesting highly relevant contextual tracks in real time, it delivers a deeply customized listening experience that keeps users engaged without requiring manual searches.

### 6.11. Platform Administration

Platform administration offers a centralized management interface for administrators to handle content moderation, manage account permissions, ban violating users, and remove commercially copyrighted tracks. This ensures the system operates strictly within legal safe boundaries, maintains compliance with IP regulations, and keeps the music-sharing ecosystem safe for all users.

---

## 7. AI FEATURE & USER EXPERIENCE IMPROVEMENTS

_Performed by: [Mai Đăng Khoa], Reviewed by: [Lê Công Minh Nhựt, Nguyễn Khánh Đăng, Thái Hoàng, Nguyễn Thanh Huy], Edited by: [Mai Đăng Khoa]_

### Semantic Vector Search

- **Problem & Description**: Listeners frequently cannot remember exact song titles or lyrics, or they are searching for a specific vibe or mood rather than exact keywords. Traditional text-matching search engines (e.g., Elasticsearch) fail to handle such abstract queries.
- **AI Mechanism**: Utilizes an LLM combined with a Vector Database (ChromaDB / Pinecone). The system analyzes metadata, lyrics, and audio features (e.g., tempo, BPM, acoustics, mood) and transforms them into spatial vector embeddings. When users search using complex descriptions (e.g., _"A sad indie song with rain sound effects at the beginning for listening at 2 AM"_ or _"Upbeat EDM music for running at 140 BPM"_), the system converts the prompt into a vector and performs spatial similarity matching to retrieve the best-suited songs.
- **UX Improvement**:
  - Eliminates the "forgot the song title or lyrics" barrier completely.
  - Allows users to express their music discovery needs naturally using descriptive language and emotional contexts.

---

## 8. MERMAID WORKFLOW DIAGRAMS FOR AI FEATURES

_Performed by: Mai Đăng Khoa, Reviewed by: [Lê Công Minh Nhựt, Nguyễn Khánh Đăng, Thái Hoàng, Nguyễn Thanh Huy], Edited by: [Mai Đăng Khoa]_

<div style="break-inside: avoid; page-break-inside: avoid;">

### Workflow: Semantic Vector Search

<img src="diagram_semantic_vector_search.png" alt="Workflow 2" style="height: 205mm; width: auto; display: block; margin: 0 auto;">

</div>
