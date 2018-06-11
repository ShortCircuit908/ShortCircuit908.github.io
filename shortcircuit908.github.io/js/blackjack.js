/**
 * Created by Caleb Milligan on 4/1/2016.
 */

var g;
var input_buffer = [];
var score = 100;
var bet = 10;

var deck = [];

var player_hand = [];
var dealer_hand = [];

function displayGrid() {
    g.drawString("           |    ", 0, 0);
    g.drawString("------+----+----", 0, 1);
    g.drawString("      |    |    ", 0, 2);
    g.drawString("------+----+    ", 0, 3);
    g.drawString(" HIT  |BET |    ", 0, 4);
    g.drawString(" STAND|    |    ", 0, 5);
    g.drawString("------+----+----", 0, 6);
    g.drawString("           |    ", 0, 7);
}

var allowed_keys = [37, 38, 39, 40, 13];

function addCard(hand, card, callback) {
    hand.push(card);
    setTimeout(callback, 500);
}

function getCard(callback) {
    if (deck.length == 0) {
        genDeck(function () {
            callback(deck.pop());
        })
    }
    else {
        var card = deck.pop();
        if(deck.length == 0){
            genDeck(function () {
                callback(card);
            })
        }
        else {
            callback(card);
        }
    }
}

function getScore(hand) {
    var aces = 0;
    var score = 0;
    for (var i = 0; i < hand.length; i++) {
        switch (hand[i]) {
            case 1:
                aces++;
                score += 11;
                break;
            case 11:
            case 12:
            case 13:
                score += 10;
                break;
            default:
                score += hand[i];
                break;
        }
    }
    while (score > 21 && aces > 0) {
        aces--;
        score -= 10;
    }
    return score;
}

function displayHand(hand, y) {
    for (var x = 0; x < hand.length; x++) {
        g.drawString(getFace(hand[x]), x, y);
    }
}

function getFace(card) {
    switch (card) {
        case 1:
            return "A";
        case 10:
            return "X";
        case 11:
            return "J";
        case 12:
            return "Q";
        case 13:
            return "K";
        default:
            return card + "";
    }
}

function appendInputBuffer(code) {
    input_buffer.push(code);
}

function getInput(callback, allowed_keys) {
    var id = setInterval(function () {
        while (input_buffer.length > 0) {
            var code = input_buffer.pop();
            if (!allowed_keys || arrayContains(allowed_keys, code)) {
                clearInterval(id);
                callback(code);
                break;
            }
        }
    }, 20);
}

function arrayContains(arr, elem) {
    for (var index in arr) {
        if (arr[index] === elem) {
            return true;
        }
    }
    return false;
}

function init(calc) {
    g = calc;
    document.body.addEventListener("keydown", function (event) {
        input_buffer.push(event.keyCode);
    });
    score = ~~(getCookie("blackjack_score") || 100);
    update();
}

function firstDeal(callback) {
    var p2 = function (card) {
        addCard(player_hand, card, function () {
            displayHand(player_hand, 7);
            g.drawString(getScore(player_hand) + "", 13, 7);
            callback();
        });
    };
    var d2 = function (card) {
        addCard(dealer_hand, card, function () {
            getCard(function (card) {
                displayHand(dealer_hand, 0);
                g.drawString("?", 1, 0);
                p2(card);
            });
        });
    };
    var p1 = function (card) {
        addCard(player_hand, card, function () {
            getCard(function (card) {
                displayHand(player_hand, 7);
                g.drawString(getScore(player_hand) + "", 13, 7);
                d2(card);
            });
        });
    };
    var d1 = function (card) {
        addCard(dealer_hand, card, function () {
            getCard(function (card) {
                displayHand(dealer_hand, 0);
                g.drawString(getScore(dealer_hand) + "", 13, 0);
                p1(card);
            });
        });
    };
    getCard(d1);
}

function genDeck(callback) {
    for (var i = 0; i < 52; i++) {
        deck.push(Math.floor(i / 4) + 1);
    }
    shuffle(callback);
}

function shuffle(callback, current_index) {
    if (current_index === undefined) {
        current_index = deck.length - 1;
    }
    if (current_index % 2) {
        g.drawString("SHFL", 1, 2);
    }
    else {
        g.drawString("    ", 1, 2);
    }
    var index = Math.floor(Math.random() * (deck.length - 1));
    var swp = deck[current_index];
    deck[current_index] = deck[index];
    deck[index] = swp;
    current_index--;
    if (current_index < 0) {
        callback();
        return;
    }
    setTimeout(function () {
        shuffle(callback, current_index);
    }, 100);
}

