import Database from 'better-sqlite3';

const db = new Database('stats.db');

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('Database initialized.');

export function trackVisit(ip: string) {
  const stmt = db.prepare('INSERT INTO visits (ip) VALUES (?)');
  stmt.run(ip);
}

export function addReview(name: string, email: string, text: string) {
  const stmt = db.prepare('INSERT INTO reviews (name, email, text) VALUES (?, ?, ?)');
  stmt.run(name, email, text);
}

export function getReviews() {
  const stmt = db.prepare('SELECT * FROM reviews ORDER BY timestamp DESC');
  return stmt.all();
}

export function getVisitCount() {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM visits');
  return stmt.get().count;
}

export function getReviewCount() {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM reviews');
  return stmt.get().count;
}

// Note: The request for a report every 12 hours is complex in this environment.
// This setup logs every visit, and a separate process or a more complex
// setup would be needed to generate and send reports.
// For now, we are collecting the data.
