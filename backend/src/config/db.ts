import mongoose_db from 'mongoose';
import colors_db from 'colors';

export const connectDB = async () => {
    try {
        const { connection } = await mongoose_db.connect(process.env.MONGO_URI!);
        const url = `${connection.host}:${connection.port}`;
        console.log(colors_db.magenta.bold(`MongoDB Conectado en: ${url}`));
    } catch (error) {
        console.log(colors_db.bgRed.white.bold(`Error al conectar a MongoDB`));
        if (error instanceof Error) {
            console.error(error.message);
        }
        process.exit(1);
    }
}