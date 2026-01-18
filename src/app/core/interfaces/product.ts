export interface ProductSkuUpsertRequest {
  id?: number | null;
  skuCode?: string | null;
  barcode?: string | null;
  name: string;
  uomId: number;
  salePrice?: number | null;
  costPrice?: number | null;
  isDefault: boolean;
  isBaseUnit?: boolean | null;
  baseSkuId?: number | null;
  baseQty?: number | null;
}

export type ProductSkuCreateRequest = Omit<ProductSkuUpsertRequest, "id">;

export interface ProductSkuResponse {
  id: number;
  skuCode?: string | null;
  barcode?: string | null;
  name: string;
  uomId: number;
  uomName?: string | null;
  salePrice?: number | null;
  costPrice?: number | null;
  isDefault: boolean;
  isBaseUnit: boolean;
  baseSkuId?: number | null;
  baseQty?: number | null;
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
  currencyCode: "PEN" | string;
  taxId: number;
  unspsc?: number | null;
  allowDiscount?: boolean | null;
  allowPriceOverride?: boolean | null;
  inventoryPolicy?: "NONE" | "TRACK" | string | null;
  trackLot?: boolean | null;
  trackExpiry?: boolean | null;
  metadata?: unknown | null;
  categoryIds?: string[] | null;
  skus?: ProductSkuUpsertRequest[] | null;
}

export type ProductCreateRequest = ProductBase;

export type ProductUpdateRequest =
  Partial<Omit<ProductBase, "currencyCode">> & Pick<ProductBase, "currencyCode">;

export type ProductResponse =
  Omit<ProductBase, "categoryIds" | "skus"> & {
  id: number;
  companyId: string;
  active: boolean;
  categories: CategoryRefResponse[];
  skus: ProductSkuResponse[];
};

