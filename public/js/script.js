'use strict';

const addIngedientsBtn = document.getElementById("addIngedientsBtn");
let ingredientList = document.querySelector('.ingredientList');
let ingredientsDiv = document.querySelectorAll('.ingredientsDiv')[0];

addIngedientsBtn.addEventListener('click', function(){
    let newIngredient = ingredientsDiv.cloneNode(true);
    let input = newIngredient.getElementsByTagName('input')[0];
    input.value= "";
    ingredientList.appendChild(newIngredient);
});