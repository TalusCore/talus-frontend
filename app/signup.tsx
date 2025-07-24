import { signup } from '@/api/userApi';
import styles, { BACKGROUND_COLOR } from '@/components/styles';
import { capitalizeFirstLetter } from '@/components/utils';
import { AuthContext } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

const SignUp = (): React.JSX.Element => {
  const { signIn } = useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = async (): Promise<void> => {
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

    if (!email.trim()) {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }

    if (!password.trim()) {
      setPasswordError(true);
      hasError = true;
    } else {
      setPasswordError(false);
    }

    if (!hasError) {
      const signUpData = await signup(firstName, lastName, email, password);

      if (signUpData.success) {
        signIn({
          firstName: signUpData.firstName!,
          lastName: signUpData.lastName!,
          email: signUpData.email!
        });
        router.dismissAll();
        router.replace('/home');
      } else {
        const errorMsg = capitalizeFirstLetter(signUpData.error!);
        setErrorMessage(errorMsg);
      }
    }
  };

  return (
    <View style={signUpStyles.container}>
      <Text style={styles.text}>Please sign up to continue.</Text>
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
      <TextInput
        label="Email"
        mode="flat"
        style={styles.textInput}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        error={emailError}
      />
      <TextInput
        label="Password"
        mode="flat"
        style={styles.textInput}
        secureTextEntry
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        error={passwordError}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button
        mode="contained"
        icon="account-plus"
        onPress={handleSignUp}
        style={{ marginTop: 20 }}
      >
        Sign Up
      </Button>
    </View>
  );
};

const signUpStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    justifyContent: 'flex-start',
    backgroundColor: BACKGROUND_COLOR
  }
});

export default SignUp;
