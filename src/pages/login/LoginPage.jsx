import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
    const { register, handleSubmit, formState: {errors}} = useForm();
    const { signin, errors: loginErrors } = useAuth();
    const navigate = useNavigate(); // Inicializa el hook de navegación

    const onSubmit = async (data) => {
        const success = await signin(data); // Captura el resultado
        if (success) { // Redirige solo si el inicio de sesión fue exitoso
            navigate("/"); // Redirige a la página de inicio
        }
    };

    return (
        <div className="register-container">
            <form 
                className="register-form"
                onSubmit={handleSubmit(onSubmit)}
            >   
                {
                    loginErrors.map((error, i) => (
                        <div className="Error-1" key={i}>
                            {error}
                        </div>
                    ))
                }
                <input type="email" {...register("email", { required: true })} placeholder="Email" />
                {errors.email && <p className="Error">Email is required</p>}

                <input type="password" {...register("password", { required: true })} placeholder="Password" />
                {errors.password && <p className="Error">Password is required</p>}

                <button type="submit">Login</button>

                <p className="redirect-link">
                    Don't have an account?&nbsp;<Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;
