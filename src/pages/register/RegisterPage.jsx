import { useForm } from "react-hook-form";
import './registerPage.css';
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Character from './Character';
import Button from './Button';

function RegisterPage() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { signup, isAuthenticated, errors: registerErrors } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (isAuthenticated) navigate("/");
    }, [isAuthenticated, navigate]);

    const onSubmit = async (values) => {
        console.log(values)
        signup(values);
    };

    // Observar el valor de la contraseña para compararla con el campo de confirmación
    const password = watch("password");

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
                <Character />
                {registerErrors.map((error, i) => (
                    <div className="Error-1" key={i}>
                        {error}
                    </div>
                ))}
                
                <input type="text" {...register("username", { required: true })} placeholder="Username" />
                {errors.username && <p className="Error">Username is required</p>}

                <input type="email" {...register("email", { required: true })} placeholder="Email" />
                {errors.email && <p className="Error">Email is required</p>}

                <div className="password-field">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        {...register("password", { required: true })} 
                        placeholder="Password" 
                    />
                    <button 
                        type="button" 
                        className="toggle-password-visibility" 
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </button>
                </div>
                {errors.password && <p className="Error">Password is required</p>}

                {/* Campo de confirmación de contraseña */}
                <div className="password-field">
                    <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        {...register("confirmPassword", { 
                            required: true,
                            validate: (value) => value === password || "Passwords do not match" 
                        })} 
                        placeholder="Confirm Password" 
                    />
                    <button 
                        type="button" 
                        className="toggle-password-visibility" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </button>
                </div>
                {errors.confirmPassword && <p className="Error">{errors.confirmPassword.message}</p>}

                <input 
                    type="text" 
                    {...register("nip", { required: true })} 
                    placeholder="Cédula Colombiana / NIP" 
                />
                {errors.nip && <p className="Error">Cédula is required</p>}

                <Button text="Register" />


                <p className="redirect-link">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default RegisterPage;
