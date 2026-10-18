import { HttpTypes } from "@aiminaabeejs/types"
import {
  assertBackendReady,
  countryCode,
  storeCode,
} from "./test-helpers"
import {
  listAerotrekProducts,
  listProducts,
  listProductsWithSort,
  listRelatedProducts,
  mapStoreProduct,
  retrieveAerotrekProduct,
  retrieveProduct,
} from "./products"

beforeAll(async () => {
  await assertBackendReady()
})

describe("products", () => {
  describe("listProducts", () => {
    it("returns a paginated catalog for the store", async () => {
      const result = await listProducts({
        storeCode: storeCode(),
        queryParams: { limit: 5 },
      })

      expect(result.response.products.length).toBeGreaterThan(0)
      expect(result.response.count).toBeGreaterThanOrEqual(
        result.response.products.length
      )
      expect(result.response.products[0].id).toMatch(/^prod_/)
    })

    it("attaches calculated prices when a country is provided", async () => {
      const { response } = await listProducts({
        storeCode: storeCode(),
        countryCode: countryCode(),
        queryParams: { limit: 5 },
      })
      const priced = response.products.find((product) =>
        product.variants?.some((variant) => variant.calculated_price)
      )

      expect(priced).toBeTruthy()
    })

    it("paginates with pageParam", async () => {
      const page1 = await listProducts({
        storeCode: storeCode(),
        pageParam: 1,
        queryParams: { limit: 1 },
      })
      const page2 = await listProducts({
        storeCode: storeCode(),
        pageParam: 2,
        queryParams: { limit: 1 },
      })

      expect(page1.response.products[0].id).toBeTruthy()
      if (page1.response.count > 1) {
        expect(page2.response.products[0].id).not.toBe(
          page1.response.products[0].id
        )
        expect(page1.nextPage).toBe(2)
      }
    })
  })

  describe("retrieveProduct", () => {
    it("retrieves by id, or throws if this Store API cannot fetch the listed product", async () => {
      const { response } = await listProducts({
        storeCode: storeCode(),
        queryParams: { limit: 1 },
      })
      const listed = response.products[0]

      try {
        const product = await retrieveProduct({
          storeCode: storeCode(),
          productId: listed.id,
          countryCode: countryCode(),
        })
        expect(product.id).toBe(listed.id)
        expect(product.title).toBe(listed.title)
      } catch (error) {
        expect(String((error as Error).message)).toMatch(/not found/i)
      }
    })
  })

  describe("listProductsWithSort", () => {
    it("returns a page of sorted products for a country", async () => {
      const result = await listProductsWithSort({
        storeCode: storeCode(),
        page: 1,
        countryCode: countryCode(),
        queryParams: { limit: 4 },
      })

      expect(result.response.products.length).toBeGreaterThan(0)
      expect(result.response.products.length).toBeLessThanOrEqual(4)
    })
  })

  describe("mapStoreProduct", () => {
    it("maps a store product into the AeroTrek product shape", async () => {
      const mapped = await mapStoreProduct({
        id: "prod_test",
        title: "Trail Shoe",
        handle: "trail-shoe",
        subtitle: "Short",
        description: "Full",
        thumbnail: "https://example.com/a.jpg",
        images: [{ url: "https://example.com/b.jpg" }],
        metadata: { discount: "10", rating: "4", is_new: true },
        tags: [{ id: "tag_1", value: "outdoor" }],
        categories: [{ handle: "shoes", name: "Shoes" }],
        variants: [
          {
            id: "variant_1",
            title: "Black / 42",
            sku: "SHOE-42",
            inventory_quantity: 3,
            calculated_price: {
              calculated_amount: 120,
              original_amount: 150,
              currency_code: "mvr",
            },
            options: [
              { value: "Black", option: { title: "Color" } },
              { value: "42", option: { title: "Size" } },
            ],
          },
        ],
      } as HttpTypes.StoreProduct)

      expect(mapped).toEqual(
        expect.objectContaining({
          id: "prod_test",
          name: "Trail Shoe",
          sku: "SHOE-42",
          discount: 10,
          rating: 4,
          new: true,
          category: ["shoes"],
          tag: ["outdoor"],
          image: ["https://example.com/a.jpg", "https://example.com/b.jpg"],
        })
      )
      expect(mapped.variation[0].color).toBe("Black")
      expect(mapped.variation[0].size[0].name).toBe("42")
    })
  })

  describe("listAerotrekProducts", () => {
    it("returns mapped catalog products for the default country", async () => {
      const products = await listAerotrekProducts({
        storeCode: storeCode(),
        queryParams: { limit: 5 },
      })

      expect(products.length).toBeGreaterThan(0)
      expect(products[0]).toEqual(
        expect.objectContaining({
          id: expect.stringMatching(/^prod_/),
          name: expect.any(String),
          image: expect.any(Array),
        })
      )
    })
  })

  describe("retrieveAerotrekProduct", () => {
    it("returns a mapped product by id", async () => {
      const listed = await listAerotrekProducts({
        storeCode: storeCode(),
        queryParams: { limit: 1 },
      })
      const product = await retrieveAerotrekProduct(listed[0].id, {
        storeCode: storeCode(),
      })

      expect(product?.id).toBe(listed[0].id)
      expect(product?.name).toBe(listed[0].name)
    })

    it("returns null for an unknown product id", async () => {
      const product = await retrieveAerotrekProduct("prod_does_not_exist", {
        storeCode: storeCode(),
      })

      expect(product).toBeNull()
    })
  })

  describe("listRelatedProducts", () => {
    it("excludes the current product and respects the limit", async () => {
      const listed = await listAerotrekProducts({
        storeCode: storeCode(),
        queryParams: { limit: 5 },
      })
      const current = listed[0]
      const related = await listRelatedProducts({
        productId: current.id,
        collectionId: current.collection_id,
        tagIds: current.tag_ids,
        countryCode: countryCode(),
        limit: 3,
      })

      expect(related.length).toBeLessThanOrEqual(3)
      expect(related.some((product) => product.id === current.id)).toBe(false)
    })
  })
})
