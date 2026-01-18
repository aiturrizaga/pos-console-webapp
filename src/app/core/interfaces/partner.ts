export interface PartnerResponse {
  id: number;
  tenantId: string;
  companyId: string;
  partnerType: 'PERSON' | 'COMPANY';
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  legalName?: string | null;
  tradeName?: string | null;
  documentTypeId?: number | null;
  documentNumber?: string | null;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  importantDate?: string | null;
  active: boolean;
}

export class CreateCompanyRequest {
  readonly partnerType = 'COMPANY';
  displayName?: string | null;
  legalName: string;
  tradeName: string;
  readonly documentTypeId = 2;
  documentNumber: string;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  importantDate?: string | null;

  constructor(legalName: string, tradeName: string, documentNumber: string) {
    this.legalName = legalName;
    this.tradeName = tradeName;
    this.documentNumber = documentNumber;
  }
}

export class CreatePersonRequest {
  readonly partnerType = 'PERSON';
  firstName: string;
  lastName: string;
  displayName?: string | null;
  readonly documentTypeId = 1;
  documentNumber: string;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  importantDate?: string | null;

  constructor(firstName: string, lastName: string, documentNumber: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.documentNumber = documentNumber;
  }
}

export interface CreatePartnerRequest {
  partnerType: 'PERSON' | 'COMPANY';
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  legalName?: string | null;
  tradeName?: string | null;
  documentTypeId?: number | null;
  documentNumber?: string | null;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  importantDate?: string | null;
}

export type UpdatePartnerRequest = Partial<CreatePartnerRequest>;
