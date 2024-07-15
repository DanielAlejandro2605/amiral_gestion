import { BaseClass } from './BaseClass'

export class Funds extends BaseClass {
    constructor() {
        super();
        this.addDocumentClickListener();
    }

    formatNumber(value) {
        if (value >= 1.0e+12) {
            return (value / 1.0e+12).toFixed(2) + "T";
        } else if (value >= 1.0e+9) {
            return (value / 1.0e+9).toFixed(2) + "B";
        } else if (value >= 1.0e+6) {
            return (value / 1.0e+6).toFixed(2) + "M";
        } else if (value >= 1.0e+3) {
            return (value / 1.0e+3).toFixed(2) + "K";
        } else {
            return value.toFixed(2);
        }
    }

    async fetchFunds(){
        try {
            const response = await fetch(`${this.httpProtocol}://${this.host}:${this.backendPort}/api/get_all_funds`, {
                method: 'GET'
            });

            const result = await response.json();

            if (response.ok) {
                return result;
            } else {
                throw Error("Failed to fetch funds data");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }


    async getHtmlForMain() {
        this.setNavBarAuthenticated();
        
        let funds = await this.fetchFunds();

        let html_string_funds = '';

        funds.forEach(fund => {
            html_string_funds += `
                <article class="postcard dark blue">
                    <div class="postcard__text">
                        <h1 class="postcard__title blue">${fund.name}</h1>
                        <div class="postcard__subtitle small">
                            <i class="fas fa-calendar-alt mr-2"></i>${fund.creation_date}
                        </div>
                        <div class="postcard__preview-txt">${fund.description}</div>
                    </div>
                    <ul class="postcard__tagbox">
                        <li class="tag__item"><i class="fas fa-tag mr-2"></i>$${this.formatNumber(fund.assets_under_management)}</li>
                        <li class="tag__item"><i class="fas fa-clock mr-2"></i>${fund.fund_type}</li>
                    </ul>
                </article>
            `;
        });
        return `<div id="dashboard" class="container" style="max-height: 500px; overflow-y: auto;">
                    <h1 class="text-center mb-3">Funds</h1>
                    <div>${html_string_funds}</div>
                </div>`;
    };
}
