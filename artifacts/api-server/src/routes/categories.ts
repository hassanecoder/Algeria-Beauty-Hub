import { Router, type IRouter } from "express";
import { db, categoriesTable, listingsTable } from "@workspace/db";
import { sql, count } from "drizzle-orm";
import { GetCategoriesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      id: categoriesTable.id,
      slug: categoriesTable.slug,
      name: categoriesTable.name,
      nameAr: categoriesTable.nameAr,
      nameFr: categoriesTable.nameFr,
      icon: categoriesTable.icon,
      description: categoriesTable.description,
      listingCount: count(listingsTable.id),
    })
    .from(categoriesTable)
    .leftJoin(listingsTable, sql`${listingsTable.categoryId} = ${categoriesTable.id}`)
    .groupBy(categoriesTable.id)
    .orderBy(categoriesTable.name);

  res.json(GetCategoriesResponse.parse(rows));
});

export default router;
