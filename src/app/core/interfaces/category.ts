export interface Category {
  id: string;
  parentId: number;
  name: string;
  description: string;
  sortOrder: number;
  color: string;
  slug: string;
  active: boolean;
}

export interface CategoryCreateRequest {
  parentId?: string;
  companyId: string;
  name: string;
  description?: string;
  sortOrder: number;
  color?: string;
  slug?: string;
}

export type CategoryUpdateRequest = Omit<CategoryCreateRequest, 'companyId'>;
