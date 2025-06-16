import { Link, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUser } from '../api/AuthAPI';
import { Button } from '../components/ui/button';
import { Toaster, toast } from 'sonner';
import { ModeToggle } from '../components/theme/theme-toggle'; // <- Importa el componente

export default function AppLayout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const { data, isLoading, isError } = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        retry: false,
        refetchOnWindowFocus: false,
    });

    const logoutMutation = useMutation({
        mutationFn: () => {
            localStorage.removeItem('AUTH_TOKEN');
            return Promise.resolve();
        },
        onSuccess: () => {
            queryClient.clear();
            navigate('/auth/login');
            toast.success("Sesión cerrada correctamente");
        }
    });
    
    const handleLogout = () => {
        logoutMutation.mutate();
    };

    if (isLoading) return 'Cargando...';
    if (isError) return <Navigate to='/auth/login' />;

    if (data) return (
        <>
            {/* CAMBIO: Usamos 'dark:bg-gray-950' para un fondo más oscuro en modo dark */}
            <div className="min-h-screen bg-slate-100 dark:bg-gray-950">
                {/* CAMBIO: Añadimos bordes y sombras sutiles */}
                <header className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                        <Link to={'/'} className="text-2xl font-black text-slate-900 dark:text-white">
                            Kanvas<span className="text-fuchsia-500">.</span>
                        </Link>
                        <div className='flex gap-4 items-center'>
                            <p className="text-sm text-slate-600 dark:text-slate-300 hidden sm:block">
                                Hola: <span className="font-semibold">{data.name}</span>
                            </p>
                            <ModeToggle /> {/* <- Añade el botón aquí */}
                            <Button variant="outline" onClick={handleLogout}>
                                Cerrar Sesión
                            </Button>
                        </div>
                    </div>
                </header>
                <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
            <Toaster position="top-right" />
        </>
    );
}