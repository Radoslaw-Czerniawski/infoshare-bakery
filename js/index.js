const buttonMakeCookieBall = document.querySelector(".button-cookie-ball");
const buttonLoading = document.querySelector(".button-loading__progress");
const buttonBake1Cookie = document.querySelector(".bake-1-cookie");
const buttonBakeAllCookies = document.querySelector(".bake-all-cookies");
const buttonBuyFlour = document.querySelector(".buy-flour");
const buttonsText = document.querySelector(".button-text");
const flourAmount = document.querySelector(".flour-amount");
const cookieBallsAmount = document.querySelector(".balls-amount");
const rawCookiesAmount = document.querySelector(".rawCookies-amount");
const bakedCookiesAmount = document.querySelector(".bakedCookies-amount");
const earningsAmount = document.querySelector(".earnings-amount");
const ovenSlots = document.querySelectorAll(".baking-cookie-slot");
const cookieBalls = document.querySelector(".cookie-balls");

const ingredientsStock = {
    flour: 100,
    rawCookieBalls: [],
    ovenCookies: [
        {isCookieInOven: false, isPerfect: false, timeSpentInOven:0,},
        {isCookieInOven: false, isPerfect: false, timeSpentInOven:0,},
        {isCookieInOven: false, isPerfect: false, timeSpentInOven:0,},
        {isCookieInOven: false, isPerfect: false, timeSpentInOven:0,},
        {isCookieInOven: false, isPerfect: false, timeSpentInOven:0,},
        {isCookieInOven: false, isPerfect: false, timeSpentInOven:0,},
        {isCookieInOven: false, isPerfect: false, timeSpentInOven:0,},
        {isCookieInOven: false, isPerfect: false, timeSpentInOven:0,},
        {isCookieInOven: false, isPerfect: false, timeSpentInOven:0,},
    ],
    cookieBakedLvlColors: ["rgb(241, 206, 50)", "sienna" ,"black"],
    rawCookies: 0,
    bakedCookies: 0,
};

let cookieBallProgress = 0;
let cookieBallsCounter = 0;
let currentOvenSlot = 0;
let earnedMoney = 0;
let isMaking = false;
let timeSinceStartOfMakingCookieBall;
let timeSinceStartOfBaking;
let lastBuy = Date.now();
let nextBuy = lastBuy + 3000;

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


const updateIngredientsAmount = () => {
    cookieBallsAmount.textContent = `${cookieBallsCounter}`;
    flourAmount.textContent = `${ingredientsStock.flour}`;
    rawCookiesAmount.textContent = `${ingredientsStock.rawCookies}`;
    bakedCookiesAmount.textContent = `${ingredientsStock.bakedCookies}`;
    earningsAmount.textContent = `${earnedMoney}`

    if(ingredientsStock.flour === 0) {
        buttonMakeCookieBall.querySelector(".button-text").textContent = "No more flour";
    }

    if(ingredientsStock.rawCookies === 0) {
        buttonBake1Cookie.querySelector(".button-text").textContent = "No cookies to bake";
        buttonBakeAllCookies.querySelector(".button-text").textContent = "No cookies to bake";
    } else {
        buttonBake1Cookie.querySelector(".button-text").textContent = "Bake one cookie";
        buttonBakeAllCookies.querySelector(".button-text").textContent = "Bake max cookies";
    }
}

const beginMakingCookieBall = () => {
    buttonLoading.style.backgroundColor = "#F5CB73";
    buttonsText.style.fontSize = "4rem";
    buttonsText.textContent = `Stop`;
    isMaking = true;
};

const abortMakingCookieBall = () => {
    isMaking = false;
};

const updateBallMakingProgressAndCookieBakedStatus = () => {
    ballMakingProgress();

    cookieBakedStatus ();

    sellCookiesInterval();

    updateIngredientsAmount();

    requestAnimationFrame(updateBallMakingProgressAndCookieBakedStatus);
};

const sellCookiesInterval = () => {
    const now = Date.now();
    if (now > nextBuy) {
        sellAvailableCookies();
        const interval = getRandomInt(3000, 6000);
        nextBuy = now + interval;
    }
}

const sellAvailableCookies = () => {
    if(ingredientsStock.bakedCookies) {
        const randomSoldCookies = Math.min(ingredientsStock.bakedCookies, getRandomInt(1, 11));
        if (randomSoldCookies > 5){
            earnedMoney += randomSoldCookies * 4;
        }
        else {
            earnedMoney += randomSoldCookies * 5;
        }
        ingredientsStock.bakedCookies -= randomSoldCookies;
    }
}

const cookieBakedStatus = () => {
    const timeLaps = Date.now();
    const changeOfTime = timeLaps - timeSinceStartOfBaking;
    timeSinceStartOfBaking = timeLaps;
    ingredientsStock.ovenCookies.forEach((cookie, id) => {
        if(cookie.isCookieInOven) {
            cookie.timeSpentInOven += changeOfTime;

            if(cookie.timeSpentInOven >= 3000) {
                ovenSlots[id].querySelector("div").style.backgroundColor = ingredientsStock.cookieBakedLvlColors[0];
            }

            if (cookie.timeSpentInOven > 6000) {
                ovenSlots[id].querySelector("div").style.backgroundColor = ingredientsStock.cookieBakedLvlColors[1];
                ingredientsStock.ovenCookies[id].isPerfect = true;
            }

            if (cookie.timeSpentInOven >= 9000) {
                ovenSlots[id].querySelector("div").style.backgroundColor = ingredientsStock.cookieBakedLvlColors[2];
                ingredientsStock.ovenCookies[id].isPerfect = false;
            }

            if(cookie.timeSpentInOven >= 12000) {
                ingredientsStock.ovenCookies[id].isCookieInOven = false;
                ovenSlots[id].querySelector("div").remove();
                cookie.timeSpentInOven = 0;
            }
        }
    })
}

