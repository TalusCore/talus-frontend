import apiClient, { type ErrorResponse } from './apiClient';

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
