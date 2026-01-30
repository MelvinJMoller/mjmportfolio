//////////////////////////////////////////
//                                      //
//               (free)                 //
//              BLACKJACK               //
//                 by                   //
//           Melvin J. Möller           //
//                                      //
//////////////////////////////////////////

// Deklarera variabler.
let cardValues = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];    // En array med alla värden som korten kan ha.
let cardTypes = ["Club","Diamond","Heart","Spade"];     // En array med alla typer ett kort kan vara.
let cardDeck = [];      // En tom array för kortspelet, den byggs i funktionen build().
let dealerSum = 0;      // En variabel för summan av dealerns kort.
let playerSum = 0;      // En variabel för summan av spelarens kort.
let dealerAce = 0;      // En variabel som räknar antal ACE kort som dealern har.
let playerAce = 0;      // En variabel som räknar antal ACE kort som spelaren har.
let card;               // En variabel för kort. Kommer att användas för att ge värde på ett kort och ge den till dealern eller spelaren.
let hiddenCard;         // En variabel för det gömda kortet som dealern har.
let hitCheck = true;    // En boolean variabel som ska kolla ifall man kan trycka på HIT eller inte.
let stayCheck = true;   // En boolean variabel som ska kolla ifall man kan trycka på STAY eller inte.
let winMessage = "";    // En sträng som kommer att visa ett meddelande på slutet. Ifall spelaren vann eller inte.
let aceMessage = "";    // En sträng som visar siffror som ska dras bort från poängen eftersom att man har ACE.
let cardSound = new Audio("assets/cardSound.mp3");          // En ljudeffekt som spelas när man drar ett nytt kort.
let cardSound2 = new Audio("assets/cardSound2.mp3");        // En ljudeffekt som spelas när dealern drar ett kort.
let winSound = new Audio("assets/winSound.mp3");            // En ljudeffekt som spelas när spelaren vinner.
let failSound = new Audio("assets/failSound.mp3");          // En ljudeffekt som spelas när spelaren förlorar.
let drawSound = new Audio("assets/drawSound.mp3");          // En ljudeffekt som spelas när det blir oavgjort mellan spelaren och dealern.

// En funktion som sker när man läser in sidan.
window.onload=function() {
    build();        // Kör funktionen 'build'.
    shuffle();      // Kör funktionen 'shuffle'.
    start();        // Kör funktionen 'start'.
    document.getElementById("NewGameBtn").addEventListener("click", newGame);   // En eventlistener som gör det möjligt att klicka på New Game knappen, den kör funktionen 'newGame'.
    document.getElementById("PlayerSum").innerText = playerSum;                 // Skriver ut värdet på spelarens kort på sidan.
}

// En funktion som bygger kortleken.
function build() {
    for (let i = 0; i < cardTypes.length; i++) {                    // En for-loop som kör igenom alla typer på kort.
        for (let x = 0; x < cardValues.length; x++) {               // En for-loop som kör igeonm alla kortvärden i en typ.
            cardDeck.push(cardValues[x] + "-" + cardTypes[i]);      // Sätter ihop kortvärdet med korttypen med en '-' och lägger in den i array 'cardDeck', kortleken alltså.
        }
    }
    console.log("Create Deck:");    // Skriver 'Create Deck:' i konsolen, detta är för att visa att det som kommer efter är kortleken.
    console.log(cardDeck);          // Skriver ut array 'cardDeck'. Så att man kan se hela kortleken i konsolen.
}

// En funktion som blandar kortleken.
function shuffle() {
    for (let i = 0; i < cardDeck.length; i++) {                 // En for-loop som loopar genom alla kort i kortleken.
        let x = Math.floor(Math.random() * cardDeck.length);    // Gör en ny variabel som tar en random siffra från kortleken.
        let y = cardDeck[i];                                    // Deklarera en ny temporär variabeln som tar index från cardDeck.
        cardDeck[i] = cardDeck[x]                               // lägger in index i den random 'x' variabeln.
        cardDeck[x] = y;                                        // Lägger in random 'x' variabeln i 'y'.
    }
    console.log("Shuffle Deck:");       // Skriver ut "Shuffle Deck:" i konsolen.
    console.log(cardDeck);              // Skriver ut den nya versionen av 'cardDeck' array. Alltså kortleken.
}

