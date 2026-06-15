const buckets = new Map();

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function consume(scope, id, limit) {
  const key = `${todayKey()}:${scope}:${id || "unknown"}`;
  const current = buckets.get(key) || 0;
  if (current >= limit) return false;
  buckets.set(key, current + 1);
  return true;
}

module.exports = { consume };
