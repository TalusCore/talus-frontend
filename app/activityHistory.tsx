import { fetchStatNames, fetchStatsByNameRange } from '@/api/statApi';
import { BACKGROUND_COLOR } from '@/components/styles';
import { capitalizeFirstLetter } from '@/components/utils';
import { AuthContext } from '@/contexts/AuthContext';
import DateTimePicker, {
  type DateTimePickerEvent
} from '@react-native-community/datetimepicker';
import { useContext, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import type {
  ChartData,
  Dataset
} from 'react-native-chart-kit/dist/HelperTypes';
import { Dropdown } from 'react-native-element-dropdown';
import { Provider, Text } from 'react-native-paper';

type TooltipState = {
  index: number;
  visible: boolean;
  x: number;
  y: number;
  value: number;
  label: string;
};

const ActivityHistory = (): React.JSX.Element => {
  const { talus } = useContext(AuthContext);

  const [stats, setStats] = useState<{ label: string; value: string }[]>([]);
  const [value, setValue] = useState<string>('');
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<ChartData>({
    labels: [],
    datasets: [{ data: [] }]
  });

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [tooltip, setTooltip] = useState<TooltipState>({
    index: -1,
    visible: false,
    x: 0,
    y: 0,
    value: 0,
    label: ''
  });

  enum StatNamesEnum {
    Accel_x = 'X Acceleration',
    Accel_y = 'Y Acceleration',
    Accel_z = 'Z Acceleration',
    Altitude = 'Altitude',
    Bpm = 'Heart Rate (BPM)',
    Gyro_x = 'X Gyroscope',
    Gyro_y = 'Y Gyroscope',
    Gyro_z = 'Z Gyroscope',
    Humidity = 'Humidity',
    Latitude = 'Latitude',
    Longitude = 'Longitude',
    Pressure = 'Pressure',
    Satellites = 'Satellites',
    Steps = 'Step Count',
    Temperature = 'Temperature'
  }

  const fetchStatList = (): void => {
    if (!talus) {
      return;
    }

    fetchStatNames(talus.talusId).then(statNames => {
      const orderedStatNames = statNames.sort((a, b) => a.localeCompare(b));
      setStats(
        orderedStatNames.map(name => ({
          label:
            StatNamesEnum[
              capitalizeFirstLetter(name) as keyof typeof StatNamesEnum
            ] ?? capitalizeFirstLetter(name),
          value: name
        }))
      );
    });
  };

  const formatDate = (timestamp: Date): string => {
    const hours = timestamp.getHours().toString().padStart(2, '0');
    const minutes = timestamp.getMinutes().toString().padStart(2, '0');

    return `${timestamp.getDate()}/${
      timestamp.getMonth() + 1
    }/${timestamp.getFullYear()} ${hours}:${minutes}`;
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

    fetchStatsByNameRange(talus.talusId, statName, startOfDay, endOfDay).then(
      response => {
        const updatedResponse = [];

        if (statName === 'steps') {
          const aggregatedResponse: { timestamp: Date; value: number }[] = [];

          response.forEach(entry => {
            const dateKey = new Date(
              entry.timestamp.getFullYear(),
              entry.timestamp.getMonth(),
              entry.timestamp.getDate()
            );

            const existingIndex = aggregatedResponse.findIndex(
              e => e.timestamp.getTime() === dateKey.getTime()
            );

            if (existingIndex !== -1) {
              aggregatedResponse[existingIndex].value += entry.value;
            } else {
              aggregatedResponse.push({
                timestamp: dateKey,
                value: entry.value
              });
            }
          });

          updatedResponse.push(...aggregatedResponse);
        } else {
          updatedResponse.push(...response);
        }

        const orderedResponse = updatedResponse.sort((a, b) =>
          a.timestamp > b.timestamp ? 1 : -1
        );

        const labels = orderedResponse.map(entry => {
          return formatDate(entry.timestamp);
        });
        setLabels(labels);

        const chartLabels = labels.map((label, index) => {
          if (index === 0 || index === labels.length - 1) {
            return label.split(' ')[0];
          }
          return '';
        });

        const chartData: ChartData = {
          labels: chartLabels,
          datasets: [
            {
              data: orderedResponse.map(entry => entry.value)
            }
          ]
        };

        setTooltip(prev => ({ ...prev, visible: false, index: -1 }));
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
      fetchStats(value, selectedDate, endDate);
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

  const errorMessage = (): string => {
    if (!value || value === '') {
      return 'Please select a stat.';
    }

    if (startDate > endDate) {
      return 'Start date must be before end date.';
    }

    return 'No data available for the selected date range.';
  };

  const setStatValue = (selectedStat: {
    label: string;
    value: string;
  }): void => {
    setValue(selectedStat.value);
    fetchStats(selectedStat.value, startDate, endDate);
  };

  const renderTooltip = (dataPoint: {
    index: number;
    value: number;
    dataset: Dataset;
    x: number;
    y: number;
    getColor: (opacity: number) => string;
  }): void => {
    if (dataPoint.index === tooltip.index && tooltip.visible) {
      setTooltip(prev => ({ ...prev, visible: false, index: -1 }));
    } else {
      setTooltip({
        index: dataPoint.index,
        visible: true,
        x: dataPoint.x,
        y: dataPoint.y,
        value: dataPoint.value,
        label: labels[dataPoint.index]
      });
    }
  };

  useEffect(() => {
    fetchStatList();
  }, [talus]);

  return (
    <Provider>
      <View style={activityHistoryStyles.container}>
        <View style={activityHistoryStyles.dropdown}>
          <Dropdown
            style={dropdownStyles.dropdown}
            placeholderStyle={dropdownStyles.fontStyle}
            selectedTextStyle={dropdownStyles.fontStyle}
            data={stats.map(stat => ({ label: stat.label, value: stat.value }))}
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
              value={startDate}
              mode="date"
              is24Hour
              onChange={changeStartDate}
            />
          </View>
          <View>
            <Text style={activityHistoryStyles.label}>End date</Text>
            <DateTimePicker
              value={endDate}
              mode="date"
              is24Hour
              onChange={changeEndDate}
            />
          </View>
        </View>

        {labels.length > 0 ? (
          <View style={chartStyles.lineChart}>
            <LineChart
              data={data}
              bezier
              width={Dimensions.get('window').width - 50}
              height={220}
              chartConfig={{
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: () => '#007AFF',
                labelColor: () => '#333333',
                strokeWidth: 2,
                decimalPlaces: 0
              }}
              onDataPointClick={renderTooltip}
            />

            {tooltip.visible && (
              <View
                style={{
                  ...chartStyles.tooltip,
                  left: tooltip.x - 20,
                  top: tooltip.y - 35
                }}
              >
                <Text style={chartStyles.tooltipText}>{tooltip.label}</Text>
                <Text style={chartStyles.tooltipText}>
                  {tooltip.value.toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={activityHistoryStyles.errorMessageText}>
            {errorMessage()}
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
  },
  errorMessageText: { textAlign: 'center', color: 'white', fontSize: 20 }
});

const chartStyles = StyleSheet.create({
  lineChart: {
    backgroundColor: 'white',
    paddingTop: 12,
    paddingRight: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  tooltipText: { color: '#fff', fontSize: 12 }
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
