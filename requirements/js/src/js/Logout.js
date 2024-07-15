import { BaseClass } from './BaseClass';

export class Logout extends BaseClass{
    constructor() {
        super();
    }
    
    getHtmlForMain() {
        return `<h1>BYE</h1><br>
        You've been successfully logged out.<br>
                SEE U AROUND`
    }
}