// En funktion som startar spelet, det vill säga att den ger ut 2 kort till dealer och 2 kort till spelaren. Funktionen gör det möjligt att klicka på 'HIT' och 'STAY' också.
function start() {
    hiddenCard = cardDeck.pop();                // Tar ut det sista kortet i kortleken och lägger den i variablen 'hiddenCard'.
    dealerSum += cardValue(hiddenCard);         // Kollar värdet av det gömda i kortet i funktionen 'cardValue' och lägger in värdet i 'dealerSum'.
    dealerAce += aceCheck(hiddenCard);          // Kollar ifall kortet är en ACE, ifall det är en så lägger funktionen till en 1:a i 'dealerAce'.
    console.log("HiddenCard: " + hiddenCard);   // Skriver ut det gömda kortet i konsolen.
    
    let cardImage = document.createElement("img");              // Deklarerar variabeln 'cardImage' som skapar en ny bild element i html.
    let card = cardDeck.pop();                                  // Tar ut det sista kortet ur kortleken och lägger den i 'card' variabeln.
    cardImage.src = "assets/" + card + ".png";                  // Ger en bild till variablen 'cardImage'. För att få rätt bild så lägger jag source i mappen 'assets'. Sen namnet på kortet och till slut '.png'. Namnet på kortet får jag ifrån variabeln 'card'. T.ex ifall variabeln 'card' innehåller '4-Diamond' så kommer bilden ifrån "assets/4-Diamond.png".
    dealerSum += cardValue(card);                               // Lägger in kortet funktionen 'cardValue' och lägger sedan in värdet i 'dealerSum'.
    dealerAce += aceCheck(card);                                // Lägger in kortet i funktionen 'aceCheck' för att kolla ifall det är en ACE kort. Ifall det är så returnerar den en 1:a i dealerAce.
    document.getElementById("DealerCards").append(cardImage);   // Lägger in variabeln 'cardImage', bilden i 'DealerCards' div.
    console.log("DealerSum: " + dealerSum);                     // Skriver ut dealerns poäng i konsolen.
    
    for (let i = 0; i < 2; i++) {                                   // En for-loop som körs två gånger, den ger två kort till spelaren.
        let cardImage = document.createElement("img");              // Deklarerar variabeln 'cardImage' som skapar en ny bild element i html.
        let card = cardDeck.pop();                                  // Tar ut det sista kortet ur kortleken och lägger den i 'card' variabeln.
        cardImage.src = "assets/" + card + ".png";                  // Ger en bild till variablen 'cardImage'. För att få rätt bild så lägger jag source i mappen 'assets'. Sen namnet på kortet och till slut '.png'. Namnet på kortet får jag ifrån variabeln 'card'. T.ex ifall variabeln 'card' innehåller '4-Diamond' så kommer bilden ifrån "assets/4 Diamond.png".
        playerSum += cardValue(card);                               // Lägger in kortet funktionen 'cardValue' för att få ut värdet på kortet och lägger sedan in värdet i 'playerSum'.
        playerAce += aceCheck(card);                                // Lägger in kortet i funktionen 'aceCheck' för att kolla ifall det är en ACE kort. Ifall det är så returnerar den en 1:a i dealerAce.
        document.getElementById("PlayerCards").append(cardImage);   // Lägger in variabeln 'cardImage', bilden i 'PlayerCards' div.
    }
    
    console.log("PlayerSum: " + playerSum);     // Skriver ut spelarens poäng i konsolen.
    console.log("PlayerAce: " + playerAce);     // Skriver ut antal ACE kort som spelaren har i konsolen.
    document.getElementById("HitBtn").addEventListener("click", hit);       // En eventlistener som gör det möjligt att klicka på HIT knappen. När man klickar så körs funktionen 'hit'.
    document.getElementById("StayBtn").addEventListener("click", stay);     // En eventlistener som gör det möjligt att klicka på STAY knappen. När man klickar så körs funktionen 'stay'.
    
    // En if-sats som skriver ut ett meddelande som visar minus antal siffror, det har med ACE att göra. T.ex ifall man har gått över 21 och har 1 ACE så ska meddelandet '-10' visas. Det är för att 10 av poängen går bort för att man har en ACE.
    if (playerSum > 21 && playerAce == 1) {                             // If-satsen ifall man har gått över 21 och har 1 ACE.
        aceMessage = "1 Ace = -10 points";                              // Skriver in "-10" i variabeln 'aceMessage'.
        console.log("aceMessage: " + aceMessage);                       // Skriver ut 'aceMessage' i konsolen.
        document.getElementById("AceMessage").innerText = aceMessage;   // Skriver ut meddelandet i 'aceMessage' i paragraf taggen med ID 'AceMessage' i html.
    } else if (playerSum > 21 && playerAce == 2) {                      // If-satsen ifall man har gått över 21 och har 2 ACE. (Detta kan säkert hända.s)
        aceMessage = "2 Ace = -20 points";                              // Skriver in "-20" i variabeln 'aceMessage'.
        console.log("aceMessage: " + aceMessage);                       // Skriver ut 'aceMessage' i konsolen.
        document.getElementById("AceMessage").innerText = aceMessage;   // Skriver ut meddelandet i 'aceMessage' i paragraf taggen med ID 'AceMessage' i html.
    } else if (playerSum > 21 && playerAce == 3) {                      // If-satsen ifall man har gått över 21 och har 3 ACE. (Detta kommer förmodligen aldrig att hända.)
        aceMessage = "3 Ace = -30 points";                              // Skriver in "-30" i variabeln 'aceMessage'.
        console.log("aceMessage: " + aceMessage);                       // Skriver ut 'aceMessage' i konsolen.
        document.getElementById("AceMessage").innerText = aceMessage;   // Skriver ut meddelandet i 'aceMessage' i paragraf taggen med ID 'AceMessage' i html.
    } else if (playerSum > 21 && playerAce == 4) {                      // If-satsen ifall man har gått över 21 och har 4 ACE. (Detta kommer verkligen aldrig att hända.)
        aceMessage == "4 Ace = -40 points";                             // Skriver in "-40" i variabeln 'aceMessage'.
        console.log("aceMessage: " + aceMessage);                       // Skriver ut 'aceMessage' i konsolen.
        document.getElementById("AceMessage").innerText = aceMessage;   // Skriver ut meddelandet i 'aceMessage' i paragraf taggen med ID 'AceMessage' i html.
    }
}

