import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { loginUser, registerUser } from '../api/user';

export default function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (type) => {
    try {
      const data =
        type === 'register'
          ? await registerUser(username, email)
          : await loginUser(username);

      setUser(data);
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: '1rem' }}>Network Reliability Visualizer</h2>
        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div style={styles.buttonRow}>
          <button style={styles.button} onClick={() => handleSubmit('login')}>Login</button>
          <button style={styles.button} onClick={() => handleSubmit('register')}>Register</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  card: {
    backgroundColor: '#2c2c2c',
    padding: '2rem',
    borderRadius: '10px',
    textAlign: 'center',
    color: 'white',
    boxShadow: '0 0 20px rgba(0,0,0,0.4)',
    width: '320px',
  },
  input: {
    width: '100%',
    padding: '0.6rem',
    marginBottom: '1rem',
    borderRadius: '5px',
    border: '1px solid #444',
    backgroundColor: '#3a3a3a',
    color: 'white',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
