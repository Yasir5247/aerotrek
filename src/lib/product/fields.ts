/** Fields for product detail page (variants, pricing, related metadata). */
export const PDP_FIELDS =
  "*variants, +variants.inventory_quantity, +variants.manage_inventory, +variants.allow_backorder, *variants.calculated_price, +variants.images, *images, *options, *options.values, *collection, *tags";
