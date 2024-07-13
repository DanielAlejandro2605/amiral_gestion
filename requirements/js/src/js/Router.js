import { LandingPage } from './LandingPage.js'
import { Login } from './Login.js'
import { Register } from './Register.js'
import { Profile } from './Profile.js'
import { Settings } from './Settings.js'
import { Dashboard } from './Dashboard.js';
import { Logout } from './Logout.js';
import { ErrorClass } from './ErrorClass.js'
import Navbar from './Navbar.js';
import jwt_decode from 'jwt-decode';

export const routes = {
    '/' : {
        path : '/',
        view : LandingPage,
        auth : false
    },
    '/dashboard' : {
        path : '/dashboard',
        view : Dashboard,
        css : './css/dashboard.css',
        auth : true
    },
    '/login' : {
        path : '/login',
        view : Login,
        auth : false,
        css : './css/login.css'
    },
    '/register' : {
        path : '/register',
        view : Register,
        auth : false
    },
    '/profile' : {
        path : '/profile',
        view : Profile,
        auth : true,
        css : './css/profile.css'
    },
    '/settings' : {
        path : '/settings',
        view : Settings,
        auth : true,
        css : './css/settings.css'
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

export const router = async () => {
    const appDiv = document.getElementById('app');
    appDiv.style = 'display: none;';

    const path = window.location.pathname;
    const matchedRoute = findMatchingRoute(path);
    const viewObject = routes[matchedRoute];

    let id = null;

    if (previousView && typeof previousView.cleanup === 'function') {
        previousView.cleanup();
    }

    if (styleCss) {
        styleCss.remove();
        styleCss = null;
    }

    const token = localStorage.getItem('token');
    const auth = await checkAuthentication();
    if (auth)
        await connectUser();

    if (!viewObject) {
        const errorView = new ErrorClass();
        navbar.setIsAuthenticated(auth);
        document.getElementById('nav-bar').innerHTML = navbar.getHtml();
        appDiv.innerHTML = await errorView.getHtmlForMainNotFound();
        appDiv.style = 'display: block;';
        return;
    }

    if (viewObject.auth === true && (!token || auth === false)) {
        navigateTo("/");
        return;
    } else if (viewObject.auth === false && (token && auth === true)) {
        navigateTo("/dashboard");
        return;
    }

    if (viewObject.dinamic == true)
    {
        id = path.split('/')[2];
    }
    
    const view = new viewObject.view(id);
    previousView = view;

    if (viewObject.css) {
        await loadCss(viewObject.css);
    }

    appDiv.innerHTML = await view.getHtmlForMain();
    (viewObject.path === '/logout') ? navbar.setIsAuthenticated(false) : navbar.setIsAuthenticated(auth);
    document.getElementById('nav-bar').innerHTML = navbar.getHtml();
    appDiv.style = 'display: block;';
}

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

async function checkAuthentication() {
    //console.log("checking authentication (Router.js)");
    const httpProtocol = process.env.PROTOCOL;

    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw false;
        }

        let decodedToken;
        try {
            decodedToken = jwt_decode(token);
        } catch (decodeError) {
            console.error('Error decoding token:', decodeError.message);
            throw false;
        }

        const response = await fetch(`${httpProtocol}://${process.env.HOST_IN_USE}:${process.env.BACKEND_PORT}/users/check-authentication/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            // console.error('Error checking authentication:', response.statusText);
            throw false;
        }

        const data = await response.json();

        if ('authenticated' in data) {
            return data.authenticated;
        } else {
            // console.error('Invalid response format:', data);
            throw false;
        }
    } catch (error) {
        // console.error('Unexpected error checking authentication:', error);
        return false;
    }
}

let navbar = new Navbar();

document.addEventListener('DOMContentLoaded', () => {
    //console.log("DOM content loaded (Router.js)");
    router();
    // document.getElementById('nav-bar').innerHTML = navbar.getHtml();
    document.getElementById("bellButton").addEventListener("click", function() {
        var bellCountSpan = document.getElementById("bellCount");
        bellCountSpan.textContent = "";
    });
    document.getElementById('nav-bar').addEventListener('click', (event) => {
        if (event.target.tagName === 'A' && event.target.classList.contains('navbar-link')) {
            //console.log('LISTENER (Router.js) navbar button clicked: ', event.target);
            event.preventDefault();
            navigateTo(event.target);
        }
    }); 
});
