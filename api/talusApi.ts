import { capitalizeFirstLetter } from '@/components/utils';
import apiClient from './apiClient';

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

type ErrorResponse = { response: { data: { message: string } } };

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
