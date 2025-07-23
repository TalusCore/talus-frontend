import { login } from '@/api/userApi';
import styles from '@/components/styles';
import { capitalizeFirstLetter } from '@/components/utils';
import { AuthContext } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import { Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

import { StyleSheet } from 'react-native';

const Login = (): React.JSX.Element => {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (): Promise<void> => {
    let hasError = false;

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
      const loginData = await login(email, password);

      if (loginData.success) {
        signIn({
          firstName: loginData.firstName!,
          lastName: loginData.lastName!,
          email: loginData.email!
        });
        router.replace('/home');
      } else {
        const errorMsg = capitalizeFirstLetter(loginData.error!);
        setErrorMessage(errorMsg);
      }
    }
  };

  return (
    <View style={loginStyles.container}>
      <View style={loginStyles.centeredFullWidth}>
        <Text style={styles.text}>Please sign in to continue.</Text>
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
          icon="login"
          onPress={handleLogin}
          style={{ marginTop: 20 }}
        >
          Sign In
        </Button>
      </View>
      <View style={loginStyles.centeredFullWidth}>
        <Text style={styles.text}>Don't have an account?</Text>
        <Button
          mode="contained"
          icon="account-plus"
          onPress={() => {
            router.push('/signup');
          }}
          style={{ marginTop: 10 }}
        >
          Sign Up Here
        </Button>
      </View>
    </View>
  );
};

const loginStyles = StyleSheet.create({
  container: { ...styles.container, justifyContent: 'space-evenly' },
  centeredFullWidth: {
    width: '100%',
    alignItems: 'center'
  }
});

export default Login;
