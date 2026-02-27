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
      error: (error as ErrorResponse).response?.data?.message ?? String(error)
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
      (error as ErrorResponse).response?.data?.message ?? String(error)
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
      (error as ErrorResponse).response?.data?.message ?? String(error)
    );
    return [];
  }
};

export const fetchMLInsights = async (
  talusId: string,
  age: number,
  weight: number,
  height: number,
  steps: number,
  gender: string,
  fitnessLevel: number
): Promise<string[]> => {
  try {
    const response = await apiClient.get('/stat/ml_insights', {
      params: {
        talusId,
        age,
        weight_kg: weight,
        height_cm: height,
        steps_per_day: steps,
        gender,
        fitness_level: fitnessLevel
      }
    });

    if (
      response?.data?.recommendations !== undefined &&
      Array.isArray(response.data.recommendations) &&
      response.data.recommendations.length > 0 &&
      response.data.recommendations[0].tips !== undefined
    ) {
      return response.data.recommendations[0].tips;
    }

    return [];
  } catch (error) {
    console.error(
      'Error fetching ML insights:',
      (error as ErrorResponse).response?.data?.message ?? String(error)
    );
    return [];
  }
};
