interface Book {
  ID: string;
  title: string;
  subtitle: string;
  notecontent: string;
  author: string;
  pages: string;
  keywords: string;
  matchRatio?: number;
}
export const searchInDB = async (query: any = "", db = "") => {
  const dbPath = {
    li: "./db/libraries.json",
    so: "./db/sociology.json",
    hs: "./db/history.json",
    co: "./db/communication.json",
    pc: "./db/psychology.json",
    fl: "./db/foreign_languages.json",
    ca: "./db/thakafa.json",
    th: "./db/theses.json",
    ma: "./db/master.json"
  }[db];
  if (dbPath == null) {
    return [];
  }
  const db_ = JSON.parse(await Deno.readTextFile(dbPath));
  const keywords = query.toLowerCase().split(" ")
    .filter((keyword: string) => {
      if (keyword.length > 2) {
        return keyword;
      }
    });
  const keywordsRegEx = new RegExp(keywords.join("|"), "g");

  const searchResult = db_.filter((book: any) => {
    const titleKeywords = book.title?.toLowerCase().split(" ")
      .filter((keyword: string) => {
        if (keyword.length > 2) {
          return keyword;
        }
      });
    const titleMatchRatio =
      new Set(book.title?.toLowerCase().match(keywordsRegEx)).size /
      titleKeywords.length * 100;
    const bookMatchs = {
      title: new Set(book.title?.toLowerCase().match(keywordsRegEx)).size,
      subtitle: new Set(book.subtitle?.toLowerCase().match(keywordsRegEx)).size,
      notecontent:
        new Set(book.notecontent?.toLowerCase().match(keywordsRegEx)).size,
      keywords: new Set(book.keywords?.toLowerCase().match(keywordsRegEx)).size,
      author: new Set(book.author?.toLowerCase().match(keywordsRegEx)).size,
    };
    book.matchRatio = ((((((bookMatchs.title /
      keywords.length * 100) * 6) +
      ((bookMatchs.subtitle /
        keywords.length *
        100) * 3) +
      ((bookMatchs.notecontent /
        keywords.length *
        100) * 2) +
      ((bookMatchs.keywords /
        keywords.length *
        100) * 3)) / 14) / 5) + titleMatchRatio) / 2;
    return (bookMatchs.title /
          keywords.length *
          100) >= 70 ||
      (bookMatchs.subtitle /
          keywords.length *
          100) >= 70 ||
      (bookMatchs.notecontent /
          keywords.length *
          100) >= 70 ||
      (bookMatchs.keywords /
          keywords.length *
          100) >= 70 ||
      (bookMatchs.author /
          keywords.length *
          100) >= 70 ||
      book.ID?.startsWith(query);
  }).sort((currentItem, nextItem) => {
    return currentItem.matchRatio - nextItem.matchRatio;
  }).reverse();

  return { keywords, searchResult };
};
