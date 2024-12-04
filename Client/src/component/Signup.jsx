function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleSignup = async () => {
        try {
            await axios.post('/signup', { email, password, username });
            alert('Signup successful');
        } catch (error) {
            console.error(error.response.data.message);
        }
    };

    return (
        <div>
            <h1>Signup</h1>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSignup}>Signup</button>
        </div>
    );
}
export default Signup;
