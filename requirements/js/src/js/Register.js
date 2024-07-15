import { BaseClass } from './BaseClass';
import { router } from './Router';

export class Register extends BaseClass
{
    constructor() {
        super();
        this.addDocumentClickListener();
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

    async handleDocumentClick(event) {
        if (event.target.id === 'register') {
            await this.handleButtonClick(event);
        }
    }

    async handleButtonClick(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${this.httpProtocol}://${this.host}:${this.backendPort}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                history.pushState({}, '', '/login');
                router();
            } else {
                this.displayMessage("Invalid credentials", false);
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            console.error('Error : ', error);
        }
    }

    async getHtmlForMain() {
        this.setNavBarNotAuthenticated();
        return `<h1 class="text-center mb-3">Sign-up</h1>
                <div class="form-group">
                    <form id="loginForm" class="text-start">
                        <div class="row my-3 justify-content-center">
                            <div class="col-xl-4 col-lg-6 col-md-8">
                                <label for="email">E-mail:</label>
                                <input class="form-control form-control-sm" type="email" id="email" name="email" required placeholder="Enter e-mail">
                            </div>
                        </div>
                        <div class="row my-3 justify-content-center">
                            <div class="col-xl-4 col-lg-6 col-md-8">
                                <label for="password">Password:</label>
                                <input class="form-control form-control-sm" type="password" id="password" name="password" required placeholder="Password" autocomplete="current-password">
                            </div>
                        </div>
                        <div class="row m-2 text-center justify-content-center">
                            <div class="col-lg-6 col-md-8">
                                <button type="submit" id="register" class="p-1 btn btn-dark">Sign-up</button>
                                <div id="redWarning" class="my-2 alert alert-danger" role="alert" style="display :none;"></div>
                            </div>
                        </div>
                    </form>
                </div>`;
    }
}