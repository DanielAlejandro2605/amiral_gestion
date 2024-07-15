import { navigateTo, router } from './Router'
import { BaseClass } from './BaseClass'

export class Dashboard extends BaseClass {
    constructor() {
        super();
        this.addDocumentClickListener();
    }

    async handleDocumentClick(event) {
        if (event.target.id === 'positionButton') {
            await this.handleButtonClick(event);
        }
    }

    hideMessage() {
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

    async handleButtonClick(event) {
        event.preventDefault();
        
        const fund = document.getElementById("fundSelect").value;
        const instrument = document.getElementById("instrumentSelect").value;
        const positionQuantity = parseFloat(document.getElementById("position-quantity").value);
        const purchasePrice = parseFloat(document.getElementById("position-purchasePrice").value);
        const userId = localStorage.getItem('userId');

        if ((positionQuantity <= 0 || purchasePrice <= 0) || (isNaN(positionQuantity) || isNaN(purchasePrice))) {
            this.displayMessage("Both quantity and purchase price must be positive numbers", false);
            return;
        }
    
        try {
            const response = await fetch(`${this.httpProtocol}://${this.host}:${this.backendPort}/api/create_position`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id : userId,
                    fund_id: fund,
                    instrument_id: instrument,
                    position_quantity : positionQuantity,
                    purchase_price : purchasePrice
                }),
            });

            const result = await response.json();

            if (response.ok) {
                this.displayMessage("Position created succesfully", true)
            } else {
                throw Error("Failed to create position")
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    populateSelect(selectId, items, displayProperty) {
        const selectElement = document.getElementById(selectId);
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item[displayProperty];
            selectElement.appendChild(option);
        });
    }

    async getFormPositions() {
        try {
            const response = await fetch(`${this.httpProtocol}://${this.host}:${this.backendPort}/api/get_funds_instruments`, {
                method: 'GET'
            });

            const result = await response.json();

            if (response.ok) {
                this.populateSelect('fundSelect', result.funds, 'name');
                this.populateSelect('instrumentSelect', result.instruments, 'ticker');
            } else {
                throw new Error("Failed to fetch instruments data");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async getHtmlForMain() {
        this.setNavBarAuthenticated();

        const positionDiv = document.createElement('div');
        
        positionDiv.setAttribute('id', 'position-div');
        
        positionDiv.innerHTML = `
            <h1 class="text-center mb-3">Welcome to this amazing app!</h1>
            <div class="form-group col-xl-14">
                <form id="transactionForm" class="text-start">
                    <h2 class="text-center">Get position</h2>
                    <div class="row my-3 justify-content-center">
                        <div class="col-xl-4 col-lg-6 col-md-8">
                           <label for="fundSelect">Select fund:</label>
                            <select id="fundSelect" name="fund">
                            <option value="" disabled selected>Fund</option>
                            </select>
                        </div>        
                    </div>

                    <div class="row my-3 justify-content-center">
                        <div class="col-xl-4 col-lg-6 col-md-8">
                            <label for="instrumentSelect">Select instrument:</label><br>
                            <select id="instrumentSelect" name="instrument">
                            <option value="" disabled selected>Instrument</option>
                            </select>
                        </div>        
                    </div>

                    <div class="row my-3 justify-content-center">
                        <div class="col-xl-4 col-lg-6 col-md-8">
                           <label for="quantity">Quantity:</label>
                            <input type="number" id="position-quantity" name="quantity" required>
                        </div>        
                    </div>

                    <div class="row my-3 justify-content-center">
                        <div class="col-xl-4 col-lg-6 col-md-8">
                           <label for="purchasePrice">Purchase price:</label>
                            <input type="number" id="position-purchasePrice" name="purchasePrice" required>
                        </div>        
                    </div>
                    <div class="row m-3 text-center justify-content-center">
                        <div class="col-xl-4 col-lg-6 col-md-8">
                            <button id="positionButton" type="submit" class="p-1 btn btn-dark">Send</button>
                            <div id="redWarning" class="my-2 alert alert-danger" role="alert" style="display :none;"></div>      
                        </div>
                </form>
            <div>
        `;

        const appDiv = document.getElementById('app');

        appDiv.appendChild(positionDiv);

        // Fetch and populate form positions
        await this.getFormPositions();

        return positionDiv.innerHTML;
    }
}
