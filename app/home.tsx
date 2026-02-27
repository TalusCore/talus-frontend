import { fetchMLInsights, fetchStats } from '@/api/statApi';
import {
  fitnessTipStyles,
  homeStyles,
  scrollViewStyles
} from '@/components/home/styles';
import type { RollingStatName, Stat } from '@/components/home/types';
import {
  averageStat,
  getAge,
  mostRecentValues,
  newStatData,
  startOfToday,
  sumValues,
  totalHealthScore
} from '@/components/home/utils';
import StatCard from '@/components/statCard';
import { capitalizeFirstLetter } from '@/components/utils';
import { AuthContext } from '@/contexts/AuthContext';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';

const Home = (): React.JSX.Element => {
  const { talus, user } = useContext(AuthContext);
  const [temperature, setTemperature] = useState<Stat[]>([]);
  const [pressure, setPressure] = useState<Stat[]>([]);
  const [humidity, setHumidity] = useState<Stat[]>([]);
  const [altitude, setAltitude] = useState<Stat[]>([]);
  const [bpm, setBpm] = useState<Stat[]>([]);
  const [steps, setSteps] = useState<number>(0);
  const [mlInsightIndex, setMlInsightIndex] = useState<number>(0);
  const [mlInsights, setMlInsights] = useState<string[]>([]);
  const lastUpdate = useRef<Date | null>(null);
  const mlInsightsRef = useRef<string[]>([]);

  const temperatureAvg = useMemo(() => averageStat(temperature), [temperature]);
  const pressureAvg = useMemo(() => averageStat(pressure), [pressure]);
  const humidityAvg = useMemo(() => averageStat(humidity), [humidity]);
  const altitudeAvg = useMemo(() => averageStat(altitude), [altitude]);
  const bpmAvg = useMemo(() => averageStat(bpm), [bpm]);

  useFocusEffect(
    useCallback(() => {
      const resetState = (): void => {
        setTemperature([]);
        setPressure([]);
        setHumidity([]);
        setAltitude([]);
        setBpm([]);
        setSteps(0);
        setMlInsights([]);
        setMlInsightIndex(0);
        mlInsightsRef.current = [];
        lastUpdate.current = null;
      };

      resetState();

      const rollingAverageStats: {
        name: RollingStatName;
        setter: React.Dispatch<React.SetStateAction<Stat[]>>;
      }[] = [
        { name: 'temperature', setter: setTemperature },
        { name: 'pressure', setter: setPressure },
        { name: 'humidity', setter: setHumidity },
        { name: 'altitude', setter: setAltitude },
        { name: 'bpm', setter: setBpm }
      ];

      const fetchData = async (): Promise<void> => {
        if (!talus) return;

        const startTime = lastUpdate.current ?? startOfToday();
        lastUpdate.current = new Date();

        try {
          const response = await fetchStats({
            talusId: talus.talusId,
            startTime
          });

          if (response.success) {
            if (response.stats && response.stats.length > 0) {
              const updatedStats: Record<RollingStatName, Stat[]> = {
                temperature: temperature,
                pressure: pressure,
                humidity: humidity,
                altitude: altitude,
                bpm: bpm
              };

              rollingAverageStats.forEach(({ name, setter }) => {
                const statData = newStatData(name, response.stats);
                const merged = mostRecentValues([
                  ...updatedStats[name],
                  ...statData
                ]);
                updatedStats[name] = merged;
                setter(merged);
              });

              const stepData = newStatData('steps', response.stats);
              const totalSteps = sumValues(stepData.map(s => s.value));
              setSteps(prev => prev + totalSteps);

              if (mlInsightsRef.current.length === 0 && user) {
                const age = getAge(user.birthday);
                const fitnessLevel = totalHealthScore(
                  averageStat(updatedStats.temperature),
                  averageStat(updatedStats.pressure),
                  averageStat(updatedStats.humidity),
                  averageStat(updatedStats.altitude),
                  averageStat(updatedStats.bpm),
                  steps + totalSteps
                );
                const insight = await fetchMLInsights(
                  talus.talusId,
                  age,
                  user.weight,
                  user.height,
                  steps + totalSteps,
                  user.gender,
                  fitnessLevel
                );
                setMlInsights(insight);
                mlInsightsRef.current = insight;
              }
            }
          }

          if (mlInsightsRef.current.length > 0) {
            setMlInsightIndex(
              prev => (prev + 1) % mlInsightsRef.current.length
            );
          }
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      };

      fetchData();

      const intervalId = setInterval(fetchData, 5000);

      return (): void => clearInterval(intervalId);
    }, [talus, user])
  );

  return (
    <View style={homeStyles.container}>
      <Text style={homeStyles.welcomeText}>
        Welcome {capitalizeFirstLetter(user?.firstName ?? 'User')}!
      </Text>
      <ScrollView
        style={scrollViewStyles.container}
        contentContainerStyle={scrollViewStyles.containerContent}
      >
        <View style={fitnessTipStyles.card}>
          <Text style={fitnessTipStyles.cardLabel}>Fitness Tip</Text>
          <Text style={fitnessTipStyles.cardValue}>
            {mlInsights[mlInsightIndex] ?? 'No fitness tips available'}
          </Text>
        </View>
        {[
          {
            label: 'Total Health Score',
            value: totalHealthScore(
              temperatureAvg,
              pressureAvg,
              humidityAvg,
              altitudeAvg,
              bpmAvg,
              steps
            )
          },
          { label: 'Temperature', value: temperatureAvg },
          { label: 'Pressure', value: pressureAvg },
          { label: 'Humidity', value: humidityAvg },
          { label: 'Altitude', value: altitudeAvg },
          { label: 'BPM', value: bpmAvg },
          { label: 'Steps', value: steps }
        ].map(card => (
          <StatCard key={card.label} label={card.label} value={card.value} />
        ))}
      </ScrollView>
    </View>
  );
};

export default Home;
