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
    const { signup, isAuthenticated, errors: registerErrors = [] } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [section, setSection] = useState(1);

    useEffect(() => {
        if (isAuthenticated) navigate("/");
    }, [isAuthenticated, navigate]);

    const onSubmit = async (values) => {
        // Crear una copia de values sin el campo confirmPassword
        const { confirmPassword, ...userData } = values;
        // Llamar a signup con los datos que se enviarán al backend
        signup(userData);
    };

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

          {section === 1 && (
            <div className="section">
              <input
                type="text"
                {...register("firstName", { required: true })}
                placeholder="Primer Nombre"
              />
              {errors.firstName && (
                <p className="Error">Primer nombre es requerido</p>
              )}

              <input
                type="text"
                {...register("secondName")}
                placeholder="Segundo Nombre"
              />

              <input
                type="text"
                {...register("firstSurname", { required: true })}
                placeholder="Primer Apellido"
              />
              {errors.firstSurname && (
                <p className="Error">Primer apellido es requerido</p>
              )}

              <input
                type="text"
                {...register("secondSurname")}
                placeholder="Segundo Apellido"
              />

              <input
                type="date"
                {...register("birthDate", { required: true })}
                max={new Date().toISOString().split("T")[0]}
                placeholder="Fecha de Nacimiento"
              />
              {errors.birthDate && (
                <p className="Error">Fecha de nacimiento es requerida</p>
              )}

              <select {...register("gender", { required: true })}>
                <option value="">Seleccionar Sexo</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
              </select>
              {errors.gender && <p className="Error">Sexo es requerido</p>}
            </div>
          )}

          {section === 2 && (
            <div className="section">
              <input
                type="text"
                {...register("username", { required: true })}
                placeholder="Username"
              />
              {errors.username && (
                <p className="Error">Username es requerido</p>
              )}

              <input
                type="email"
                {...register("email", { required: true })}
                placeholder="Email"
              />
              {errors.email && <p className="Error">Email es requerido</p>}

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
              {errors.password && (
                <p className="Error">Password es requerido</p>
              )}

              <div className="password-field">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: true,
                    validate: (value) =>
                      value === password || "Passwords do not match",
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
              {errors.confirmPassword && (
                <p className="Error">{errors.confirmPassword.message}</p>
              )}

              <input
                type="text"
                {...register("nip", { required: true })}
                placeholder="Cédula Colombiana / NIP"
              />
              {errors.nip && <p className="Error">Cédula es requerida</p>}
            </div>
          )}

          <div className="button-container">
            {section > 1 && (
              <button type="button" onClick={() => setSection(section - 1)}>
                Anterior
              </button>
            )}
            {section < 2 && (
              <button type="button" onClick={() => setSection(section + 1)}>
                Siguiente
              </button>
            )}
            {section === 2 && <Button text="Registrar" />}
          </div>

          <p className="redirect-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    );
}

export default RegisterPage;
