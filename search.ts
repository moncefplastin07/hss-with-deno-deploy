export const searchInDB = async (query: any = "", db = "" ) => {
  
  const dbPath = {
    li: "./db/libraries.json",
    so: "./db/sociology.json",
    hs: "./db/history.json",
    co: "./db/communication.json",
    pc: "./db/psychology.json",
    fl: "./db/foreign_languages.json",
    th: "./db/thakafa.json"
  }[db]
  if (dbPath == null) {
    return []
  }
  const db_ = JSON.parse(await Deno.readTextFile(dbPath));
  const keywords = query.split(" ")
    .filter((keyword:string)=>{
        if (keyword.length > 2) {
            return keyword
        }
    })
  const keywordsRegEx = new RegExp(keywords.join('|'), "g")
  const searchResult = db_.filter((book: any) =>
  new Set(book.title.match(keywordsRegEx)).size >= keywords.length || new Set(book.author.match(keywordsRegEx)).size >= keywords.length || book.ID?.startsWith(query) 
    );
    return searchResult
};
