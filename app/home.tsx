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

const DEFAULT_HEIGHT_CM = 175;
const DEFAULT_WEIGHT_KG = 70;

const Home = (): React.JSX.Element => {
  const { talus, user } = useContext(AuthContext);
  const heightMultiplier =
    user?.height !== undefined ? user.height / DEFAULT_HEIGHT_CM : 1;
  const weightMultiplier =
    user?.weight !== undefined ? user.weight / DEFAULT_WEIGHT_KG : 1;

  const [temperature, setTemperature] = useState<Stat[]>([]);
  const [pressure, setPressure] = useState<Stat[]>([]);
  const [humidity, setHumidity] = useState<Stat[]>([]);
  const [altitude, setAltitude] = useState<Stat[]>([]);
  const [bpm, setBpm] = useState<Stat[]>([]);
  const [steps, setSteps] = useState<number>(0);
  const [cadence, setCadence] = useState<Stat[]>([]);
  const [force, setForce] = useState<Stat[]>([]);
  const [power, setPower] = useState<Stat[]>([]);
  const [spo2, setSpo2] = useState<Stat[]>([]);
  const [flights, setFlights] = useState<number>(0);
  const [tpi, setTpi] = useState<Stat[]>([]);
  const [mlInsightIndex, setMlInsightIndex] = useState<number>(0);
  const [mlInsights, setMlInsights] = useState<string[]>([]);
  const lastUpdate = useRef<Date | null>(null);
  const mlInsightsRef = useRef<string[]>([]);

  const temperatureAvg = useMemo(() => averageStat(temperature), [temperature]);
  const pressureAvg = useMemo(() => averageStat(pressure), [pressure]);
  const humidityAvg = useMemo(() => averageStat(humidity), [humidity]);
  const altitudeAvg = useMemo(() => averageStat(altitude), [altitude]);
  const bpmAvg = useMemo(() => averageStat(bpm), [bpm]);
  const cadenceAvg = useMemo(() => averageStat(cadence), [cadence]);
  const forceAvg = useMemo(() => averageStat(force), [force]);
  const powerAvg = useMemo(() => averageStat(power), [power]);
  const spo2Avg = useMemo(() => averageStat(spo2), [spo2]);
  const tpiAvg = useMemo(() => averageStat(tpi), [tpi]);

  useFocusEffect(
    useCallback(() => {
      const resetState = (): void => {
        setTemperature([]);
        setPressure([]);
        setHumidity([]);
        setAltitude([]);
        setBpm([]);
        setSteps(0);
        setCadence([]);
        setForce([]);
        setPower([]);
        setSpo2([]);
        setFlights(0);
        setTpi([]);
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
        { name: 'bpm', setter: setBpm },
        { name: 'cadence', setter: setCadence },
        { name: 'force', setter: setForce },
        { name: 'power', setter: setPower },
        { name: 'spo2', setter: setSpo2 },
        { name: 'tpi', setter: setTpi }
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
                bpm: bpm,
                cadence: cadence,
                force: force,
                power: power,
                spo2: spo2,
                tpi: tpi
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

              const flightsData = newStatData('flights', response.stats);
              const totalFlights = sumValues(flightsData.map(s => s.value));
              setFlights(prev => prev + totalFlights);

              const healthScore = totalHealthScore(
                averageStat(updatedStats.temperature),
                averageStat(updatedStats.pressure),
                averageStat(updatedStats.humidity),
                averageStat(updatedStats.altitude),
                averageStat(updatedStats.bpm),
                steps + totalSteps
              );
              const adjustedHealthScore =
                (healthScore + averageStat(updatedStats.tpi)) / 2;

              if (mlInsightsRef.current.length === 0 && user) {
                const age = getAge(user.birthday);
                const fitnessLevel = adjustedHealthScore;
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
            value:
              (totalHealthScore(
                temperatureAvg,
                pressureAvg,
                humidityAvg,
                altitudeAvg,
                bpmAvg,
                steps
              ) +
                tpiAvg) /
              2
          },

          { label: 'Heart Rate (BPM)', value: bpmAvg },
          { label: 'Blood Oxygen (%)', value: spo2Avg },

          { label: 'Steps', value: steps },
          { label: 'Cadence (steps/min)', value: cadenceAvg },
          { label: 'Flights Climbed', value: flights },

          {
            label: 'Avg Force (N)',
            value: forceAvg * heightMultiplier
          },
          { label: 'Avg Power (W)', value: powerAvg * weightMultiplier },

          { label: 'Temperature (°C)', value: temperatureAvg },
          { label: 'Pressure (hPa)', value: pressureAvg },
          { label: 'Humidity (%)', value: humidityAvg },
          { label: 'Altitude (m)', value: altitudeAvg }
        ].map(card => (
          <StatCard key={card.label} label={card.label} value={card.value} />
        ))}
      </ScrollView>
    </View>
  );
};

export default Home;
