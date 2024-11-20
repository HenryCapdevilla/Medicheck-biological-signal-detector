import { useForm } from "react-hook-form";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Character from './Character';

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
        const { confirmPassword, ...userData } = values;
        signup(userData);
    };

    const password = watch("password");

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Form className="p-4 shadow rounded bg-light shadow-lg" onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: "500px", width: "100%" }}>
                <Character />
                {registerErrors.map((error, i) => (
                    <div className="text-danger" key={i}>{error}</div>
                ))}

                {section === 1 && (
                    <div>
                        <Form.Group controlId="firstName">
                            <Form.Control
                                type="text"
                                {...register("firstName", { required: true })}
                                placeholder="Primer Nombre"
                                isInvalid={errors.firstName}
                            />
                            <Form.Control.Feedback type="invalid">Primer nombre es requerido</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="secondName">
                            <Form.Control
                                type="text"
                                {...register("secondName")}
                                placeholder="Segundo Nombre"
                            />
                        </Form.Group>

                        <Form.Group controlId="firstSurname">
                            <Form.Control
                                type="text"
                                {...register("firstSurname", { required: true })}
                                placeholder="Primer Apellido"
                                isInvalid={errors.firstSurname}
                            />
                            <Form.Control.Feedback type="invalid">Primer apellido es requerido</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="secondSurname">
                            <Form.Control
                                type="text"
                                {...register("secondSurname")}
                                placeholder="Segundo Apellido"
                            />
                        </Form.Group>

                        <Form.Group controlId="birthDate">
                            <Form.Control
                                type="date"
                                {...register("birthDate", { required: true })}
                                max={new Date().toISOString().split("T")[0]}
                                isInvalid={errors.birthDate}
                            />
                            <Form.Control.Feedback type="invalid">Fecha de nacimiento es requerida</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="gender">
                            <Form.Control as="select" {...register("gender", { required: true })} isInvalid={errors.gender}>
                                <option value="">Seleccionar Sexo</option>
                                <option value="male">Masculino</option>
                                <option value="female">Femenino</option>
                                <option value="other">Otro</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">Sexo es requerido</Form.Control.Feedback>
                        </Form.Group>
                    </div>
                )}

                {section === 2 && (
                    <div>
                        <Form.Group controlId="username">
                            <Form.Control
                                type="text"
                                {...register("username", { required: true })}
                                placeholder="Username"
                                isInvalid={errors.username}
                            />
                            <Form.Control.Feedback type="invalid">Username es requerido</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="email">
                            <Form.Control
                                type="email"
                                {...register("email", { required: true })}
                                placeholder="Email"
                                isInvalid={errors.email}
                            />
                            <Form.Control.Feedback type="invalid">Email es requerido</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                {...register("password", { required: true })}
                                placeholder="Password"
                                isInvalid={errors.password}
                            />
                            <Button variant="link" onClick={() => setShowPassword(!showPassword)} className="position-absolute" style={{ right: 10, top: 5 }}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </Button>
                            <Form.Control.Feedback type="invalid">Password es requerido</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="confirmPassword">
                            <Form.Control
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirmPassword", {
                                    required: true,
                                    validate: (value) => value === password || "Passwords do not match",
                                })}
                                placeholder="Confirm Password"
                                isInvalid={errors.confirmPassword}
                            />
                            <Button variant="link" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="position-absolute" style={{ right: 10, top: 5 }}>
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </Button>
                            <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="nip">
                            <Form.Control
                                type="text"
                                {...register("nip", { required: true })}
                                placeholder="Cédula Colombiana / NIP"
                                isInvalid={errors.nip}
                            />
                            <Form.Control.Feedback type="invalid">Cédula es requerida</Form.Control.Feedback>
                        </Form.Group>
                    </div>
                )}

                <div className="d-flex justify-content-between">
                    {section > 1 && (
                        <Button variant="secondary" onClick={() => setSection(section - 1)}>Anterior</Button>
                    )}
                    {section < 2 && (
                        <Button variant="primary" onClick={() => setSection(section + 1)}>Siguiente</Button>
                    )}
                    {section === 2 && (
                        <Button variant="success" type="submit" className="w-100">Registrar</Button>
                    )}
                </div>

                <p className="text-center mt-3">
                    ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
                </p>
            </Form>
        </Container>
    );
}

export default RegisterPage;
