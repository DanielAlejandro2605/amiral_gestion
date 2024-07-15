import { BaseClass } from './BaseClass'

export class Instruments extends BaseClass {
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

    async fetchInstruments(){
        try {
            const response = await fetch(`${this.httpProtocol}://${this.host}:${this.backendPort}/api/get_all_instruments`, {
                method: 'GET'
            });

            const result = await response.json();

            if (response.ok) {
                return result;
            } else {
                throw Error("Failed to fetch instruments data");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }


    async getHtmlForMain() {
        this.setNavBarAuthenticated();
        let instruments = await this.fetchInstruments();
        
        let html_string_instruments = '';
    
        instruments.forEach(instrument => {
            html_string_instruments += `
                <article class="postcard dark blue">
                    <div class="postcard__text">
                        <h1 class="postcard__title blue postcard__margin">${instrument.ticker}</h1>
                    </div>
                    <ul class="postcard__tagbox postcard__tagbox--instruments">
                        <li class="tag__item tag__item--sector">${instrument.sector}</li>
                        <li class="tag__item tag__item--industry">${instrument.industry}</li>
                        <li class="tag__item tag__item--market-cap">${this.formatNumber(instrument.market_cap)}</li>
                        <li class="tag__item tag__item--dividend-yield">${instrument.dividend_yield}</li>
                        <li class="tag__item tag__item--currency">${instrument.currency}</li>
                        <li class="tag__item tag__item--website"><a target=”_blank”  href=${instrument.website}>${instrument.website}</a></li>
                    </ul>
                </article>
            `;
        });
        return `<div id="dashboard" class="container style="max-height: 500px; overflow-y: auto;">
                    <h1 class="text-center mb-3">Instruments</h1>
                    <ul class="legend-list">
                        <li class="legend-item legend-item--sector">Sector</li>
                        <li class="legend-item legend-item--industry">Industry</li>
                        <li class="legend-item legend-item--market-cap">Market Cap</li>
                        <li class="legend-item legend-item--dividend-yield">Dividend Yield</li>
                        <li class="legend-item legend-item--currency">Currency</li>
                        <li class="legend-item legend-item--website">Website</li>
                    </ul>
                    <div>${html_string_instruments}</div>
                </div>`;
    }    
}