function update() {
    dealer_hand = [];
    player_hand = [];
    displayGrid();
    addScore(0);
    addBet(0);
    if (deck.length == 0) {
        genDeck(update);
        return;
    }
    var getBet = function (key) {
        var amnt = 0;
        switch (key) {
            case 37:
                amnt = -10;
                break;
            case 38:
                amnt = 5;
                break;
            case 39:
                amnt = 10;
                break;
            case 40:
                amnt = -5;
                break;
        }
        addBet(amnt);
        if (key != 13) {
            getInput(getBet, allowed_keys);
        }
        else {
            addScore(-bet);
            g.drawString(" ", 10, 5);
            firstDeal(function () {
                if (getScore(player_hand == 21)) {
                    displayWinner();
                }
                else {
                    playerPlay(function () {
                        dealerPlay(function () {
                            displayWinner();
                        });
                    });
                }
            });
        }
    };
    g.drawString("<", 10, 5);
    getInput(getBet, allowed_keys);
}

function displayContinue(callback) {
    g.drawString("AGAIN?", 0, 4);
    g.drawString("[Y] N ", 0, 5);
    var sel = false;
    var getContinue = function (key) {
        switch (key) {
            case 37:
            case 40:
                sel = false;
                break;
            case 38:
            case 39:
                sel = true;
                break;
        }
        if (!sel) {
            g.drawString("[Y]", 0, 5);
            g.drawString(" N ", 3, 5);
        }
        else {
            g.drawString(" Y ", 0, 5);
            g.drawString("[N]", 3, 5);
        }
        if (key == 13) {
            if (!sel) {
                callback();
            }
            else {
                g.clear();
            }
        }
        else {
            getInput(getContinue, allowed_keys);
        }
    };
    getInput(getContinue, allowed_keys);
}

function displayWinner() {
    // 0: win
    // 1: lose
    // 2: draw
    var win = 0;
    var player_score = getScore(player_hand);
    var dealer_score = getScore(dealer_hand);
    if (dealer_score == player_score || (dealer_score > 21 && player_score > 21)) {
        win = 2;
    }
    else if (player_score > 21 || (dealer_score > player_score && dealer_score <= 21)) {
        win = 1;
    }
    switch (win) {
        case 0:
            g.drawString("LOSE", 12, 2);
            g.drawString("WIN!", 12, 5);
            addScore(bet * 2);
            break;
        case 1:
            g.drawString("WIN!", 12, 2);
            g.drawString("LOSE", 12, 5);
            break;
        default:
            g.drawString("DRAW", 12, 2);
            g.drawString("DRAW", 12, 5);
            addScore(bet);
            break;
    }
    if (score <= 0) {
        var diff = 100 - score;
        addScore(diff);
    }
    setCookie("blackjack_score", score, 100 * 365 * 24 * 60 * 60 * 1000);
    displayContinue(update);
}

function playerPlay(callback) {
    if (getScore(player_hand) >= 21) {
        g.drawString("      ", 0, 4);
        g.drawString("      ", 0, 5);
        callback();
        return;
    }
    var sel = true;
    displayHitStand(sel);
    var getHitStand = function (key) {
        switch (key) {
            case 37:
            case 40:
                sel = false;
                break;
            case 38:
            case 39:
                sel = true;
                break;
        }
        displayHitStand(sel);
        if (key == 13) {
            if (sel) {
                getCard(function (card) {
                    addCard(player_hand, card, function () {
                        displayHand(player_hand, 7);
                        g.drawString(getScore(player_hand) + "", 13, 7);
                        playerPlay(callback);
                    })
                })
            }
            else {
                g.drawString("      ", 0, 4);
                g.drawString("      ", 0, 5);
                callback();
            }
        }
        else {
            getInput(getHitStand, allowed_keys);
        }
    };
    getInput(getHitStand, allowed_keys);
}

function displayHitStand(sel) {
    g.drawString(" ", 0, sel ? 5 : 4);
    g.drawString(">", 0, sel ? 4 : 5);
}

function addBet(amnt) {
    bet += amnt;
    bet = Math.max(Math.min(bet, Math.min(score, 100)), 5);
    g.drawString("  ", 8, 5);
    g.drawString(bet + "", 7, 5);
}

function dealerPlay(callback) {
    var score = getScore(dealer_hand);
    var player_score = getScore(player_hand);
    if (player_score > 21 || score > player_score || score >= 21 || (score == player_score && score >= 17)) {
        displayHand(dealer_hand, 0);
        g.drawString(getScore(dealer_hand) + "", 13, 0);
        callback();
        return;
    }
    getCard(function (card) {
        addCard(dealer_hand, card, function () {
            displayHand(dealer_hand, 0);
            g.drawString(getScore(dealer_hand) + "", 13, 0);
            setTimeout(function () {
                dealerPlay(callback);
            }, 500);
        })
    });
}

function addScore(amnt) {
    score += amnt;
    score = Math.min(score, 9995);
    g.drawString("   ", 8, 2);
    g.drawString(score + "", 7, 2);
}

