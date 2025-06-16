import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { loginUser } from "../../api/AuthAPI";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import type { LoginFormData } from "../../types";

export default function LoginView() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

    const { mutate } = useMutation({
        mutationFn: loginUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success("Inicio de sesión exitoso");
            navigate('/');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    const handleLogin = (formData: LoginFormData) => mutate(formData);

    return (
        <>
          <Card>
              <CardHeader>
                  <CardTitle className="text-center">Iniciar Sesión</CardTitle>
                  <CardDescription className="text-center">Ingresa tu email y contraseña para acceder a tus proyectos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <form onSubmit={handleSubmit(handleLogin)} className="space-y-4" noValidate>
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" placeholder="correo@ejemplo.com" {...register("email", { required: "El email es obligatorio", pattern: { value: /\S+@\S+\.\S+/, message: "E-mail no válido" } })}/>
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input id="password" type="password" {...register("password", { required: "La contraseña es obligatoria" })}/>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>
                    <Button type="submit" className="w-full">Acceder</Button>
                  </form>
              </CardContent>
          </Card>
          <nav className="mt-4 text-center">
              <Link to={'/auth/register'} className="text-slate-300 hover:text-white">
                  ¿No tienes cuenta? Regístrate
              </Link>
          </nav>
        </>
    );
}