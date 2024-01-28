
let homeData;
function openSideNav(){
    $('nav').animate({left:"0px"},500)
    $('.openCloseNav').removeClass("fa-align-justify");
        $('.openCloseNav').addClass("fa-x");

        for (let i = 0; i < 5; i++) {
            $(".side-nav-links ul li").eq(i).animate({
                top: 0
            }, (i + 5) * 100)
        }
}

function closeSideNav() {
    let WidthOfNav = $(".left-side").outerWidth(true)
    $("nav").animate({
        left: -WidthOfNav
    }, 500)

    $(".openCloseNav").addClass("fa-align-justify");
    $(".openCloseNav").removeClass("fa-x");


    $(".side-nav-links ul li").animate({
        top: 300
    }, 500)
}

$(".openCloseNav").click(() => {
    if ($("nav").css("left") == "0px") {
        closeSideNav()
    } else {
        openSideNav()
    }
})

function showSearchInputs(){
    document.getElementById('searchInputs').innerHTML=`

        <div class="col-md-6 py-5">
            <input onkeyup="getSearchMealsByName(this.value)" type="search" class="form-control bg-black text-white" placeholder="Search By Name">
        </div>

        <div class="col-md-6 py-5">
            <input onkeyup="getSearchMealsByFirstName(this.value)" type="search" maxlength="1" class="form-control bg-black text-white" placeholder="Search By First Letter">
        </div>
    `
    document.getElementById('home').innerHTML=""
}

async function getHomeMeals(){
    let response=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`)
    let finailResponse=await response.json();
    homeData=finailResponse.meals;
    console.log(homeData)
    displayHomeMeals()
}
getHomeMeals()
function displayHomeMeals(){
    let cartona=''

    for(let i=0;i<homeData.length;i++){
        cartona+=`
            <div class="col-md-3">
                <div  onclick='getMealsDetails(${homeData[i].idMeal})' class="meal-img position-relative rounded-2">
                    <img src="${homeData[i].strMealThumb}" class="img-fluid" alt="">
                    <div class="img-layer position-absolute d-flex align-items-center justify-content-center">
                        <h3 class="">${homeData[i].strMeal}</h3>
                    </div>
                </div>
            </div>
        `
    }

    document.getElementById('home').innerHTML=cartona

}

async function getMealsDetails(mealId){
    let response=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    let finalResponse=await response.json();
    displayMealsDetails(finalResponse.meals[0])
    $('.closeDetails').click(function(){
        getHomeMeals()
    })
}
function displayMealsDetails(arr){

    let recipesDetails='';

    for(let i=1;i<=20;i++){
        
        if(arr[`strIngredient${i}`]){

            recipesDetails+=`
                            <li class="alert alert-info m-2 p-1">
                                ${arr[`strMeasure${i}`]} ${arr[`strIngredient${i}`]}
                            </li>
                            `
        }
    }

    

    let tags = arr.strTags?.split(",")
    
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }

    let mealDetails=`
                        <i class="fa-solid fa-x fa-2x closeDetails text-white"></i>
                        <div class="col-md-4 text-white">
                            
                            <img src="${arr.strMealThumb}" class="w-100">
                            <h2>${arr.strMeal}</h2>
                        </div>

                        <div class="col-md-8 text-white">

                            <h2>Instructions</h2>
                            <p>${arr.strInstructions}</p>
                            <h3><span class="fw-bolder">Area:</span>${arr.strArea}</h3>
                            <h3><span class="fw-bolder">Category:</span>${arr.strCategory}</h3>
                            <h3>Recipes:</h3>
                            <ul class="list-unstyled d-flex flex-wrap">
                                ${recipesDetails}
                            </ul>

                            <h3>Tags:</h3>
                            <ul class="list-unstyled d-flex flex-wrap">
                                ${tagsStr}
                            </ul>

                            <a target="_blank" href="${arr.strSource}" class="btn btn-success">Source</a>
                            <a target="_blank" href="${arr.strYoutube}" class="btn btn-danger">Youtube</a>

                        </div>

    `;

    document.getElementById('home').innerHTML=mealDetails;
    document.getElementById('searchInputs').innerHTML=''

}


async function getSearchMealsByName(meal){
    let response=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`)
    let finailResponse=await response.json();
    
    //console.log(finailResponse.meals)
    displaySearchResulet(finailResponse.meals)
}


