export class BaseClass {
    constructor() {
        if (this.constructor === BaseClass) {
            throw new Error("Cannot instantiate abstract class.");
        }
        this.httpProtocol = process.env.PROTOCOL;
        this.host = process.env.HOST_IN_USE;
        this.backendPort = process.env.BACKEND_PORT;
        this.frontendPort = process.env.FRONTEND_PORT;
    }

    getHtmlForMain() {
        throw new Error("Method 'getHtmlForMain()' must be implemented.");
    }

    addDocumentClickListener() {
        this.handleDocumentClickBound = this.handleDocumentClick.bind(this);
        document.getElementById('app').addEventListener('click', this.handleDocumentClickBound);
    }

    removeDocumentClickListener() {
        document.getElementById('app').removeEventListener('click', this.handleDocumentClickBound);
    }

    async handleDocumentClick(event) {
        return;
    }

    cleanup() {
        this.removeDocumentClickListener();
    }

    setNavBarNotAuthenticated(){
        const navbar = document.getElementById('nav-bar');
        navbar.innerHTML = `<a class="navbar-link" href="/register">Sign up</a>
                            <a class="navbar-link" href="/login">Log in</a>`;
    }

    setNavBarAuthenticated(){
        const navbar = document.getElementById('nav-bar');
        navbar.innerHTML = `<a class="navbar-link" href="/positions">My positions</a>
                            <a class="navbar-link" href="/funds">Funds</a>
                            <a class="navbar-link" href="/dashboard">Dashboard</a>
                            <a class="navbar-link" href="/instruments">Instruments</a>
                            <a class="navbar-link" href="/logout">Log out</a>`;
    }
}