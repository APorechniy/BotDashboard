/// <reference types="vite/client" />

// Типизация SCSS Modules
declare module '*.module.scss' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

// Типизация стандартных CSS Modules на случай их использования
declare module '*.module.css' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

// Типизация статических ассетов
declare module '*.svg' {
    import React = require('react');
    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
}

declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.jpg' {
    const content: string;
    export default content;
}

// Расширение стандартных событий Window для поддержки кастомного ивента сессии
declare global {
    interface WindowEventMap {
        'auth:unauthorized': CustomEvent<void> | Event;
    }
}

export { };