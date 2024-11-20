import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../register/Button";
import Character from "../register/Character.jsx";

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
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <form 
                className="bg-light shadow-lg rounded p-4 w-100 w-md-50"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Character />
                {loginErrors.map((error, i) => (
                    <div className="alert alert-danger" role="alert" key={i}>
                        {error}
                    </div>
                ))}
                
                <div className="mb-3">
                    <input 
                        type="email" 
                        className="form-control" 
                        {...register("email", { required: true })} 
                        placeholder="Email" 
                    />
                    {errors.email && <p className="text-danger">Email is required</p>}
                </div>

                <div className="mb-3">
                    <input 
                        type="password" 
                        className="form-control" 
                        {...register("password", { required: true })} 
                        placeholder="Password" 
                    />
                    {errors.password && <p className="text-danger">Password is required</p>}
                </div>

                <Button text="Login" className="btn btn-primary w-100 mb-3" />

                <p className="text-center">
                    Don't have an account?&nbsp;
                    <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;