// En funktion för HIT knappen, ska ge spelaren ett kort.
function hit() {
    if (!hitCheck) {    // Ïfall 'hitCheck' är false så returneras inget.
        return;         // Return inget då 'hitCheck' är false och då ska inget hända när man klickar på 'HIT'.
    }
    
    let cardImage = document.createElement("img");              // Deklarerar variabeln 'cardImage' som skapar en ny bild element i html.
    let card = cardDeck.pop();                                  // Tar ut det sista kortet ur kortleken och lägger den i 'card' variabeln.
    cardImage.src = "assets/" + card + ".png";                  // Ger en bild till variablen 'cardImage'. För att få rätt bild så lägger jag source i mappen 'assets'. Sen namnet på kortet och till slut '.png'. Namnet på kortet får jag ifrån variabeln 'card'. T.ex ifall variabeln 'card' innehåller '4-Diamond' så kommer bilden ifrån "assets/4 Diamond.png".
    playerSum += cardValue(card);                               // Lägger in kortet funktionen 'cardValue' för att få ut värdet på kortet och lägger sedan in värdet i 'playerSum'.
    playerAce += aceCheck(card);                                // Lägger in kortet i funktionen 'aceCheck' för att kolla ifall det är en ACE kort. Ifall det är så returnerar den en 1:a i dealerAce.
    document.getElementById("PlayerCards").append(cardImage);   // Lägger in variabeln 'cardImage', bilden i 'PlayerCards' div.
    
    if(playerRemoveAce(playerSum, playerAce) > 21) {    // Kollar ifall värdet ifrån funktionen 'playerRemoveAce' är högre än 21.
        hitCheck = false;                               // Ändrar 'hitCheck' till false så att man inte kan klicka på HIT-knappen igen.
    }
    
    document.getElementById("PlayerSum").innerText = playerSum;     // Skriver ut spelarens summa i "PlayerSum" i html.
    console.log("PlayerSum: " + playerSum);                         // Skriver ut spelarens summa i konsolen.
    console.log("PlayerAce: " + playerAce);                         // Skriver ut antal ACE som spelaren har i konsolen.
    cardSound.play();                                               // Spelar ljudeffekten 'cardSound'.
    
    // En if-sats som skriver ut ett meddelande som visar minus antal siffror, det har med ACE att göra. T.ex ifall man har gått över 21 och har 1 ACE så ska meddelandet '-10' visas. Det är för att 10 av poängen går bort för att man har en ACE.
    // If-satsen finns här nere igen ifall man får en ACE efter HIT.
    if (playerSum > 21 && playerAce == 1) {                             // If-satsen ifall man har gått över 21 och har 1 ACE.
        aceMessage = "1 Ace = -10 points";                              // Skriver in "-10" i variabeln 'aceMessage'.
        console.log("aceMessage: " + aceMessage);                       // Skriver ut 'aceMessage' i konsolen.
        document.getElementById("AceMessage").innerText = aceMessage;   // Skriver ut meddelandet i 'aceMessage' i paragraf taggen med ID 'AceMessage' i html.
    } else if (playerSum > 21 && playerAce == 2) {                      // If-satsen ifall man har gått över 21 och har 2 ACE. (Detta kan säkert hända.s)
        aceMessage = "2 Ace = -20 points";                              // Skriver in "-20" i variabeln 'aceMessage'.
        console.log("aceMessage: " + aceMessage);                       // Skriver ut 'aceMessage' i konsolen.
        document.getElementById("AceMessage").innerText = aceMessage;   // Skriver ut meddelandet i 'aceMessage' i paragraf taggen med ID 'AceMessage' i html.
    } else if (playerSum > 21 && playerAce == 3) {                      // If-satsen ifall man har gått över 21 och har 3 ACE. (Detta kommer förmodligen aldrig att hända.)
        aceMessage = "3 Ace = -30 points";                              // Skriver in "-30" i variabeln 'aceMessage'.
        console.log("aceMessage: " + aceMessage);                       // Skriver ut 'aceMessage' i konsolen.
        document.getElementById("AceMessage").innerText = aceMessage;   // Skriver ut meddelandet i 'aceMessage' i paragraf taggen med ID 'AceMessage' i html.
    } else if (playerSum > 21 && playerAce == 4) {                      // If-satsen ifall man har gått över 21 och har 4 ACE. (Detta kommer verkligen aldrig att hända.)
        aceMessage == "4 Ace = -40 points";                             // Skriver in "-40" i variabeln 'aceMessage'.
        console.log("aceMessage: " + aceMessage);                       // Skriver ut 'aceMessage' i konsolen.
        document.getElementById("AceMessage").innerText = aceMessage;   // Skriver ut meddelandet i 'aceMessage' i paragraf taggen med ID 'AceMessage' i html.
    }
}

