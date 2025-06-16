import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { registerUser } from "../../api/AuthAPI";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
// Define RegisterFormData type locally if not exported from "../../types"
type RegisterFormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function RegisterView() {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<RegisterFormData>();
    
    const { mutate } = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            toast.success(data);
            reset();
            navigate('/auth/login');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    const password = watch('password');
    const handleRegister = (formData: RegisterFormData) => mutate(formData);

    return (
      <>
        <Card>
            <CardHeader>
                <CardTitle className="text-center" >Crear una Cuenta</CardTitle>
                <CardDescription className="text-center" >Completa el formulario para empezar a gestionar tus proyectos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit(handleRegister)} className="space-y-4" noValidate>
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" type="text" placeholder="Tu Nombre" {...register("name", { required: "El nombre es obligatorio" })}/>
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" placeholder="correo@ejemplo.com" {...register("email", { required: "El email es obligatorio", pattern: { value: /\S+@\S+\.\S+/, message: "E-mail no válido" } })}/>
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input id="password" type="password" {...register("password", { required: "La contraseña es obligatoria", minLength: { value: 8, message: "La contraseña debe tener al menos 8 caracteres" } })}/>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">Repetir Contraseña</Label>
                        <Input id="password_confirmation" type="password" {...register("password_confirmation", { required: "Debes repetir la contraseña", validate: value => value === password || 'Las contraseñas no coinciden' })}/>
                        {errors.password_confirmation && <p className="text-red-500 text-sm">{errors.password_confirmation.message}</p>}
                    </div>
                    <Button type="submit" className="w-full">Crear Cuenta</Button>
                </form>
            </CardContent>
        </Card>
        <nav className="mt-4 text-center">
            <Link to={'/auth/login'} className="text-slate-300 hover:text-white">
                ¿Ya tienes cuenta? Inicia Sesión
            </Link>
        </nav>
      </>
    );
}