const ballMakingProgress = () => {
    const currentTime = Date.now();
    if(isMaking) {
        cookieBallProgress +=
        currentTime - timeSinceStartOfMakingCookieBall;
        timeSinceStartOfMakingCookieBall = currentTime;
    } else {
        resetProgressBar();
    }

    if (cookieBallProgress >= 2000) {
        addCookieBalls();
        resetProgressBar();
        isMaking = false;

        if(ingredientsStock.flour < 10) {
            buttonsText.textContent = `No more flour`;
        }
    }
    buttonLoading.style.width = `${cookieBallProgress / 20}%`;
}

const addCookieBalls = () => {
    const div = document.createElement("div");
    div.classList.add("ball");
    div.setAttribute("ball-id", `${ingredientsStock.rawCookieBalls.length}`);
    cookieBalls.append(div);

    ingredientsStock.rawCookieBalls.push({
            id: ingredientsStock.rawCookieBalls.length,
            doughLeft: 20,
            ballColorRed: 230,
            ballColorBlue: 180,
        }
    )

    div.addEventListener("mousedown", (e) => makeRawCookie(e));

    ingredientsStock.flour -= 10;
    cookieBallsCounter += 1
}

const resetProgressBar = () => {
    cookieBallProgress = 0;
    buttonLoading.style.width = `${0}%`;
    buttonLoading.style.backgroundColor = "#87b0f3";
    buttonsText.textContent = `Make dough ball`;
    buttonsText.style.fontSize = "2.5rem";
};

const makeRawCookie = (e) => {
    const currentBall = e.currentTarget;
    const animationAdd = document.createElement("span");

    animationAdd.textContent = "+1";
    animationAdd.classList.add("add-1");
    animationAdd.style.right = `${Math.random() * (2.5 - 1) + 1}rem`;
    currentBall.append(animationAdd);

    setTimeout(() => {
        currentBall.querySelector(".add-1").remove();
    }, 1000);

    const currentCookieBallId = currentBall.getAttribute("ball-id");
    const currentCookieBall = ingredientsStock.rawCookieBalls[currentCookieBallId];

    ingredientsStock.rawCookies += 1;

    currentCookieBall.doughLeft -= 1;
    currentBall.style.backgroundColor = `rgb(245, ${currentCookieBall.ballColorRed -= 5}, ${currentCookieBall.ballColorBlue -= 10})`;

    if(currentCookieBall.doughLeft === 0) {
        currentBall.remove();
        cookieBallsCounter -= 1;
    }
}

const putCookiesInTheOven = (isOneCookie) => {
    timeSinceStartOfBaking = Date.now();

    if(ingredientsStock.rawCookies === 0) {
        return;
    }

    if (isOneCookie) {
        putCookieInOvenSlot(currentOvenSlot);
        currentOvenSlot += 1;
        return;
    }

    ingredientsStock.ovenCookies.forEach((cookie, id) => {
        if((!cookie.isCookieInOven) && (ingredientsStock.rawCookies !== 0)) {
            putCookieInOvenSlot(id);
        }
    });

}

const putCookieInOvenSlot = (id) => {
    if(!ingredientsStock.ovenCookies[id].isCookieInOven) {
        const div = document.createElement("div");
        div.classList.add("ball");
        ovenSlots[id].append(div);

        ingredientsStock.ovenCookies[id].isCookieInOven = true;
        ingredientsStock.rawCookies--;

        div.addEventListener("mousedown", (e) => {
            e.currentTarget.remove();
            if(ingredientsStock.ovenCookies[id].isPerfect) {
                ingredientsStock.bakedCookies += 1;
            }
            ingredientsStock.ovenCookies[id].isPerfect = false;
            ingredientsStock.ovenCookies[id].isCookieInOven = false;
            ingredientsStock.ovenCookies[id].timeSpentInOven = 0;
        })
    }
}

buttonMakeCookieBall.addEventListener("mousedown", () => {
    if ((cookieBallProgress === 0) && (ingredientsStock.flour >= 10)) {
        timeSinceStartOfMakingCookieBall = Date.now();
        return beginMakingCookieBall();
    }
    abortMakingCookieBall();
});

buttonBuyFlour.addEventListener("mousedown", () => {
    if(earnedMoney >= 50) {
        earnedMoney -= 50;
        ingredientsStock.flour += 100;
    }
})

buttonBakeAllCookies.addEventListener("mousedown",() => putCookiesInTheOven());
buttonBake1Cookie.addEventListener("mousedown",() => {
    if(currentOvenSlot > 8) {
        currentOvenSlot = 0;
    }
    while(ingredientsStock.ovenCookies[currentOvenSlot].isCookieInOven) {
        currentOvenSlot += 1;
    }
    putCookiesInTheOven(true)
});

updateBallMakingProgressAndCookieBakedStatus();