// En funktion för STAY knappen, ska inte ge spelaren ett kort och ska köra funktionen winnerCheck.
function stay() {
    if(!stayCheck) {    // Ifall stayCheck är false så ska inget hända när man trycker på STAY-knappen.
        return;         // Returnerar ingenting för att inget ska hända när man trycker på STAY-knappen ifall den är false.
    }
    
    // En while-loop, dealern ska ta kort så länge värdet är under 17. Dealern måste stanna när dealern får 17 eller högre.
    while (dealerSum < 17) {
        cardSound2.play();                                          // Spelar en ljudeffekt när dealern tar kort.
        let cardImage = document.createElement("img");              // Deklarerar variabeln 'cardImage' som skapar en ny bild element i html.
        let card = cardDeck.pop();                                  // Tar ut det sista kortet ur kortleken och lägger den i 'card' variabeln.
        cardImage.src = "assets/" + card + ".png";                  // Ger en bild till variablen 'cardImage'. För att få rätt bild så lägger jag source i mappen 'assets'. Sen namnet på kortet och till slut '.png'. Namnet på kortet får jag ifrån variabeln 'card'. T.ex ifall variabeln 'card' innehåller '4-Diamond' så kommer bilden ifrån "assets/4 Diamond.png".
        dealerSum += cardValue(card);                               // Lägger in kortet funktionen 'cardValue' och lägger sedan in värdet i 'dealerSum'.
        dealerAce += aceCheck(card);                                // Lägger in kortet i funktionen 'aceCheck' för att kolla ifall det är en ACE kort. Ifall det är så returnerar den en 1:a i dealerAce.
        document.getElementById("DealerCards").append(cardImage);   // Lägger in variabeln 'cardImage', bilden i 'PlayerCards' div.
    }
    
    dealerSum = dealerRemoveAce(dealerSum, dealerAce);      // Kör funktionen dealerRemoveAce för att göra om dealerns ACE-kort till värde 1 ifall det behövs.
    playerSum = playerRemoveAce(playerSum, playerAce);      // Kör funktionen playerRemoveAce för att göra om spelarens ACE-kort till värde 1 ifall det behövs.
    hitCheck = false;       // Sätter hitCheck på false, så att inget händer när man klickar på HIT-knappen.
    stayCheck = false;      // Sätter stayCheck på false, så att inget händer när man klickar på STAY-knappen.
    aceMessage = "";        // Gör aceMessage variabeln tom.
    document.getElementById("AceMessage").innerText = aceMessage;                   // Skriver ut den tomma aceMessage i html.
    document.getElementById("hiddenCard").src = "assets/" + hiddenCard + ".png";    // Visar vilket kort som var den gömda.
    winnerCheck(dealerSum, playerSum);                                              // Kör funktionen 'winnerCheck'.
}

