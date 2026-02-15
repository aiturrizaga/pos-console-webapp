export interface ProductSkuResponse {
  id: number;
  code?: string | null;
  name: string;
  price: number;
  sellable: boolean;
  active: boolean;
}

export interface CategoryRefResponse {
  id: string;
  name?: string | null;
}

export interface ProductBase {
  code: string;
  name: string;
  description: string;
  brand?: string | null;
  type: 'SIMPLE' | 'MODIFIER' | 'VARIANT';
  currencyCode: 'PEN' | string;
  price: number;
  taxId: number;
  unspsc?: number | null;
  allowDiscount?: boolean | null;
  allowPriceOverride?: boolean | null;
  trackLot?: boolean | null;
  trackExpiry?: boolean | null;
  metadata?: unknown | null;
  categoryIds?: string[] | null;
}

export type ProductCreateRequest = ProductBase;

export type ProductUpdateRequest =
  Partial<Omit<ProductBase, "currencyCode">> & Pick<ProductBase, "currencyCode">;

export type ProductResponse =
  Omit<ProductBase, "categoryIds"> & {
  id: number;
  uomName: string;
  uomSymbol: string;
  taxName: string;
  companyId: string;
  active: boolean;
  categories: CategoryRefResponse[];
  sku: ProductSkuResponse;
};

export type ProductSaleItem = ProductResponse & {
  qty: number;
};
