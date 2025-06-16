import colors_index from 'colors';
import server_index from './server';

const port = process.env.PORT || 4000;
server_index.listen(port, () => {
    console.log(colors_index.cyan.bold(`REST API funcionando en el puerto ${port}`));
});