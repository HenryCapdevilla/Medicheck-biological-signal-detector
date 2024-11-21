import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../register/Button";
import Character from "../register/Character.jsx";
import "../register/registerPage.css";

function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signin, errors: loginErrors } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const onSubmit = async (data) => {
        signin(data); // Captura el resultado
        const redirectPath = location.state?.from || '/'; // Ruta a donde redirigir después del login
        navigate(redirectPath);
    };

    return (
        <div className="register-container">
            <form 
                className="register-form"
                onSubmit={handleSubmit(onSubmit)}
            >   
                <Character />
                {
                    loginErrors.map((error, i) => (
                        <div className="Error-1" key={i}>
                            {error}
                        </div>
                    ))
                }
                
                {/* Campo para el email */}
                <input 
                    type="email" 
                    {...register("email", { required: true })} 
                    placeholder="Email" 
                />
                {errors.email && <p className="Error">Email is required</p>}

                {/* Campo para la contraseña */}
                <input 
                    type="password" 
                    {...register("password", { required: true })} 
                    placeholder="Password" 
                />
                {errors.password && <p className="Error">Password is required</p>}

                <Button text="Login" />

                <p className="redirect-link">
                    Don't have an account?&nbsp;<Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;
