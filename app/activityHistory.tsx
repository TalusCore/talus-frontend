import { fetchStatNames, fetchStatsByNameRange } from '@/api/statApi';
import { BACKGROUND_COLOR } from '@/components/styles';
import { AuthContext } from '@/contexts/AuthContext';
import DateTimePicker, {
  type DateTimePickerEvent
} from '@react-native-community/datetimepicker';
import { useContext, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dropdown } from 'react-native-element-dropdown';
import { Provider, Text } from 'react-native-paper';

const ActivityHistory = (): React.JSX.Element => {
  const { talus } = useContext(AuthContext);
  const [stats, setStats] = useState<string[]>([]);
  const [value, setValue] = useState<string>('');
  const [data, setData] = useState<{
    labels: string[];
    datasets: { data: number[] }[];
  }>({
    labels: [],
    datasets: [{ data: [] }]
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const fetchStatList = (): void => {
    if (!talus) {
      return;
    }

    fetchStatNames(talus.talusId).then(statNames => {
      setStats(statNames);
    });
  };

  const fetchStats = (
    statName: string,
    startDate: Date,
    endDate: Date
  ): void => {
    if (!talus) {
      return;
    }

    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    console.log('Fetching stats for:', statName, startOfDay, endOfDay);

    fetchStatsByNameRange(talus.talusId, statName, startOfDay, endOfDay).then(
      response => {
        console.log('Fetched stats:', response);

        const chartData = {
          labels: response.map(entry => {
            const date = new Date(entry.timestamp);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }),
          datasets: [
            {
              data: response.map(entry => entry.value)
            }
          ]
        };

        setData(chartData);
      }
    );
  };

  const changeStartDate = (
    _: DateTimePickerEvent,
    selectedDate?: Date
  ): void => {
    if (!selectedDate) {
      return;
    }

    setStartDate(selectedDate);

    if (value !== '') {
      fetchStats(value, startDate, selectedDate);
    }
  };

  const changeEndDate = (_: DateTimePickerEvent, selectedDate?: Date): void => {
    if (!selectedDate) {
      return;
    }

    setEndDate(selectedDate);

    if (value !== '') {
      fetchStats(value, startDate, selectedDate);
    }
  };

  const setStatValue = (selectedStat: {
    label: string;
    value: string;
  }): void => {
    setValue(selectedStat.value);

    fetchStats(selectedStat.value, startDate, endDate);
  };

  fetchStatList();

  return (
    <Provider>
      <View style={activityHistoryStyles.container}>
        <View style={activityHistoryStyles.dropdown}>
          <Dropdown
            style={dropdownStyles.dropdown}
            placeholderStyle={dropdownStyles.fontStyle}
            selectedTextStyle={dropdownStyles.fontStyle}
            data={stats?.map(stat => ({ label: stat, value: stat })) ?? []}
            labelField="label"
            valueField="value"
            placeholder="Select stat"
            value={value}
            onChange={setStatValue}
          />
        </View>
        <View style={activityHistoryStyles.dateTimePickerContainer}>
          <View>
            <Text style={activityHistoryStyles.label}>Start date</Text>
            <DateTimePicker
              testID="dateTimePicker"
              value={startDate}
              mode={'date'}
              is24Hour={true}
              onChange={changeStartDate}
            />
          </View>
          <View>
            <Text style={activityHistoryStyles.label}>End date</Text>
            <DateTimePicker
              testID="dateTimePicker"
              value={endDate}
              mode={'date'}
              is24Hour={true}
              onChange={changeEndDate}
            />
          </View>
        </View>

        {data.labels.length > 0 ? (
          <View
            style={{
              backgroundColor: 'white',
              padding: 12,
              paddingBottom: 0,
              marginHorizontal: 16,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <LineChart
              data={data}
              bezier
              fromZero
              width={Dimensions.get('window').width - 120}
              height={220}
              chartConfig={{
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: () => '#007AFF',
                labelColor: () => '#333333',
                strokeWidth: 2,
                decimalPlaces: 0
              }}
            />
          </View>
        ) : (
          <Text style={{ textAlign: 'center', color: 'white', fontSize: 20 }}>
            No data available for the selected date range.
          </Text>
        )}
      </View>
    </Provider>
  );
};

const activityHistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR
  },
  dropdown: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20
  },
  dateTimePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 24
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center'
  }
});

const dropdownStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16
  },
  dropdown: {
    height: 50,
    width: '90%',
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8
  },
  fontStyle: {
    fontSize: 16
  }
});

export default ActivityHistory;
