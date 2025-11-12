import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/axios';
import type { ApiResponse } from '../utils/api';

/**
 * Generic CRUD hooks factory.
 * Assumes the backend supports the following endpoints (defaults):
 *  - list:  GET '?action=list'
 *  - get:   GET '?action=get&id={id}'
 *  - create: POST ''
 *  - update: PUT '?action=update&id={id}'
 *  - delete: DELETE '?action=delete&id={id}'
 *
 * You can adapt the paths per API if your backend uses different patterns.
 */
export function createCrudHooks<T, CreateDto = Partial<T>, UpdateDto = Partial<T>>(
  resourceKey = 'resource'
) {
  const queryKey = [resourceKey];

  function useList() {
    return useQuery<T[], Error>({
      queryKey,
      queryFn: async () => {
        const resp = await api.get<ApiResponse<T[]>>('?action=list');
        if (!resp.data.ok) throw new Error(resp.data.error || 'Failed to fetch list');
        return resp.data.data || [];
      },
    });
  }

  function useGet(id: string | number) {
    return useQuery<T, Error>({
      queryKey: [...queryKey, id],
      queryFn: async () => {
        const resp = await api.get<ApiResponse<T>>(`?action=get&id=${id}`);
        if (!resp.data.ok) throw new Error(resp.data.error || 'Failed to fetch item');
        return resp.data.data as T;
      },
      enabled: !!id,
    });
  }

  function useCreate() {
    const qc = useQueryClient();
    return useMutation<ApiResponse<T>, Error, CreateDto>({
      mutationFn: async (data: CreateDto) => {
        const resp = await api.post<ApiResponse<T>>('', data);
        return resp.data;
      },
      onSuccess: () => qc.invalidateQueries({ queryKey }),
    });
  }

  function useUpdate() {
    const qc = useQueryClient();
    return useMutation<ApiResponse<T>, Error, { id: string | number; data: UpdateDto }>({
      mutationFn: async ({ id, data }) => {
        const resp = await api.put<ApiResponse<T>>(`?action=update&id=${id}`, data);
        return resp.data;
      },
      onSuccess: () => qc.invalidateQueries({ queryKey }),
    });
  }

  function useDelete() {
    const qc = useQueryClient();
    return useMutation<ApiResponse<null>, Error, string | number>({
      mutationFn: async (id) => {
        const resp = await api.delete<ApiResponse<null>>(`?action=delete&id=${id}`);
        return resp.data;
      },
      onSuccess: () => qc.invalidateQueries({ queryKey }),
    });
  }

  return {
    useList,
    useGet,
    useCreate,
    useUpdate,
    useDelete,
  };
}

// -- Concrete helpers for the 'submissions' resource (convenience wrappers) --
export type SubmissionCrud = ReturnType<typeof createCrudHooks>;
export const submissionsHooks = createCrudHooks('submissions');

export const useSubmissionList = submissionsHooks.useList;
export const useSubmissionGet = submissionsHooks.useGet;
export const useCreateSubmission = submissionsHooks.useCreate;
export const useUpdateSubmission = submissionsHooks.useUpdate;
export const useDeleteSubmission = submissionsHooks.useDelete;
