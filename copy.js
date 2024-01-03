
import menuArray from './menu/menuArray.js';

document.addEventListener('click', e => {
    if (e.target.dataset.add) {
        console.log("ekle", e.target.dataset.add)
        handleAddClick(e.target.dataset.add)
    }
    if (e.target.dataset.reduce) {
        console.log("cikar", e.target.dataset.reduce)
        handleReduceClick(e.target.dataset.reduce)
    }
})

function handleAddClick(mealid){
    const targetMealObj = menuArray.filter(function(meal){
        return meal.id == mealid
    })[0]
    targetMealObj.count ++
    render()
    const hasOrders = menuArray.some(meal => meal.count > 0)
    document.getElementById('orders-section').style.display = hasOrders ? 'block' : 'none';
}

function handleReduceClick(mealid){
    const targetMealObj = menuArray.filter(function(meal){
        return meal.id == mealid
    })[0]

    if (targetMealObj.count > 0){
        targetMealObj.count --
    }
    render()
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
                    <p class="card-price">£ ${price}</p>
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


function render(){
    document.getElementById('container').innerHTML = getMealHtml(menuArray)
}

render()

