import { capitalizeFirstLetter } from '@/components/utils';
import apiClient, { type ErrorResponse } from './apiClient';

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

type TalusParams = {
  email: string;
  talusId: string;
  name: string;
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
      talusName: capitalizeFirstLetter(response.data.talusName, 'Talus'),
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: (error as ErrorResponse).response.data.message ?? String(error)
    };
  }
};
