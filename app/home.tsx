import { fetchStats } from '@/api/statApi';
import styles from '@/components/styles';
import { AuthContext } from '@/contexts/AuthContext';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useRef, useState } from 'react';
import { Text, View } from 'react-native';

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
  const { talus } = useContext(AuthContext);
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
    <View style={styles.container}>
      <Text style={styles.text}>
        Welcome to Talus! This is the home page where you can view your stats.
      </Text>
      <Text style={styles.text}>
        Heart Rate: {averageHeartRate(heartRate.map(hr => hr.value))} bpm
      </Text>
      <Text style={styles.text}>
        Steps: {totalSteps(steps.map(step => step.value))}
      </Text>
    </View>
  );
};

export default Home;
