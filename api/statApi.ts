import type { ErrorResponse } from '@/components/types';
import apiClient from './apiClient';

type FetchStatsParams = {
  talusId: string;
  startTime: Date;
};

type StatResponse = {
  statName: string;
  value: number;
  timestamp: Date;
};

type FetchStatsResponse = {
  stats?: StatResponse[];
  success: boolean;
  error?: string;
};

export const fetchStats = async (
  fetchStatsParams: FetchStatsParams
): Promise<FetchStatsResponse> => {
  try {
    const response = await apiClient.get('/stat', {
      params: {
        talusId: fetchStatsParams.talusId,
        startTime: fetchStatsParams.startTime.toISOString()
      }
    });
    const stats = response.data.map((stat: StatResponse) => ({
      statName: stat.statName,
      value: stat.value,
      timestamp: new Date(stat.timestamp)
    }));

    return {
      stats,
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: (error as ErrorResponse).response.data.message ?? String(error)
    };
  }
};

export const fetchStatNames = async (talusId: string): Promise<string[]> => {
  try {
    const response = await apiClient.get('/stat/names', {
      params: { talusId }
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching stat names:',
      (error as ErrorResponse).response.data.message ?? String(error)
    );
    return [];
  }
};

export const fetchStatsByNameRange = async (
  talusId: string,
  statName: string,
  startDate: Date,
  endDate: Date
): Promise<StatResponse[]> => {
  try {
    const response = await apiClient.get('/stat/stat-by-name', {
      params: {
        talusId,
        statName,
        startTime: startDate,
        endTime: endDate
      }
    });
    return response.data.map((stat: StatResponse) => ({
      statName: stat.statName,
      value: stat.value,
      timestamp: new Date(stat.timestamp)
    }));
  } catch (error) {
    console.error(
      'Error fetching stats by name and range:',
      (error as ErrorResponse).response.data.message ?? String(error)
    );
    return [];
  }
};