// En funktion som kolar värdet på kortet.
function cardValue(card) {
    let split = card.split("-"); // Deklarerar en variabel som delar upp 'card' på sträcket, så att det blir en array.
    let value = split[0];        // Deklarerar en ny variabel som tar det första värdet, alltså kortetsvärde.
    
    if (isNaN(value)) {         // En if-sats som kollar ifall värdet är inte et tnummer. (NaN betyder Not a Number.)
        if (value == "A") {     // Ifall det inte är ett nummer så kollar det ifall det är "A". I så fall så returnerar den värdet 11.
            return 11;          // Returnerar 11 eftersom att "A" är ACE.
        }
        return 10;              // Annars så returnerar det 10 för att de andra bokstäverna (J, Q och K) är värda 10.
    }
    return parseInt(value);     // Ifall värdet är ett nummer så returnerar det nummret som värde.
}

// En funktion som kollar antalet ACE kort som spelaren och dealern har.
function aceCheck(card) {
    if (card[0] == "A") {       // Kollar ifall kortet är en 'A'. Alltså 'ACE'.
        return 1;               // Returnerar en 1:a.
    }
    return 0;                   // Annars så returnerar det en 0:a.
}

// En funktion som tar bort 10 från poängen ifall dealern har gått över 21. Eftersom att ACE kan vara både 1 eller 11 beroende på antal poäng du har.
function dealerRemoveAce(dealerSum, dealerAce) {
    while (dealerSum > 21 && dealerAce > 0) {   // En while-loop som körs undertiden som 'dealerSum' är mindre än 21 och 'dealerAce' är högre än 0.
        dealerSum -= 10;                        // Sänker dealerSum med 10 då ACE ska bli värd 1 istället för 11.
        dealerAce -= 1;                         // Tar ner dealerAce med 1, för att man kan bara ändra 11 till 1 en gång.
    }
    return dealerSum;                           // Returnerar 'dealerSum'.
}

