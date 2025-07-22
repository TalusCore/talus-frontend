import { fetchStats } from '@/api/statApi';
import StatCard from '@/components/statCard';
import { BACKGROUND_COLOR } from '@/components/styles';
import { capitalizeFirstLetter } from '@/components/utils';
import { AuthContext } from '@/contexts/AuthContext';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

type Stat = {
  value: number;
  timestamp: Date;
};

type ResponseStat = {
  statName: string;
  value: number;
  timestamp: Date;
};

const averageHeartRate = (heartRates: number[]): number => {
  if (heartRates.length === 0) return 0;

  const lastFive = heartRates.slice(-5);
  const sum = lastFive.reduce((acc, rate) => acc + rate, 0);
  return Math.round(sum / lastFive.length);
};

const totalSteps = (steps: number[]): number => {
  return steps.reduce((acc, step) => acc + step, 0);
};

const totalHealthScore = (avgHeartRate: number, totalSteps: number): number => {
  if (avgHeartRate === 0) {
    return Math.round(Math.min(1, totalSteps / 10000) * 100);
  }

  let heartRateScore;

  if (avgHeartRate <= 100) {
    heartRateScore = (100 - avgHeartRate) / 50;
  } else {
    heartRateScore = (100 - avgHeartRate) / 30;
  }

  heartRateScore = Math.max(0, Math.min(1, heartRateScore));
  const stepsScore = Math.min(1, totalSteps / 10000);

  const healthScore = (heartRateScore * 0.5 + stepsScore * 0.5) * 100;

  return Math.round(healthScore);
};

const newStatData = (name: string, stats?: ResponseStat[]): Stat[] => {
  return (
    stats
      ?.filter(stat => stat.statName === name)
      .map(stat => ({
        value: stat.value,
        timestamp: new Date(stat.timestamp)
      })) || []
  );
};

const Home = (): React.JSX.Element => {
  const { talus, user } = useContext(AuthContext);
  const [heartRate, setHeartRate] = useState<Stat[]>([]);
  const [steps, setSteps] = useState<Stat[]>([]);
  const lastUpdate = useRef<Date | null>(null);

  useFocusEffect(
    useCallback(() => {
      setHeartRate([]);
      setSteps([]);
      lastUpdate.current = null;

      const fetchData = (): void => {
        if (!talus) {
          return;
        }

        fetchStats({
          talusId: talus?.talusId,
          startTime:
            lastUpdate.current ?? new Date(new Date().setHours(0, 0, 0, 0))
        })
          .then(response => {
            if (response.success) {
              const heartRateData = newStatData('heart_rate', response.stats);
              const stepsData = newStatData('steps', response.stats);

              setHeartRate(prev => [...prev, ...heartRateData]);
              setSteps(prev => [...prev, ...stepsData]);
              lastUpdate.current = new Date();
            }
          })
          .catch(error => {
            console.error('Error fetching stats:', error);
          });
      };

      fetchData();

      const intervalId = setInterval(fetchData, 1000);

      return (): void => clearInterval(intervalId);
    }, [talus])
  );

  return (
    <View style={homeStyles.container}>
      <Text style={homeStyles.welcomeText}>
        Welcome {capitalizeFirstLetter(user?.firstName, 'User')}!
      </Text>
      <StatCard
        label="Total Health Score"
        value={totalHealthScore(
          averageHeartRate(heartRate.map(hr => hr.value)),
          totalSteps(steps.map(step => step.value))
        )}
      />
      <StatCard
        label="Average Heart Rate"
        value={averageHeartRate(heartRate.map(hr => hr.value))}
      />
      <StatCard
        label="Total Steps"
        value={totalSteps(steps.map(step => step.value))}
      />
    </View>
  );
};

const homeStyles = StyleSheet.create({
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#ffffff'
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    paddingTop: 32,
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
});

export default Home;
