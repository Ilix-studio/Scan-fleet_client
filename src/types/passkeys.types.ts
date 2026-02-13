export interface PasskeyPaginationParams {
  status?: "ACTIVE" | "USED" | "EXPIRED" | "REVOKED";
  page?: number;
  limit?: number;
}

export interface Passkey {
  _id: string;
  code: string;
  dealershipOwnerId: string;
  status: "ACTIVE" | "USED" | "EXPIRED" | "REVOKED";
  usedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  usedAt?: string;
  label?: string;
  expiresAt: string;
  revokedAt?: string;
  revokedReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePasskeyRequest {
  label?: string;
  expiresInDays?: number;
}

export interface CreatePasskeyResponse {
  success: boolean;
  data: {
    code: string;
    passkey: Passkey;
  };
  message: string;
}

export interface UsePasskeyRequest {
  code: string;
}

export interface UsePasskeyResponse {
  success: boolean;
  data: {
    success: boolean;
    owner: {
      id: string;
      name: string;
      businessName?: string;
    };
    salesman: {
      id: string;
      name: string;
      email: string;
    };
  };
  message: string;
}

export interface RevokePasskeyRequest {
  reason?: string;
}

export interface RevokePasskeyResponse {
  success: boolean;
  data: Passkey;
  message: string;
}

export interface GetPasskeysResponse {
  success: boolean;
  data: Passkey[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface Salesman {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  walletBalance: number;
  linkedAt?: string;
  status: string;
}

export interface GetLinkedSalesmenResponse {
  success: boolean;
  data: {
    salesmen: Salesman[];
    count: number;
    maxAllowed: number;
    canLinkMore: boolean;
  };
}

export interface UnlinkSalesmanResponse {
  success: boolean;
  data: {
    success: boolean;
  };
  message: string;
}

export interface Dealership {
  _id: string;
  name: string;
  businessName?: string;
  email: string;
  phone?: string;
}

export interface GetMyDealershipResponse {
  success: boolean;
  data: {
    dealership: Dealership;
    linkedAt?: string;
  } | null;
  message?: string;
}