// En funktion som tar bort 10 från poängen ifall spelaren har gått över 21. Eftersom att ACE kan vara både 1 eller 11 beroende på antal poäng du har.
function playerRemoveAce(playerSum, playerAce) {
    while (playerSum > 21 && playerAce > 0) {   // En while-loop som körs undertiden som 'playerSum' är mindre än 21 och 'playerAce' är högre än 0.
        playerSum -= 10;                        // Sänker dealerSum med 10 då ACE ska bli värd 1 istället för 11.
        playerAce -= 1;                         // Tar ner dealerAce med 1, för att man kan bara ändra 11 till 1 en gång.
    }
    return playerSum;                           // Returnerar 'playerSum'.
}

// En funktion som kollar vinnaren.
function winnerCheck(dealerSum, playerSum) {
    console.log("End Dealer Sum: " + dealerSum)                     // Skriver ut den sista summan som dealer har.
    console.log("End Player Sum: " + playerSum)                     // Skriver ut den sista summan som spelaren har.
    if(playerSum > 21 && dealerSum > 21) {                              // Ifall spelaren och dealern går över 21 då förlorar spelaren, det är regler i blackjack.
        winMessage = "YOU LOSE! Player loses if both goes over 21.";    // Skriver in ett meddelande i variabeln 'winMessage'.
        console.log("YOU LOSE! Player loses if both goes over 21.");    // Skriver ut Meddelande i konsolen.
        failSound.play();                                               // Spelar en ljudeffekt när spelaren förlorar.
    } else if(playerSum == dealerSum) {                     // Ifall spelaren och dealern får samma värde så blir det lika.
        winMessage = "PUSH! Both had the same score.";      // Skriver in ett meddelande i variabeln 'winMessage'.
        console.log("PUSH! Both had the same score.");      // Skriver ut Meddelande i konsolen.
        drawSound.play();                                   // Spelar en ljudeffekt när det blir lika.
    } else if(playerSum > 21) {                         // Ifall spelaren går över 21 så förlorar spelaren.
        winMessage = "YOU LOSE! Player went over 21.";  // Skriver in ett meddelande i variabeln 'winMessage'.
        console.log("YOU LOSE! Player went over 21.");  // Skriver ut Meddelande i konsolen.
        failSound.play();                               // Spelar en ljudeffekt när spelaren förlorar.
    } else if(dealerSum > 21) {                             // Ifall dealern går över 21 så vinner spelaren.
        winMessage = "YOU WIN! Dealer went over 21.";       // Skriver in ett meddelande i variabeln 'winMessage'.
        console.log("YOU WIN! Dealer went over 21.");       // Skriver ut Meddelande i konsolen.
        winSound.play();                                    // Spelar en ljudeffekt när spelaren vinner.
    } else if(dealerSum > playerSum) {                                  // Ifall dealern har mer poäng än spelaren så förlorar spelaren.
        winMessage = "YOU LOSE! Dealer had higher score than player.";  // Skriver in ett meddelande i variabeln 'winMessage'.
        console.log("YOU LOSE! Dealer had higher score than player.");  // Skriver ut Meddelande i konsolen.
        failSound.play();                                               // Spelar en ljudeffekt när spelaren förlorar.
    } else if(playerSum > dealerSum) {                                      // Ifall spelaren har mer poäng än dealern så vinner spelaren.
        winMessage = "YOU WIN! Player had higher score than dealer.";       // Skriver in ett meddelande i variabeln 'winMessage'.
        console.log("YOU WIN! Player had higher score than dealer.");       // Skriver ut Meddelande i konsolen.
        winSound.play();                                                    // Spelar en ljudeffekt när spelaren vinner.
    }
    document.getElementById("DealerSum").innerText = dealerSum;     // Skriver ut dealers poäng i html.
    document.getElementById("PlayerSum").innerText = playerSum;     // Skriver ut spelarens poäng i html.
    document.getElementById("ResultMsg").innerText = winMessage;    // Skriver ut 'winMessage' i p-taggen med ID "ResultMsg" i html.
}

// En funktion som startar ett nytt spel.
function newGame() {
    window.location.reload();       // Refreshar sidan så startas spelet om.
}
