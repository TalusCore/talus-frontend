import type { ErrorResponse, Talus } from '@/components/types';
import { capitalizeFirstLetter } from '@/components/utils';
import apiClient from './apiClient';

type TalusId = {
  talusId?: string;
  error?: string;
  success: boolean;
};

type TalusInfo = {
  email?: string;
  talusName?: string;
  error?: string;
  success: boolean;
};

type TalusParams = Talus & {
  email: string;
};

export const getTalus = async (id: string): Promise<TalusId> => {
  try {
    const response = await apiClient.get(`/talus`, {
      params: { talusId: id }
    });
    return {
      talusId: response.data.talusId,
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: (error as ErrorResponse).response.data.message ?? String(error)
    };
  }
};

export const pairTalus = async (
  talusParams: TalusParams
): Promise<TalusInfo> => {
  try {
    const response = await apiClient.post(`/talus`, talusParams);

    return {
      email: response.data.email,
      talusName: capitalizeFirstLetter(response.data.talusName),
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: (error as ErrorResponse).response.data.message ?? String(error)
    };
  }
};

export const deleteTalus = async (talusId: string): Promise<TalusId> => {
  try {
    const response = await apiClient.delete(`/talus`, {
      params: { talusId }
    });
    return {
      talusId: response.data.talusId,
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: (error as ErrorResponse).response.data.message ?? String(error)
    };
  }
};

export const renameTalus = async (
  talusId: string,
  newName: string
): Promise<TalusInfo> => {
  try {
    const response = await apiClient.put(`/talus`, {
      talusId,
      name: newName
    });

    return {
      email: response.data.email,
      talusName: capitalizeFirstLetter(response.data.name),
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: (error as ErrorResponse).response.data.message ?? String(error)
    };
  }
};
