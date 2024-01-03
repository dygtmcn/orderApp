
import menuArray from './menu/menuArray.js';

document.addEventListener('click', e => {
    if (e.target.dataset.add) {
        handleAddClick(e.target.dataset.add)
    }
    if (e.target.dataset.reduce) {
        handleReduceClick(e.target.dataset.reduce)
    }
    if(e.target.id === 'purchase-btn'){
        handlePurchaseBtnClick()
    }
    if(e.target.id === "modal-close-btn"){
        closeModal("")
    }
    if(e.target.id === "modal-btn"){
        e.preventDefault()
        closeModal("isSubmitted")

    }
})

let selectedItems = []
const ordersSection = document.getElementById('orders-section')


function handleAddClick(mealid) {
    const targetMealObj = menuArray.find(meal => meal.id == mealid)
    if (targetMealObj) {
        targetMealObj.count++
        render()
        const hasOrders = menuArray.some(meal => meal.count > 0)
        
        ordersSection.style.visibility = hasOrders ? 'visible' : 'hidden'

        // Find the index of the selected item in selectedItems
        const selectedIndex = selectedItems.findIndex(item => item.name === targetMealObj.name)
        console.log(selectedIndex)
        // If the selected item exists, update its count; otherwise, add a new entry
        if (selectedIndex !== -1) {
            selectedItems[selectedIndex].count++
            selectedItems[selectedIndex].price = selectedItems[selectedIndex].count * targetMealObj.price
        } else {
            selectedItems.push({
                name: targetMealObj.name,
                price: targetMealObj.price,
                count: 1
            })
        }

        // Update the content of the selected-items element
        const selectedItemsElement = document.getElementById('selected-items');
        selectedItemsElement.innerHTML = getSelectedItemsHtml(selectedItems);

        const totalPriceElement = document.getElementById('total-price');
        const totalPrice = calculateTotalPrice(selectedItems);
        totalPriceElement.innerHTML = `<p>Total Price: </p><p>£${totalPrice.toFixed(2)}</p>`
    }
}



function handleReduceClick(mealid) {
    const targetMealObj = menuArray.find(meal => meal.id == mealid);

    if (targetMealObj && targetMealObj.count > 0) {
        targetMealObj.count--;
        render();

        // Find the index of the selected item in selectedItems
        const selectedIndex = selectedItems.findIndex(item => item.name === targetMealObj.name);

        // If the selected item exists, update its count
        if (selectedIndex !== -1) {
            selectedItems[selectedIndex].count--;
            selectedItems[selectedIndex].price = selectedItems[selectedIndex].count * targetMealObj.price
            // If count is 0, remove the item from selectedItems
            if (selectedItems[selectedIndex].count === 0) {
                selectedItems.splice(selectedIndex, 1);
            }
        }

        // Update the content of the selected-items element
        const selectedItemsElement = document.getElementById('selected-items');
        selectedItemsElement.innerHTML = getSelectedItemsHtml(selectedItems);

        // Calculate and display the total price
        const totalPriceElement = document.getElementById('total-price');
        const totalPrice = calculateTotalPrice(selectedItems);
        totalPriceElement.innerHTML = `<p>Total Price: </p><p>£${totalPrice.toFixed(2)}</p>`
       

        // Check if all counts are 0, and hide the orders section if true
        const allCountsZero = menuArray.every(meal => meal.count === 0);
        ordersSection.style.visibility = allCountsZero ? 'hidden' : 'visible';
    }
}


function getSelectedItemsHtml(items) {
    return items.map(item => {
        return `
        <div class='selected-items'>
            <p class="item-name">${item.name}</p>
            <p class="item-price">£${item.price}</p>
        </div>`
    }).join("");
}

function calculateTotalPrice(items) {
    return items.reduce((total, item) => {
        return total + item.price
    }, 0);
}

function getMealHtml(meals) {

    return meals.map(meal => {
        const {
            name,
            ingredients,
            price,
            emoji,
            id,
            count
        } = meal;

        return `
        <div class = "card">
                <div class="card-emoji">
                    ${emoji}
                </div>
                <div class="card-mid">
                    <h4 class="card-name">${name}</h4>
                    <p class="card-ingredients">${ingredients}</p>
                    <p class="card-price">£${price}</p>
                </div>
                <div class="card-end">
                    <div>
                        <button class="countbtn" data-add="${id}">➕</button>
                        <button class="countbtn" data-reduce="${id}">➖</button>
                    </div>
                    <p class="card-price">${count}</p>
                </div>
        </div>`
    }).join("")
}

function handlePurchaseBtnClick(){
    const modalEl = document.getElementById('modal')
    modalEl.style.display = "inline"
    console.log("handlePurchaseBtnClick")
}

function closeModal(param) {
    console.log("closeModal")
    const modalEl = document.getElementById('modal');

    modalEl.style.display = "none";
    if (param="isSubmitted"){
        const consentForm = document.getElementById('consent-form')
        const consentFormData = new FormData(consentForm)
        const fullName = consentFormData.get('fullName')
        ordersSection.innerHTML = `<div class="summary-purchase">
        Thank you ${fullName}, your order is on its way!
        </div>`

        const buttonsArr = document.getElementsByClassName("countbtn")
        
        Array.from(buttonsArr).forEach(button => {
            button.disabled = true;
        })
    }
}

function render() {
    document.getElementById('menu-el').innerHTML = getMealHtml(menuArray)
}

render()

