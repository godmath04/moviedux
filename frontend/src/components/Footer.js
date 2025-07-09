import React from 'react';
import '../styles.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className='footer'>
            <p className='footer-text'>Desarrollado por Luis Pineda &copy; {currentYear}</p>
            <p className='footer'>Todos los derechos reservados</p>
        </footer>
    );
}