import { Router as MainRouter_Index } from 'express';
import authRouter_Index from './authRouter';
import boardRouter_Index from './boardRouter'; // Importa el router de tableros

const mainRouter_Index_App = MainRouter_Index();

mainRouter_Index_App.use('/auth', authRouter_Index);
mainRouter_Index_App.use('/boards', boardRouter_Index); // Registra el router en la ruta /api/boards

export default mainRouter_Index_App;