async function getSearchMealsByFirstName(letter){
    let response=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${letter}`)
    let finailResponse=await response.json();
    displaySearchResulet(finailResponse.meals)
} 

function displaySearchResulet (arr) { 
    let cartona=''

    for(let i=0;i<arr.length;i++){
        cartona+=`
            <div class="col-md-3">
                <div  onclick='getMealsDetails(${arr[i].idMeal})' class="meal-img position-relative rounded-2">
                    <img src="${arr[i].strMealThumb}" class="img-fluid" alt="">
                    <div class="img-layer position-absolute d-flex align-items-center justify-content-center">
                        <h3 class="">${arr[i].strMeal}</h3>
                    </div>
                </div>
            </div>
        `
    }

    document.getElementById('home').innerHTML=cartona
}


async function getCategoriesMeals(){
    let response=await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    let finailResponse=await response.json();

    displayAllCategories(finailResponse.categories)

}

function displayAllCategories(arr){
    let data=""
    for(let i=0;i<arr.length;i++){
        data+=`

                <div class="col-md-3">
                    <div  onclick="filterByCategory('${arr[i].strCategory}')" class="meal-img position-relative rounded-2">
                        <img src="${arr[i].strCategoryThumb}" class="img-fluid" alt="">
                        <div class="img-layer position-absolute text-center">
                            <h3 class="">${arr[i].strCategory}</h3>
                            <p>${arr[i].strCategoryDescription.slice(0,200)}</p>
                        </div>
                    </div>
                </div>
        
        `
    }
    document.getElementById('home').innerHTML=data
}

async function filterByCategory(category){
    let response=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    let finailResponse=await response.json();

    displaySearchResulet(finailResponse.meals)

}

async function getAllArea(){
    let response=await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    let finailResponse=await response.json();
    displayAllArea(finailResponse.meals)
}

function displayAllArea(arr){
    let Area='';
    for(let i=0;i<arr.length;i++){
        Area+=`
                <div class="col-md-3">
                    <div onclick="getFilterByArea('${arr[i].strArea}')" class="pointer text-white text-center">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                    </div>
                </div>
        
        `
    }

    document.getElementById('home').innerHTML=Area
}

async function getFilterByArea(area){
    let response=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    let finailResponse=await response.json();
    displaySearchResulet(finailResponse.meals)
}


async function getAllIngredients(){
    let responce=await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    let finalResponce=await responce.json();

    console.log(finalResponce)

    displayAllIngredients(finalResponce.meals)
}

function displayAllIngredients(arr){
    let ingre='';
    for(let i=0;i<20;i++){
        ingre+=`
                <div class="col-md-3">
                    <div onclick="getFilterByIngredients('${arr[i].strIngredient}')" class="pointer text-white text-center">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.substr(0,200)}</p>
                    </div>
                </div>
        
        `
    }

    document.getElementById('home').innerHTML=ingre
}


async function getFilterByIngredients(ingre){
    let responce=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingre}`)
    let finailResponse=await responce.json();
    displaySearchResulet(finailResponse.meals)
}



