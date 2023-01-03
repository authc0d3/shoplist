import { useRef } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "antd-mobile";
import { firebaseApp } from "../db";

const Login = () => {
  const auth = getAuth(firebaseApp);
  const emailRef = useRef();
  const passRef = useRef();

  function handleLogin(e) {
    e.preventDefault();

    signInWithEmailAndPassword(
      auth,
      emailRef.current?.value,
      passRef.current?.value
    );
  }

  return (
    <div className="loginScreen">
      <h2>🛒 ShopList</h2>
      <form onSubmit={handleLogin} className="loginForm">
        <input
          ref={emailRef}
          type="email"
          required
          placeholder="Dirección de e-mail"
        />
        <input
          ref={passRef}
          type="password"
          required
          placeholder="Contraseña"
        />
        <Button color="success" type="submit">
          Acceder
        </Button>
      </form>
    </div>
  );
};

export default Login;
