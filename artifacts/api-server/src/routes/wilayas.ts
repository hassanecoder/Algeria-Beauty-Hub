import { Router, type IRouter } from "express";
import { db, wilayasTable, listingsTable } from "@workspace/db";
import { sql, count } from "drizzle-orm";
import { GetWilayasResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/wilayas", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      id: wilayasTable.id,
      code: wilayasTable.code,
      name: wilayasTable.name,
      nameAr: wilayasTable.nameAr,
      region: wilayasTable.region,
      listingCount: count(listingsTable.id),
    })
    .from(wilayasTable)
    .leftJoin(listingsTable, sql`${listingsTable.wilayaId} = ${wilayasTable.id}`)
    .groupBy(wilayasTable.id)
    .orderBy(wilayasTable.code);

  res.json(GetWilayasResponse.parse(rows));
});

export default router;
