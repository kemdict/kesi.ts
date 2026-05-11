import { existsSync, createWriteStream, rmSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

function getWords(): Array<{ title: string; pn: string }> {
  const kemdictDir = "../../../kemdict/";
  const kemdictDb = kemdictDir + "dicts/entries.db";
  if (!existsSync(kemdictDb)) {
    console.log(`${kemdictDb} not found`);
    process.exit(1);
  }
  console.log("Connecting to local Kemdict database...");
  const db = new DatabaseSync(kemdictDb, {
    readOnly: true,
  });
  console.log("Retrieving words...");
  return db
    .prepare(
      `
SELECT DISTINCT title, aliases.alias as pn FROM heteronyms
LEFT JOIN aliases ON heteronyms.id = aliases.het_id
WHERE lang = 'nan_TW'
  AND pn != title
  AND aliases.exact = 1
ORDER BY title
`,
    )
    .all() as Array<{ pn: string; title: string }>;
}

function writeWordList(path: string) {
  const rawWords = getWords();
  if (existsSync(path)) rmSync(path);
  const stream = createWriteStream(path);
  console.log("Writing word list...");
  const words = new Set<string>();
  for (const { title, pn } of rawWords) {
    words.add(title);
    words.add(pn);
  }
  for (const word of words) {
    stream.write(word + "\n");
  }
}

writeWordList("allwords.txt");
