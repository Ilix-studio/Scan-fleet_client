// redux-store/services/stickerGarageApi.ts
import { baseApi } from "./baseApi";

// =====================================================
// Type Definitions
// =====================================================

export interface StickerGarageTag {
  id: string;
  tagName: string;
  description?: string;
  stickerType: "STATIC" | "DYNAMIC";
  priceWithoutToken: number;
  isCustomizable: boolean;
  status: "ACTIVE" | "INACTIVE";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ListStickerTagsResponse {
  success: boolean;
  items: StickerGarageTag[];
  pagination: Pagination;
}

export interface GetStickerTagResponse {
  success: boolean;
  data: StickerGarageTag;
}

export interface PurchaseStickerTagResponse {
  success: boolean;
  amount: number;
}

export interface CreateStickerTagRequest {
  tagName: string;
  description?: string;
  stickerType: "STATIC" | "DYNAMIC";
  priceWithoutToken: number;
  isCustomizable?: boolean;
  status?: "ACTIVE" | "INACTIVE";
}

export interface UpdateStickerTagRequest extends Partial<CreateStickerTagRequest> {}

export interface GenericSuccessResponse {
  success: boolean;
  message?: string;
  data?: StickerGarageTag;
}

// =====================================================
// API Service
// =====================================================

export const stickerGarageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // -------------------------------------------------
    // Public – List & Get
    // -------------------------------------------------
    listStickerTags: builder.query<ListStickerTagsResponse, { page?: number; limit?: number } | void>({
      query: (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 20;
        return `/sticker-garage?page=${page}&limit=${limit}`;
      },
      providesTags: (result) =>
        result
          ? [
              // Provide individual cache tags for each item
              ...result.items.map(({ id }) => ({ type: "StickerGarage" as const, id })),
              { type: "StickerGarage", id: "LIST" },
            ]
          : [{ type: "StickerGarage", id: "LIST" }],
    }),

    getStickerTagById: builder.query<GetStickerTagResponse, string>({
      query: (id) => `/sticker-garage/${id}`,
      providesTags: (_result, _error, id) => [{ type: "StickerGarage", id }],
    }),

    // -------------------------------------------------
    // Purchase (DIRECT_CUSTOMER)
    // -------------------------------------------------
    purchaseStickerTag: builder.mutation<PurchaseStickerTagResponse, string>({
      query: (id) => ({
        url: `/sticker-garage/${id}/purchase`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "StickerGarage", id }],
    }),

    // -------------------------------------------------
    // Admin CRUD (SUPER_ADMIN)
    // -------------------------------------------------
    createStickerTag: builder.mutation<GenericSuccessResponse, CreateStickerTagRequest>({
      query: (body) => ({
        url: "/sticker-garage",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "StickerGarage", id: "LIST" }],
    }),

    updateStickerTag: builder.mutation<GenericSuccessResponse, { id: string; data: UpdateStickerTagRequest }>({
      query: ({ id, data }) => ({
        url: `/sticker-garage/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "StickerGarage", id },
        { type: "StickerGarage", id: "LIST" },
      ],
    }),

    deleteStickerTag: builder.mutation<GenericSuccessResponse, string>({
      query: (id) => ({
        url: `/sticker-garage/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "StickerGarage", id },
        { type: "StickerGarage", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

// =====================================================
// Exported Hooks
// =====================================================

export const {
  useListStickerTagsQuery,
  useGetStickerTagByIdQuery,
  usePurchaseStickerTagMutation,
  useCreateStickerTagMutation,
  useUpdateStickerTagMutation,
  useDeleteStickerTagMutation,
} = stickerGarageApi;
