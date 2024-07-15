import { BaseClass } from './BaseClass';

export class LandingPage extends BaseClass
{
    constructor() {
        super();
    }

    getHtmlForMain() {
        this.setNavBarNotAuthenticated();
        return `<h1 class="text-center">Test technique chez Amiral Gestion</h1>`
    }
}