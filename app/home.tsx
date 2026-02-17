import { fetchStats } from '@/api/statApi';
import { homeStyles, scrollViewStyles } from '@/components/home/styles';
import type { Stat } from '@/components/home/types';
import {
  MostRecentValues,
  averageStat,
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
  const lastUpdate = useRef<Date | null>(null);

  const temperatureAvg = useMemo(() => averageStat(temperature), [temperature]);
  const pressureAvg = useMemo(() => averageStat(pressure), [pressure]);
  const humidityAvg = useMemo(() => averageStat(humidity), [humidity]);
  const altitudeAvg = useMemo(() => averageStat(altitude), [altitude]);
  const bpmAvg = useMemo(() => averageStat(bpm), [bpm]);

  useFocusEffect(
    useCallback(() => {
      const resetStats = (): void => {
        setTemperature([]);
        setPressure([]);
        setHumidity([]);
        setAltitude([]);
        setBpm([]);
        setSteps(0);
        lastUpdate.current = null;
      };

      resetStats();

      const rollingAverageStats = [
        { name: 'temperature' as const, setter: setTemperature },
        { name: 'pressure' as const, setter: setPressure },
        { name: 'humidity' as const, setter: setHumidity },
        { name: 'altitude' as const, setter: setAltitude },
        { name: 'bpm' as const, setter: setBpm }
      ];

      const fetchData = async (): Promise<void> => {
        if (!talus) return;

        const startTime = lastUpdate.current ?? startOfToday();

        try {
          const response = await fetchStats({
            talusId: talus.talusId,
            startTime
          });

          if (response.success) {
            if (response.stats && response.stats.length > 0) {
              rollingAverageStats.forEach(({ name, setter }) => {
                const statData = newStatData(name, response.stats);
                setter(prev => MostRecentValues([...prev, ...statData]));
              });

              const stepData = newStatData('steps', response.stats);
              const totalSteps = sumValues(stepData.map(s => s.value));
              setSteps(prev => prev + totalSteps);
            }

            lastUpdate.current = new Date();
          }
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      };

      fetchData();

      const intervalId = setInterval(fetchData, 5000);

      return (): void => clearInterval(intervalId);
    }, [talus])
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
