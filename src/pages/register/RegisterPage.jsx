import { useForm } from "react-hook-form";
import './registerPage.css';
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup, isAuthenticated, errors: registerErrors } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate("/");
    }, [isAuthenticated, navigate]);

    const onSubmit = async (values) => {
        signup(values);
    };

    return (
        <div className="register-container">
            <form
                className="register-form"
                onSubmit={handleSubmit(onSubmit)}
            >
                {
                    registerErrors.map((error, i) => (
                        <div className="Error-1" key={i}>
                            {error}
                        </div>
                    ))
                }
                <input type="text" {...register("username", { required: true })} placeholder="Username" />
                {
                    errors.username && (
                        <p className="Error">
                            Username is required
                        </p>
                    )
                }
                <input type="email" {...register("email", { required: true })} placeholder="Email" />
                {
                    errors.email && (
                        <p className="Error">
                            Email is required
                        </p>
                    )
                }
                <input type="password" {...register("password", { required: true })} placeholder="Password" />
                {
                    errors.password && (
                        <p className="Error">
                            Password is required
                        </p>
                    )
                }

                {/* Nuevo campo de selección para el rol */}
                <select {...register("role", { required: true })} defaultValue="">
                    <option value="" disabled>Select Role</option>
                    <option value="medico">Médico</option>
                    <option value="paciente">Paciente</option>
                </select>
                {
                    errors.role && (
                        <p className="Error">
                            Role is required
                        </p>
                    )
                }

                <button type="submit">Register</button>

                <p className="redirect-link">
                    Already have an account?&nbsp;<Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default RegisterPage;

