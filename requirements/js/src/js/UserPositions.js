import { BaseClass } from './BaseClass'

export class UserPositions extends BaseClass {
    constructor() {
        super();
        this.addDocumentClickListener();
    }

    async fetchUserPositions() {
        const userId = localStorage.getItem('userId');
    
        try {
            const response = await fetch(`${this.httpProtocol}://${this.host}:${this.backendPort}/api/get_positions?user_id=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            const result = await response.json();
    
            if (response.ok) {
                return result;
            } else {
                throw Error("Failed to fetch positions from user");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }


    async getHtmlForMain() {
        this.setNavBarAuthenticated();
    
        let positions = await this.fetchUserPositions();
    
        console.log(positions);
    
        let html_string_positions = '';
    
        positions.forEach(position => {
            html_string_positions += `
                <div class="card position-card mb-4">
                    <div class="card-header">
                        ${position.fund_name}
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${position.instrument_ticker}</h5>
                        <p class="card-text">Quantity: ${position.quantity}</p>
                        <p class="card-text">Purchase Price: ${position.purchase_price}</p>
                    </div>
                    <div class="card-footer text-muted">
                        Purchase Date: ${position.purchase_date}
                    </div>
                </div>
            `;
        });
    
        return `<div id="dashboard" class="container" style="max-height: 500px; overflow-y: auto;">
                    <h1 class="text-center mb-3">Positions</h1>
                    <div>${html_string_positions}</div>
                </div>`;
    };    
}
