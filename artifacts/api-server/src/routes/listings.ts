import { Router, type IRouter } from "express";
import { db, listingsTable, categoriesTable, wilayasTable, servicesTable, reviewsTable } from "@workspace/db";
import { eq, and, gte, ilike, or, desc, sql, count } from "drizzle-orm";
import {
  GetListingsQueryParams,
  GetListingsResponse,
  GetListingByIdParams,
  GetListingByIdResponse,
  GetListingReviewsParams,
  GetListingReviewsResponse,
  CreateReviewParams,
  CreateReviewBody,
  SearchListingsQueryParams,
  SearchListingsResponse,
  GetStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const listingWithJoins = async (where: any = undefined, limit = 20, offset = 0) => {
  const query = db
    .select({
      id: listingsTable.id,
      name: listingsTable.name,
      slug: listingsTable.slug,
      categoryId: listingsTable.categoryId,
      categorySlug: categoriesTable.slug,
      categoryName: categoriesTable.name,
      wilayaId: listingsTable.wilayaId,
      wilayaName: wilayasTable.name,
      wilayaCode: wilayasTable.code,
      address: listingsTable.address,
      phone: listingsTable.phone,
      email: listingsTable.email,
      website: listingsTable.website,
      description: listingsTable.description,
      rating: listingsTable.rating,
      reviewCount: listingsTable.reviewCount,
      priceRange: listingsTable.priceRange,
      coverImage: listingsTable.coverImage,
      images: listingsTable.images,
      tags: listingsTable.tags,
      featured: listingsTable.featured,
      verified: listingsTable.verified,
      openingHours: listingsTable.openingHours,
      latitude: listingsTable.latitude,
      longitude: listingsTable.longitude,
      createdAt: listingsTable.createdAt,
    })
    .from(listingsTable)
    .innerJoin(categoriesTable, eq(listingsTable.categoryId, categoriesTable.id))
    .innerJoin(wilayasTable, eq(listingsTable.wilayaId, wilayasTable.id));

  if (where) {
    return query.where(where).limit(limit).offset(offset).orderBy(desc(listingsTable.rating));
  }
  return query.limit(limit).offset(offset).orderBy(desc(listingsTable.rating));
};

router.get("/listings", async (req, res): Promise<void> => {
  const params = GetListingsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ message: params.error.message });
    return;
  }

  const { category, wilaya, search, featured, minRating, page = 1, limit = 20 } = params.data;
  const offset = (page - 1) * limit;

  const conditions: any[] = [];
  if (category) conditions.push(eq(categoriesTable.slug, category));
  if (wilaya) conditions.push(sql`${wilayasTable.code}::text = ${wilaya}`);
  if (featured) conditions.push(eq(listingsTable.featured, true));
  if (minRating) conditions.push(gte(listingsTable.rating, minRating));
  if (search) {
    conditions.push(
      or(
        ilike(listingsTable.name, `%${search}%`),
        ilike(listingsTable.description, `%${search}%`),
        ilike(listingsTable.address, `%${search}%`)
      )
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const listings = await listingWithJoins(where, limit, offset);

  const countQuery = db
    .select({ count: count() })
    .from(listingsTable)
    .innerJoin(categoriesTable, eq(listingsTable.categoryId, categoriesTable.id))
    .innerJoin(wilayasTable, eq(listingsTable.wilayaId, wilayasTable.id));

  const [{ count: total }] = where
    ? await countQuery.where(where)
    : await countQuery;

  res.json(
    GetListingsResponse.parse({
      listings: listings.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  );
});

router.post("/listings", async (req, res): Promise<void> => {
  const body = req.body;
  const slug = body.name
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") + "-" + Date.now();

  const [listing] = await db
    .insert(listingsTable)
    .values({
      ...body,
      slug,
      images: [],
      tags: [],
    })
    .returning();

  const enriched = await listingWithJoins(eq(listingsTable.id, listing.id));
  res.status(201).json(enriched[0]);
});

router.get("/listings/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  const [listing] = await listingWithJoins(eq(listingsTable.id, id));

  if (!listing) {
    res.status(404).json({ message: "Listing not found" });
    return;
  }

  const services = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.listingId, id));

  const recentReviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.listingId, id))
    .orderBy(desc(reviewsTable.createdAt))
    .limit(10);

  res.json(
    GetListingByIdResponse.parse({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      services,
      recentReviews: recentReviews.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
    })
  );
});

router.get("/listings/:id/reviews", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.listingId, id))
    .orderBy(desc(reviewsTable.createdAt));

  res.json(
    GetListingReviewsResponse.parse(
      reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))
    )
  );
});

router.post("/listings/:id/reviews", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  const body = CreateReviewBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ message: body.error.message });
    return;
  }

  const [review] = await db
    .insert(reviewsTable)
    .values({ ...body.data, listingId: id })
    .returning();

  const allReviews = await db
    .select({ rating: reviewsTable.rating })
    .from(reviewsTable)
    .where(eq(reviewsTable.listingId, id));

  const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

  await db
    .update(listingsTable)
    .set({ rating: avgRating, reviewCount: allReviews.length })
    .where(eq(listingsTable.id, id));

  res.status(201).json({ ...review, createdAt: review.createdAt.toISOString() });
});

router.get("/search", async (req, res): Promise<void> => {
  const params = SearchListingsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ message: params.error.message });
    return;
  }

  const { q, wilaya, category } = params.data;

  const conditions: any[] = [
    or(
      ilike(listingsTable.name, `%${q}%`),
      ilike(listingsTable.description, `%${q}%`),
      ilike(listingsTable.address, `%${q}%`)
    )!,
  ];

  if (category) conditions.push(eq(categoriesTable.slug, category));
  if (wilaya) conditions.push(sql`${wilayasTable.code}::text = ${wilaya}`);

  const results = await listingWithJoins(and(...conditions), 50, 0);

  res.json(
    SearchListingsResponse.parse({
      results: results.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() })),
      total: results.length,
      query: q,
    })
  );
});

router.get("/stats", async (_req, res): Promise<void> => {
  const [totalListings] = await db.select({ count: count() }).from(listingsTable);
  const [totalCategories] = await db.select({ count: count() }).from(categoriesTable);
  const [totalWilayas] = await db.select({ count: count() }).from(wilayasTable);
  const [featuredCount] = await db.select({ count: count() }).from(listingsTable).where(eq(listingsTable.featured, true));
  const [verifiedCount] = await db.select({ count: count() }).from(listingsTable).where(eq(listingsTable.verified, true));

  const topCategories = await db
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
    .orderBy(desc(count(listingsTable.id)))
    .limit(6);

  const topWilayas = await db
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
    .orderBy(desc(count(listingsTable.id)))
    .limit(5);

  res.json(
    GetStatsResponse.parse({
      totalListings: totalListings.count,
      totalCategories: totalCategories.count,
      totalWilayas: totalWilayas.count,
      featuredCount: featuredCount.count,
      verifiedCount: verifiedCount.count,
      topCategories,
      topWilayas,
    })
  );
});

export default router;
