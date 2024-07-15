import { LandingPage } from './LandingPage.js'
import { Login } from './Login.js'
import { Register } from './Register.js'
import { Dashboard } from './Dashboard.js'
import { Funds } from './Funds.js';
import { Instruments } from './Instruments.js'
import { UserPositions } from './UserPositions.js'
import { Logout } from './Logout.js';
import { ErrorClass } from './ErrorClass.js'
import jwt_decode from 'jwt-decode';

export const routes = {
    '/' : {
        path : '/',
        view : LandingPage,
        auth : false,
        css  : './css/index.css'
    },
    '/register' : {
        path : '/register',
        view : Register,
        auth : false,
        css  : './css/index.css'
    },
    '/login' : {
        path : '/login',
        view : Login,
        auth : false,
        css  : './css/index.css'
    },
    '/dashboard' : {
        path : '/dashboard',
        view : Dashboard,
        auth : true,
        css  : './css/index.css'
    },
    '/funds' : {
        path : '/funds',
        view : Funds,
        auth : true,
        css  : './css/index.css'
    },
    '/instruments' : {
        path : '/instruments',
        view : Instruments,
        auth : true,
        css  : './css/index.css'
    },
    '/positions' : {
        path : '/positions',
        view : UserPositions,
        auth : true
    },
    '/logout' : {
        path : '/logout',
        view : Logout,
        auth : true
    }
}

/*Use the history API to prevent full page reload*/
export const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};

/* Explanation of the modified regular expression:
( ^ ) -> Match the start of the string.
( ${key.replace(/:[^\s/]+/g, '\\d+').replace(/\//g, '\\/')} ) -> This part constructs the regular expression.
    ( key.replace(/:[^\s/]+/g, '\\d+') ) -> This replaces any dynamic parameters (:id) with \\d+, which means "one or more digits". This ensures that only numerical values are accepted after the slash (/).
    ( replace(/\//g, '\\/') ) ->  This escapes any forward slashes (/) in the key to ensure they are treated as literal characters in the regular expression.
( \\/?$ ) -> Match an optional trailing slash at the end of the string.
( $ ) -> Match the end of the string.
*/

function findMatchingRoute(url) {
    for (const key in routes) {
        const regex = new RegExp(`^${key.replace(/:[^\s/]+/g, '\\d+').replace(/\//g, '\\/')}\\/?$`);
        if (regex.test(url)) {
            return key;
        }
    }
    return null;
}

let previousView = null;
let styleCss = null;

function loadCss(url) {
    return new Promise((resolve, reject) => {
        styleCss = document.createElement('link');
        styleCss.type = 'text/css';
        styleCss.rel = 'stylesheet';
        styleCss.href = url;
        styleCss.onload = resolve;
        styleCss.onerror = reject;
        document.head.appendChild(styleCss);
    });
}


export const router = async () => {
    const appDiv = document.getElementById('app');
   
    /*Window path*/
    const path = window.location.pathname;
    /*Getting correct route*/
    const matchedRoute = findMatchingRoute(path);
    /*Getting view*/
    const viewObject = routes[matchedRoute];

    if (!viewObject) {
        const errorView = new ErrorClass();
        appDiv.innerHTML = await errorView.getHtmlForMainNotFound();
        appDiv.style = 'display: block;';
        return;
    }

    const user_id = localStorage.getItem('userId');

    if (viewObject.auth === true && user_id === null) {
        navigateTo('/');
        return;
    }
    
    const view = new viewObject.view();
 
    if (viewObject.css) {
        await loadCss(viewObject.css);
    }


    if (viewObject.path === '/logout'){
        localStorage.removeItem('userId');
        navigateTo('/');
        return;
    }

    appDiv.innerHTML = await view.getHtmlForMain();
}

// let navbar = new Navbar();

document.addEventListener('DOMContentLoaded', () => {
    router();
    document.getElementById('nav-bar').addEventListener('click', (event) => {
        if (event.target.tagName === 'A' && event.target.classList.contains('navbar-link'))
        {
            event.preventDefault();
            console.log(event.target);
            navigateTo(event.target);
        }
    }); 
});
