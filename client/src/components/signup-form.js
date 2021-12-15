/** @jsx jsx */
import {
  jsx,
  Box,
  Label,
  Input,
  Button,
  Heading,
} from 'theme-ui';
import { rgba } from 'polished';
import dotPattern from 'assets/images/dot-pattern.png';
import { useState } from 'react'

const SignupForm = () => {
  const [view, setView] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    let headersList = {
      "Accept": "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.io)",
      "Content-Type": "application/json"
    }   
    fetch("https://cryptolytical.herokuapp.com/api/signup", { 
      method: "POST",
      body: `{\n    \"username\": \"${username}\",\n    \"email\": \"${email}\"\n}`,
      headers: headersList
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log(data);
    });
    setUsername('');
    setEmail('');
    setTimeout(() => {setView(!view)}, 1500);
    setTimeout(() => {setView(false)}, 6500);
  };

  return (
    <Box sx={styles.formWrapper}>
      <Heading sx={styles.title}>Get ready to use Cryptolytical!</Heading>
      <Box as="form" sx={styles.form} onSubmit={handleSubmit}>
        <Box sx={styles.inputFields}>
          <Label variant="styles.srOnly">
            Username
          </Label>
          <Input
            type='text'
            placeholder="Username"
            sx={styles.input}
            onChange = {(e) => setUsername(e.target.value)}
            value = {username}
          />
        </Box>
        <Box sx={styles.inputFields}>
          <Label variant="styles.srOnly">
            Email
          </Label>
          <Input
            type='email'
            placeholder="Email"
            sx={styles.input}
            onChange = {(e) => setEmail(e.target.value)}
            value = {email}
          />
        </Box>
        {view &&
          <Box sx={styles.inputFields}>
            <Input
              placeholder="Mail Sent! Check Spam."
              sx={styles.inputSuc}
            />
          </Box>
        }
        <Box sx={styles.buttonGroup}>
          <Button variant="primary" sx={styles.submit}>
            Signup Now
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SignupForm;

const styles = {
  input: {
    backgroundColor: '#cccaca'
  },
  inputSuc: {
    backgroundColor: '#45b649 !important',
  },
  formWrapper: {
    borderRadius: 10,
    backgroundColor: '#EAEAEA',
    boxShadow: '0px 24px 50px rgba(54, 91, 125, 0.05)',
    p: ['26px', null, null, '35px 40px 50px'],
    position: 'relative',
    '::before, ::after': {
      background: `url(${dotPattern}) no-repeat right top`,
      content: [null, null, null, null, null, `''`],
      position: 'absolute',
      width: 302,
      height: 347,
      zIndex: -1,
    },
    '::before': {
      left: '-60px',
      bottom: 15,
    },
    '::after': {
      right: '-41px',
      top: '-30px',
    },
  },
  title: {
    color: 'textSecondary',
    fontWeight: 'bold',
    fontSize: [6, null, null, 12, 8, 11],
    lineHeight: 1.4,
    letterSpacing: 'heading',
    mb: [4, null, null, 5],
    textAlign: ['center', null, null, null, 'left'],
  },
  form: {
    label: {
      alignItems: 'center',
      cursor: 'pointer',
      fontWeight: 400,
    },
  },
  inputFields: {
    mb: [3, null, null, 4],
    input: {
      minHeight: [45, null, null, 60, 50, 60],
      '::placeholder': {
        color: rgba('#000', 0.5),
      },
    },
  },
  buttonGroup: {
    mt: [5, null, null, 8],
    span: {
      display: 'flex',
      justifyContent: 'center',
      color: rgba('#000', 0.4),
      fontWeight: 'bold',
      fontSize: 1,
      lineHeight: 2.87,
    },
    button: {
      minHeight: [45, null, null, 60, 50, 60],
      width: '100%',
    },
  },
  submit: {
    backgroundColor: '#000'
  },
};