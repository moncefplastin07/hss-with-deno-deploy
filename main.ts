import { serve } from "./deps.ts";
import { searchInDB } from "./search.ts"

serve(async (_req) => {
    const requestURL = new URL(_req.url)
    const searchQuery = requestURL.searchParams.get("q")
    const dbs = requestURL.searchParams.get("dbs") as string
    console.log(dbs)
  return new Response(JSON.stringify(await searchInDB(searchQuery, dbs)), {
    headers: new Headers({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }),

  })
}, {port:8000});