function showContactUs(){
    let contact=document.getElementById('mainHome');
    contact.innerHTML=`

        <div class="contactUs min-vh-100 d-flex justify-content-center align-items-center ">
            <div class="container">
                <div class="row py-5 g-4">
                    <div class="col-md-6">
                        <input onkeyup="valid()" class="form-control" type="text" name="" id="name" placeholder="Enter Your Name">
                        <div class="d-none my-2 py-3 rounded rounded-2 name bg-danger"><h6>Please enter a valid name First letter capital (4-20 characters)</h6></div>
                    </div>
                    <div class="col-md-6">
                        <input onkeyup="valid()" class="form-control" type="text" name="" id="email" placeholder="Enter Your Email">
                        <div class="d-none my-2 py-3 rounded rounded-2 email bg-danger"><h6>Please enter a valid email address(email@example.com)</h6></div>
                    </div>
                    <div class="col-md-6">
                        <input onkeyup="valid()" class="form-control" type="tel" name="" id="phone" placeholder="Enter Your Phone">
                        <div class="d-none my-2 py-3 rounded rounded-2 phone bg-danger"><h6>please Enter avalid Email(01********)</h6></div>
                    </div>
                    <div class="col-md-6">
                        <input onkeyup="valid()" class="form-control" type="number" name="" id="age" placeholder="Enter Your Age">
                        <div class="d-none my-2 py-3 rounded rounded-2 age bg-danger"><h6>please enter age between 1-100</h6></div>
                    </div>
                    <div class="col-md-6">
                        <input onkeyup="valid()" class="form-control" type="text" name="" id="password" placeholder="Enter Your Password">
                        <div class="d-none my-2 py-3 rounded rounded-2 password bg-danger"><h6>Please enter a valid password (8-20 characters)</h6></div>
                    </div>
                    <div class="col-md-6">
                        <input onkeyup="valid()" class="form-control" type="text" name="" id="repassword" placeholder="Repassword">
                        <div class="d-none my-2 py-3 rounded rounded-2 repassword bg-danger"><h6>Passwords do not match</h6></div>
                    </div>
                    <button id="btns" class="btn btn-outline-danger w-25 disabled mx-auto">Submit</button>
                </div>
                
            </div>
        </div>
    
    `
    // let nameInput=document.getElementById('name');
    // let emailInput=document.getElementById('email');
    // let phoneInput=document.getElementById('phone');
    // let ageInput=document.getElementById('age');
    // let passwordInput=document.getElementById('password');
    // let repasswordInput=document.getElementById('repassword');
}




let nameRegx=/^[A-Z][a-z]{4,20}$/;
let emailRegx=/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/;
let phoneRegx=/^01[0125][0-9]{8}$/;
let ageRegx=/^[1-9][0-9]{0,1}$|100/
let passwordRgex=/\w{8,20}/



// function valid(){
    
//     if(validName()){
//         $('#name').removeClass("is-invalid")
//         $('#name').addClass("is-valid")
//         $('.name').addClass('d-none')
//     }
//     else{
//         $('#name').addClass("is-invalid")
//         $('.name').removeClass('d-none')
//     }
// }

// function validtwo(){
//     if(validEmail()){
//         $('#email').removeClass("is-invalid")
//         $('#email').addClass("is-valid")
//         $('.email').addClass('d-none')
//     }
//     else{
//         $('#email').addClass("is-invalid")
//         $('.email').removeClass('d-none')
//     }
// }

// function validthree(){
//     if(validPhone){
//         $('#phone').removeClass("is-invalid")
//         $('#phone').addClass("is-valid")
//         $('.phone').addClass('d-none')
//     }
//     else{
//         $('#phone').addClass("is-invalid")
//         $('.phone').removeClass('d-none')
//     }
// }


function valid(){
    if(validName()&&validEmail()&&validPhone()&&validAge()&&validPassword()&&validRepass()){
        document.getElementById('btns').removeAttribute('disabled')
    }
    
}


function validName(){
    let nameInput=document.getElementById('name').value;
    return(nameRegx.test(nameInput));
}

function validEmail(){
    let emailInput=document.getElementById('email').value;
    return(emailRegx.test(emailInput));
}

function validPhone(){
    let phoneInput=document.getElementById('phone').value;
    return(phoneRegx.test(phoneInput));
}

function validAge(){
    let ageInput=document.getElementById('age').value;
    return(ageRegx.test(ageInput));
}
function validPassword(){
    let passwordInput=document.getElementById('password').value;
    return(passwordRgex.test(passwordInput));
}

function validRepass(){
    let repasswordInput=document.getElementById('repassword').value;
    let passwordInput=document.getElementById('password').value;
    return repasswordInput==passwordInput;
}



