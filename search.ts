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
interface BookMatchs {
  title: number;
  subtitle: number;
  notecontent: number;
  keywords: number;
  author: number;
}
const getMatchinCount = (haystack: string, keywords: any) => {
  const keywordsRegEx = new RegExp(
    keywords.join("|").replace(/(أ|آ|إ)/, "ا"),
    "g",
  );
  return new Set(
    `${haystack}`.replace(/(أ|آ|إ)/g, "ا").toLowerCase().match(keywordsRegEx),
  ).size;
};
const getBookMatchinRatio = (bookMatchs: BookMatchs, keywordsCount: number) => {
  return (((((bookMatchs.title /
    keywordsCount * 100) * 6) +
    ((bookMatchs.subtitle /
      keywordsCount *
      100) * 3) +
    ((bookMatchs.notecontent /
      keywordsCount *
      100) * 2) +
    ((bookMatchs.keywords /
      keywordsCount *
      100) * 3)) / 14) / 5);
};
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
    ma: "./db/master.json",
  }[db];
  if (dbPath == null) {
    return [];
  }
  const db_ = JSON.parse(await Deno.readTextFile(dbPath));
  const keywords = query.match(/(\S){3,}/g);
  const searchResult = db_.filter((book: any) => {
    const titleKeywords = book.title?.match(/(\S){3,}/g);
    const { title, subtitle, author, notecontent, keywords: bookKeywords } =
      book;
    const titleMatchRatio = getMatchinCount(book.title, keywords) /
      titleKeywords.length * 100;
    const bookMatchs = {
      title: getMatchinCount(title, keywords),
      subtitle: getMatchinCount(subtitle, keywords),
      notecontent: getMatchinCount(notecontent, keywords),
      keywords: getMatchinCount(bookKeywords, keywords),
      author: getMatchinCount(author, keywords),
    };

    book.matchRatio =
      (getBookMatchinRatio(bookMatchs, keywords.length) + titleMatchRatio) / 2;
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
