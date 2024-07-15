import { BaseClass } from './BaseClass';
import { router } from './Router';


export class Login extends BaseClass {
    constructor() {
        super();
        this.addDocumentClickListener();
    }

    async handleDocumentClick(event) {
        if (event.target.id === 'loginButton') {
            await this.handleButtonClick(event);
        }
    }

    async handleButtonClick(event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${this.httpProtocol}://${this.host}:${this.backendPort}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('userId', result['userId']);
                history.pushState({}, '', '/dashboard');
                router();
            } else {
                this.displayMessage("Invalid Credentials", false);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    hideMessage(id) {
        const alertElement = document.getElementById("redWarning");
        if (!alertElement)
            return;
        alertElement.textContent = '';
        alertElement.style.display = 'none';
    }

    displayMessage(message, flag) {
        const id = (flag) ? ".alert-success" : ".alert-danger";
        const alertElement = document.getElementById("redWarning");
        alertElement.textContent = message;
        alertElement.style.display = 'block';
        setTimeout(() => {
            this.hideMessage(id);
        }, 1500);
    }

    async getHtmlForMain() {
        console.log(this.httpProtocol)
        this.setNavBarNotAuthenticated();
        return `<h1 class="text-center mb-3">Login</h1>
                <div class="form-group">
                    <form id="loginForm" class="text-start">
                        <div class="row my-3 justify-content-center">
                            <div class="col-xl-4 col-lg-6 col-md-8">
                                <label for="username">Username:</label>
                                <input class="form-control form-control-sm" type="text" id="username" name="username" required autocomplete="username">
                            </div>        
                        </div>
                        <div class="row my-3 justify-content-center">
                            <div class="col-xl-4 col-lg-6 col-md-8">
                                <label for="password">Password:</label>
                                <input class="form-control form-control-sm" type="password" id="password" name="password" required autocomplete="current-password">
                            </div>        
                        </div>
                        <div class="row m-3 text-center justify-content-center">
                            <div class="col-xl-4 col-lg-6 col-md-8">
                                <button type="submit" id="loginButton" class="p-1 btn btn-dark">Log in</button>
                                <div id="redWarning" class="my-2 alert alert-danger" role="alert" style="display :none;"></div>
                            </div>        
                        </div>            
                    </form>
                </div>`;
    }
}