// Small shared subset of Markdown used by OPC blog articles.
export function tableRows(block) {
  const lines = String(block || '').trim().split('\n').map(line => line.trim());
  if (lines.length < 3 || lines.some(line => !/^\|.*\|$/.test(line))) return null;
  const cells = line => line.slice(1, -1).split('|').map(cell => cell.trim());
  const header = cells(lines[0]);
  const separator = cells(lines[1]);
  if (header.length < 2 || separator.length !== header.length || !separator.every(cell => /^:?-{3,}:?$/.test(cell))) return null;
  const rows = lines.slice(2).map(cells);
  if (rows.some(row => row.length !== header.length)) return null;
  return { header, rows };
}

export function orderedItems(block) {
  const lines = String(block || '').trim().split('\n');
  if (lines.length < 2 || !lines.every(line => /^\d+\.\s+\S/.test(line))) return null;
  return lines.map(line => line.replace(/^\d+\.\s+/, ''));
}
