import { fetchStats } from '@/api/statApi';
import StatCard from '@/components/statCard';
import { BACKGROUND_COLOR } from '@/components/styles';
import {
  capitalizeFirstLetter,
  rollingAverage,
  sumValues,
  totalHealthScore
} from '@/components/utils';
import { AuthContext } from '@/contexts/AuthContext';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
  const [temperature, setTemperature] = useState<Stat[]>([]);
  const [pressure, setPressure] = useState<Stat[]>([]);
  const [humidity, setHumidity] = useState<Stat[]>([]);
  const [altitude, setAltitude] = useState<Stat[]>([]);
  const [bpm, setBpm] = useState<Stat[]>([]);
  const [steps, setSteps] = useState<Stat[]>([]);
  const lastUpdate = useRef<Date | null>(null);

  useFocusEffect(
    useCallback(() => {
      setTemperature([]);
      setPressure([]);
      setHumidity([]);
      setAltitude([]);
      setBpm([]);
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
              const temperatureData = newStatData(
                'temperature',
                response.stats
              );
              const pressureData = newStatData('pressure', response.stats);
              const humidityData = newStatData('humidity', response.stats);
              const altitudeData = newStatData('altitude', response.stats);
              const bpmData = newStatData('bpm', response.stats);
              const stepData = newStatData('steps', response.stats);

              setTemperature(prev => [...prev, ...temperatureData]);
              setPressure(prev => [...prev, ...pressureData]);
              setHumidity(prev => [...prev, ...humidityData]);
              setAltitude(prev => [...prev, ...altitudeData]);
              setBpm(prev => [...prev, ...bpmData]);
              setSteps(prev => [...prev, ...stepData]);

              lastUpdate.current = new Date();
            }
          })
          .catch(error => {
            console.error('Error fetching stats:', error);
          });
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
        style={{ width: '100%' }}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <StatCard
          label="Total Health Score"
          value={totalHealthScore(
            rollingAverage(
              temperature.map(temp => temp.value),
              5
            ),
            rollingAverage(
              pressure.map(p => p.value),
              5
            ),
            rollingAverage(
              humidity.map(h => h.value),
              5
            ),
            rollingAverage(
              altitude.map(a => a.value),
              5
            ),
            rollingAverage(
              bpm.map(b => b.value),
              5
            ),
            sumValues(steps.map(s => s.value))
          )}
        />
        <StatCard
          label="Temperature"
          value={rollingAverage(
            temperature.map(t => t.value),
            5
          )}
        />
        <StatCard
          label="Pressure"
          value={rollingAverage(
            pressure.map(p => p.value),
            5
          )}
        />
        <StatCard
          label="Humidity"
          value={rollingAverage(
            humidity.map(h => h.value),
            5
          )}
        />
        <StatCard
          label="Altitude"
          value={rollingAverage(
            altitude.map(a => a.value),
            5
          )}
        />
        <StatCard
          label="BPM"
          value={rollingAverage(
            bpm.map(b => b.value),
            5
          )}
        />
        <StatCard label="Steps" value={sumValues(steps.map(s => s.value))} />
      </ScrollView>
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
