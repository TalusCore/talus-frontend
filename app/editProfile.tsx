import { editUser } from '@/api/userApi';
import styles, { BACKGROUND_COLOR } from '@/components/styles';
import { capitalizeFirstLetter } from '@/components/utils';
import { AuthContext } from '@/contexts/AuthContext';
import DateTimePicker, {
  type DateTimePickerEvent
} from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Button, TextInput } from 'react-native-paper';

const EditProfile = (): React.JSX.Element => {
  const { user, updateUser } = useContext(AuthContext);
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [gender, setGender] = useState(user?.gender ?? '');
  const [birthday, setBirthday] = useState(
    new Date(user?.birthday ?? new Date())
  );
  const [height, setHeight] = useState(user?.height.toString() ?? '');
  const [weight, setWeight] = useState(user?.weight.toString() ?? '');
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [birthdayError, setBirthdayError] = useState(false);
  const [heightError, setHeightError] = useState(false);
  const [weightError, setWeightError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const changeBirthday = (
    _: DateTimePickerEvent,
    selectedDate?: Date
  ): void => {
    if (!selectedDate) {
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pickedDate = new Date(selectedDate);
    pickedDate.setHours(0, 0, 0, 0);

    setBirthdayError(pickedDate >= today);
    setBirthday(pickedDate);
  };

  const changeHeight = (text: string): void => {
    const numericText = text.replace(/[^0-9.]/g, '');
    setHeight(numericText);
  };

  const changeWeight = (text: string): void => {
    const numericText = text.replace(/[^0-9.]/g, '');
    setWeight(numericText);
  };

  const handleEdit = async (): Promise<void> => {
    let hasError = false;

    if (!firstName.trim()) {
      setFirstNameError(true);
      hasError = true;
    } else {
      setFirstNameError(false);
    }

    if (!lastName.trim()) {
      setLastNameError(true);
      hasError = true;
    } else {
      setLastNameError(false);
    }

    if (!gender.trim()) {
      setGenderError(true);
      hasError = true;
    } else {
      setGenderError(false);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pickedDate = new Date(birthday);
    pickedDate.setHours(0, 0, 0, 0);

    if (pickedDate > today) {
      setBirthdayError(true);
      hasError = true;
    } else {
      setBirthdayError(false);
    }

    if (!height.trim() || isNaN(Number(height)) || Number(height) <= 0) {
      setHeightError(true);
      hasError = true;
    } else {
      setHeightError(false);
    }

    if (!weight.trim() || isNaN(Number(weight)) || Number(weight) <= 0) {
      setWeightError(true);
      hasError = true;
    } else {
      setWeightError(false);
    }

    if (!hasError && user?.email != null) {
      const editData = await editUser(
        firstName,
        lastName,
        user.email,
        gender,
        birthday,
        Number(height),
        Number(weight)
      );

      if (editData.success) {
        updateUser({
          firstName: editData.firstName!,
          lastName: editData.lastName!,
          email: editData.email!,
          gender: editData.gender!,
          birthday: editData.birthday!,
          height: editData.height!,
          weight: editData.weight!
        });
        router.dismissAll();
        router.replace('/home');
      } else {
        const errorMsg = capitalizeFirstLetter(editData.error!);
        setErrorMessage(errorMsg);
      }
    }
  };

  return (
    <View style={editStyles.container}>
      <Text style={styles.text}>Edit your profile and save changes.</Text>
      <View style={{ width: '100%', marginTop: 10, height: '75%' }}>
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          style={{ width: '100%' }}
          contentContainerStyle={{
            alignItems: 'center'
          }}
        >
          <TextInput
            label="First Name"
            mode="flat"
            style={styles.textInput}
            autoCapitalize="words"
            placeholder="Enter your first name"
            autoComplete="given-name"
            value={firstName}
            onChangeText={setFirstName}
            error={firstNameError}
          />
          <TextInput
            label="Last Name"
            mode="flat"
            style={styles.textInput}
            autoCapitalize="words"
            placeholder="Enter your last name"
            autoComplete="family-name"
            value={lastName}
            onChangeText={setLastName}
            error={lastNameError}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '80%',
              marginTop: 20,
              justifyContent: 'space-between',
              borderBottomColor: genderError ? '#FFBBBB' : 'grey',
              borderBottomWidth: genderError ? 2 : 1,
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: '#48454E'
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: genderError ? '#FFBBBB' : '#C9C6CF'
              }}
            >
              Gender
            </Text>
            <Dropdown
              style={{
                height: 40,
                width: '40%',
                borderColor: 'grey',
                borderWidth: 1,
                borderRadius: 30,
                paddingHorizontal: 8
              }}
              placeholderStyle={{ color: 'white', fontSize: 16 }}
              selectedTextStyle={{ color: 'white', fontSize: 16 }}
              data={[
                { label: 'Male', value: 'M' },
                { label: 'Female', value: 'F' },
                { label: 'Other', value: 'Other' }
              ]}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={gender}
              onChange={item => setGender(item.value)}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '80%',
              marginTop: 20,
              justifyContent: 'space-between',
              borderBottomColor: birthdayError ? '#FFBBBB' : 'grey',
              borderBottomWidth: birthdayError ? 2 : 1,
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: '#48454E'
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: birthdayError ? '#FFBBBB' : '#C9C6CF'
              }}
            >
              Birthday
            </Text>
            <DateTimePicker
              value={birthday}
              mode="date"
              is24Hour
              onChange={changeBirthday}
              style={styles.datePicker}
            />
          </View>
          <TextInput
            label="Height (cm)"
            mode="flat"
            style={styles.textInput}
            placeholder="Enter your height in cm"
            value={height}
            onChangeText={changeHeight}
            error={heightError}
            keyboardType="numbers-and-punctuation"
          />
          <TextInput
            label="Weight (kg)"
            mode="flat"
            style={styles.textInput}
            placeholder="Enter your weight in kg"
            value={weight}
            onChangeText={changeWeight}
            error={weightError}
            keyboardType="numbers-and-punctuation"
          />
        </ScrollView>
      </View>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button
        mode="contained"
        icon="account-plus"
        onPress={handleEdit}
        style={{ marginTop: 20 }}
      >
        Save Changes
      </Button>
    </View>
  );
};

const editStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 25,
    justifyContent: 'flex-start',
    backgroundColor: BACKGROUND_COLOR
  }
});

export default EditProfile;
