import { fetchStatNames, fetchStatsByNameRange } from '@/api/statApi';
import {
  activityHistoryStyles,
  chartStyles,
  dropdownStyles
} from '@/components/activityHistory/styles';
import {
  StatNamesEnum,
  type TooltipState
} from '@/components/activityHistory/types';
import { errorMessage, formatDate } from '@/components/activityHistory/utils';
import { capitalizeFirstLetter } from '@/components/utils';
import { AuthContext } from '@/contexts/AuthContext';
import DateTimePicker, {
  type DateTimePickerEvent
} from '@react-native-community/datetimepicker';
import { useContext, useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import type {
  ChartData,
  Dataset
} from 'react-native-chart-kit/dist/HelperTypes';
import { Dropdown } from 'react-native-element-dropdown';
import { Provider, Text } from 'react-native-paper';

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
            {errorMessage(value, startDate, endDate)}
          </Text>
        )}
      </View>
    </Provider>
  );
};

export default ActivityHistory;
