const IMAGES = {
  balls: {
    active: null,
    passive: null
  }, coins: {
    active: null,
    passive: null
  }, lab: {
    active: null,
    passive: null
  },
  map: null,
  buy_slot: null
}

const nav_status = {
  "balls": true,
  "coins": false,
  "lab": false
}

let UPGRADES = {
  balls: [
    {
      name: "PURCHASE BALL",
      level: 0,
      max_level: 29,
      price: 100,
      price_multiplier: 5
    }, {
      name: "UPGRADE BALL SPEED",
      level: 0,
      max_level: 20,
      price: 10,
      price_multiplier: 3
    }, {
      name: "UPGRADE BALL SIZE",
      level: 0,
      max_level: 40,
      price: 5,
      price_multiplier: 2
    }
  ], coins: [
    {
      name: "PURCHASE COIN",
      level: 0,
      max_level: 14,
      price: 1000,
      price_multiplier: 7.5
    }, {
      name: "UPGRADE COIN VALUE",
      level: 0,
      max_level: 49,
      price: 1,
      price_multiplier: 2
    }, {
      name: "UPGRADE COIN SIZE",
      level: 0,
      max_level: 35,
      price: 10,
      price_multiplier: 2
    }
  ], lab: [
    {
      name: "FULL REFUND",
      price: 10000
    }, {
      name: "RANDOMIZE BALLS",
      price: 100
    }, {
      name: "DOUBLE OR NOTHING",
      price: 0
    }
  ]
}

let fps = 120;
let fps_text = "Normal";
let translate_speed = 1;
let balls = [];
let coins = []
let cash = 1000;
let total = 1000;
let cash_per_coin = 100;

const PROPERTIES = {
  speed: 10,
  ball_size: 10,
  coin_size: 30
}
function getRandomInt(min, max) {
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  const randomNumber = randomBuffer[0] / (0xffffffff + 1);
  return Math.floor(min + randomNumber * (max - min));
}

function preload() {
  IMAGES.balls.active = loadImage("visuals/balls_active.png")
  IMAGES.balls.passive = loadImage("visuals/balls_passive.png")
  IMAGES.coins.active = loadImage("visuals/coins_active.png")
  IMAGES.coins.passive = loadImage("visuals/coins_passive.png")
  IMAGES.lab.active = loadImage("visuals/lab_active.png")
  IMAGES.lab.passive = loadImage("visuals/lab_passive.png")
  IMAGES.map = loadImage("visuals/map.png")
  IMAGES.buy_slot = loadImage("visuals/slot.png")
}

function compactNumber(number) {
  if (number == 0) {
    return "0";
  } else if (number < 1000) {
    return number.toFixed(1); // Return the number with 1 decimal digit
  }

  const suffixes = ["", "K", "M", "B", "T"]; // Define suffixes for thousands, millions, billions, etc.

  // Determine the appropriate suffix index
  const suffixIndex = Math.floor(Math.log10(Math.abs(number)) / 3);

  // Calculate the compact number
  const compact = (number / Math.pow(1000, suffixIndex)).toFixed(1);

  // Add the suffix
  const compactString = compact + suffixes[suffixIndex];

  return compactString;
}

function graphics() {
  if (fps === 120) {
    fps = 150
    fps_text = "High"
    translate_speed = 0.8
  } else if (fps === 150) {
    fps = 30
    fps_text = "Very Low"
    translate_speed = 4
  } else if (fps === 30) {
    fps = 60
    fps_text = "Low"
    translate_speed = 2
  } else {
    fps = 120
    fps_text = "Normal"
    translate_speed = 1
  }
  frameRate(fps)
}

function setup() {
  createCanvas(1500, 750);
  frameRate(fps)

  strokeWeight(3)
  stroke("#FFF")
  fill("#00000000")

  for (let i = 0; i < 3; i++) {
    balls.push(getRandomInt(555, 1445) + "/" + getRandomInt(55, 695) + "/" + getRandomInt(0, 360))
  }
  coins.push(getRandomInt(565, 1435) + "/" + getRandomInt(70, 680))
}

function draw() {
  // ROUND MONEY
  cash = Math.round(cash)

  // GAME MECHANICS

  // BALL MOVEMENT
  let new_balls = [];
  for (let i of balls) {
    let x = parseFloat(i.split("/")[0])
    let y = parseFloat(i.split("/")[1])
    let angle = parseFloat(i.split("/")[2])

    x += Math.cos(angle * Math.PI / 180) * PROPERTIES.speed * translate_speed
    y += Math.sin(angle * Math.PI / 180) * PROPERTIES.speed * translate_speed

    if (x < 550 || x > 1450) {
      angle = 180 - angle
      x = Math.min(Math.max(555, x), 1445)
    }
    if (y < 50 || y > 700) {
      angle = 0 - angle
      y = Math.min(Math.max(55, y), 695)
    }
    new_balls.push(x.toString() + "/" + y.toString() + "/" + angle.toString())
  }
  balls = [...new_balls];

  // COIN GATHERED
  let new_coins = []
  for (let i of coins) {
    let touchingCoin = false
    for (let j of balls) {
      if (Math.sqrt(Math.pow(i.split("/")[0] - j.split("/")[0], 2)) <= (PROPERTIES.ball_size + PROPERTIES.coin_size) / 2 && Math.sqrt(Math.pow(i.split("/")[1] - j.split("/")[1], 2)) <= (PROPERTIES.ball_size + PROPERTIES.coin_size) / 2) {
        new_coins.push((getRandomInt(565, 1435)).toString() + "/" + (getRandomInt(70, 680)).toString())
        touchingCoin = true
        cash += cash_per_coin
        total += cash_per_coin
        break
      }
    }
    if (!touchingCoin) {
      new_coins.push(i)
    }
  }
  coins = [...new_coins]

  // BACKGROUND
  background("#000");
  image(IMAGES.map, 526, 25)

  image(IMAGES.buy_slot, 0, 235)
  image(IMAGES.buy_slot, 0, 400)
  image(IMAGES.buy_slot, 0, 565)

  fill("#FFFF0055")
  stroke("#FFFFFF")

  rect(1, 125, 500, 90)

  fill("#000000")
  rect(355, 126, 145, 49)

  fill("#00FFFF55")
  rect(355, 126, 145, 49)

  line(0, 75, 500, 75)

  fill("#FFFFFF")
  noStroke()
  textFont("Courier New")
  textSize(40)
  textAlign(LEFT)
  textStyle(NORMAL)

  text("Statistics:", 0, 112.5)

  textSize(20)

  text("Balls: " + balls.length, 10, 150)
  text("Coins: " + coins.length, 10, 175)
  text("Speed: " + PROPERTIES.speed, 10, 200)
  text("Money: " + compactNumber(cash), 150, 150)
  text("Total: " + compactNumber(total), 150, 175)
  text("Graphics: " + fps_text + " (~" + fps + " fps)", 150, 200)
  text("TOGGLE", 362, 145)
  text("GRAPHICS", 362, 165)

  stroke("#FFFFFF")

  line(140, 135, 140, 205)
  line(355, 126, 355, 175)
  line(355, 175, 500, 175)

  // NAVBAR
  nav_status.balls ? image(IMAGES.balls.active, 0, 0) : image(IMAGES.balls.passive, 0, 0)
  nav_status.coins ? image(IMAGES.coins.active, 167, 0) : image(IMAGES.coins.passive, 167, 0)
  nav_status.lab ? image(IMAGES.lab.active, 334, 0) : image(IMAGES.lab.passive, 334, 0)

  // MAP CONTENT
  noFill()
  stroke("#FFFFFF")
  for (let i of balls) {
    circle(i.split("/")[0], i.split("/")[1], PROPERTIES.ball_size)
  }
  fill("#FFFF00")
  noStroke()
  for (let i of coins) {
    circle(i.split("/")[0], i.split("/")[1], PROPERTIES.coin_size)
  }

  // BUY SLOTS

  fill("#00FF0044")
  noStroke()

  if (nav_status.balls) {
    rect(3, 238, 496 * (UPGRADES.balls[0].level / UPGRADES.balls[0].max_level), 150)
    rect(3, 402, 496 * (UPGRADES.balls[1].level / UPGRADES.balls[1].max_level), 150)
    rect(3, 568, 496 * (UPGRADES.balls[2].level / UPGRADES.balls[2].max_level), 150)
  } else if (nav_status.coins) {
    rect(3, 238, 496 * (UPGRADES.coins[0].level / UPGRADES.coins[0].max_level), 150)
    rect(3, 402, 496 * (UPGRADES.coins[1].level / UPGRADES.coins[1].max_level), 150)
    rect(3, 568, 496 * (UPGRADES.coins[2].level / UPGRADES.coins[2].max_level), 150)
  } else if (nav_status.lab) {
    fill("#AA000033")
    rect(3, 238, 496, 150)
    rect(3, 402, 496, 150)
    rect(3, 568, 496, 150)
  }

  fill("#FFFFFF")
  textFont("Courier New")
  textSize(40)

  if (nav_status.balls) {
    text(UPGRADES.balls[0].name, 10, 275)
    text(UPGRADES.balls[1].name, 10, 440)
    text(UPGRADES.balls[2].name, 10, 605)
  } else if (nav_status.coins) {
    text(UPGRADES.coins[0].name, 10, 275)
    text(UPGRADES.coins[1].name, 10, 440)
    text(UPGRADES.coins[2].name, 10, 605)
  } else if (nav_status.lab) {
    text(UPGRADES.lab[0].name, 10, 275)
    text(UPGRADES.lab[1].name, 10, 440)
    text(UPGRADES.lab[2].name, 10, 605)
  }

  fill("#00FF00")
  textSize(30)
  textAlign(RIGHT)
  stroke("#000000")
  textStyle(BOLD)

  if (nav_status.balls) {
    text(compactNumber(UPGRADES.balls[0].price) + " $", 490, 375)
    text(compactNumber(UPGRADES.balls[1].price) + " $", 490, 540)
    text(compactNumber(UPGRADES.balls[2].price) + " $", 490, 705)
  } else if (nav_status.coins) {
    text(compactNumber(UPGRADES.coins[0].price) + " $", 490, 375)
    text(compactNumber(UPGRADES.coins[1].price) + " $", 490, 540)
    text(compactNumber(UPGRADES.coins[2].price) + " $", 490, 705)
  } else if (nav_status.lab) {
    text(compactNumber(UPGRADES.lab[0].price) + " $", 490, 375)
    text(compactNumber(UPGRADES.lab[1].price) + " $", 490, 540)
    text(compactNumber(UPGRADES.lab[2].price) + " $", 490, 705)
  }

  noStroke()
  fill("FF0000")
  textAlign(LEFT)

  if (nav_status.balls) {
    text(UPGRADES.balls[0].level + "/" + UPGRADES.balls[0].max_level, 10, 375)
    text(UPGRADES.balls[1].level + "/" + UPGRADES.balls[1].max_level, 10, 540)
    text(UPGRADES.balls[2].level + "/" + UPGRADES.balls[2].max_level, 10, 705)
  } else if (nav_status.coins) {
    text(UPGRADES.coins[0].level + "/" + UPGRADES.coins[0].max_level, 10, 375)
    text(UPGRADES.coins[1].level + "/" + UPGRADES.coins[1].max_level, 10, 540)
    text(UPGRADES.coins[2].level + "/" + UPGRADES.coins[2].max_level, 10, 705)
  }

  textStyle(NORMAL)
  fill("#FFFF00")

  if (nav_status.balls) {
    text(balls.length + " >> " + (balls.length + 1), 10, 300)
    text(PROPERTIES.speed + " >> " + (PROPERTIES.speed + 1), 10, 465)
    text(PROPERTIES.ball_size + " >> " + (PROPERTIES.ball_size + 1), 10, 630)
  } else if (nav_status.coins) {
    text(coins.length + " >> " + (coins.length + 1), 10, 300)
    text(cash_per_coin + " >> " + (cash_per_coin + 100), 10, 465)
    text(PROPERTIES.coin_size + " >> " + (PROPERTIES.coin_size + 2), 10, 630)
  } else if (nav_status.lab) {
    text("play from beginning, but\nwith all of your money", 10, 300)
    text("reset ball positions and\nangles", 10, 465)
    text("50% / 50%: double or lose\nyour cash", 10, 630)
  }
}

function mousePressed() {

  // NAVBAR
  if (mouseX >= 0 && mouseX <= 167 && mouseY >= 0 && mouseY <= 75) {
    nav_status.balls = true; nav_status.coins = false; nav_status.lab = false;
  } else if (mouseX >= 167 && mouseX <= 334 && mouseY >= 0 && mouseY <= 75) {
    nav_status.coins = true; nav_status.balls = false; nav_status.lab = false;
  } else if (mouseX >= 334 && mouseX <= 500 && mouseY >= 0 && mouseY <= 75) {
    nav_status.lab = true; nav_status.balls = false; nav_status.coins = false;
  }

  // TOGGLE GRAPHICS
  else if (mouseX >= 355 && mouseX <= 500 && mouseY >= 125 && mouseY <= 175) {
    graphics()
  }

  // BUY SLOTS
  else if (mouseX >= 0 && mouseX <= 500 && mouseY >= 235 && mouseY <= 385) {
    if (nav_status.balls && cash >= UPGRADES.balls[0].price && UPGRADES.balls[0].level < UPGRADES.balls[0].max_level) {
      cash -= UPGRADES.balls[0].price
      UPGRADES.balls[0].price *= UPGRADES.balls[0].price_multiplier
      UPGRADES.balls[0].level++
      balls.push(getRandomInt(555, 1445) + "/" + getRandomInt(55, 695) + "/" + getRandomInt(0, 360))
    }

    else if (nav_status.coins && cash >= UPGRADES.coins[0].price && UPGRADES.coins[0].level < UPGRADES.coins[0].max_level) {
      cash -= UPGRADES.coins[0].price
      UPGRADES.coins[0].price *= UPGRADES.coins[0].price_multiplier
      UPGRADES.coins[0].level++
      coins.push(getRandomInt(565, 1435) + "/" + getRandomInt(70, 680))
    }

    else if (nav_status.lab && cash >= UPGRADES.lab[0].price) {
      cash = total - 10000
      balls = []
      coins = []
      for (let i = 0; i < 3; i++) {
        balls.push(getRandomInt(555, 1445) + "/" + getRandomInt(55, 695) + "/" + getRandomInt(0, 360))
      }
      coins.push(getRandomInt(565, 1435) + "/" + getRandomInt(70, 680))
      PROPERTIES.speed = 10
      PROPERTIES.ball_size = 10
      PROPERTIES.coin_size = 30
      cash_per_coin = 100
      UPGRADES = {
        balls: [
          {
            name: "PURCHASE BALL",
            level: 0,
            max_level: 29,
            price: 100,
            price_multiplier: 5
          }, {
            name: "UPGRADE BALL SPEED",
            level: 0,
            max_level: 20,
            price: 10,
            price_multiplier: 3
          }, {
            name: "UPGRADE BALL SIZE",
            level: 0,
            max_level: 40,
            price: 5,
            price_multiplier: 2
          }
        ], coins: [
          {
            name: "PURCHASE COIN",
            level: 0,
            max_level: 14,
            price: 1000,
            price_multiplier: 7.5
          }, {
            name: "UPGRADE COIN VALUE",
            level: 0,
            max_level: 49,
            price: 1,
            price_multiplier: 2
          }, {
            name: "UPGRADE COIN SIZE",
            level: 0,
            max_level: 35,
            price: 10,
            price_multiplier: 2
          }
        ], lab: [
          {
            name: "FULL REFUND",
            price: 10000
          }, {
            name: "RANDOMIZE BALLS",
            price: 100
          }, {
            name: "DOUBLE OR NOTHING",
            price: 0
          }
        ]
      }
    }
  }

  else if (mouseX >= 0 && mouseX <= 500 && mouseY >= 400 && mouseY <= 550) {
    if (nav_status.balls && cash >= UPGRADES.balls[1].price && UPGRADES.balls[1].level < UPGRADES.balls[1].max_level) {
      cash -= UPGRADES.balls[1].price
      UPGRADES.balls[1].price *= UPGRADES.balls[1].price_multiplier
      UPGRADES.balls[1].level++
      PROPERTIES.speed++
    }

    else if (nav_status.coins && cash >= UPGRADES.coins[1].price && UPGRADES.coins[1].level < UPGRADES.coins[1].max_level) {
      cash -= UPGRADES.coins[1].price
      UPGRADES.coins[1].price *= UPGRADES.coins[1].price_multiplier
      UPGRADES.coins[1].level++
      cash_per_coin += 100
    }

    else if (nav_status.lab && cash >= UPGRADES.lab[1].price) {
      cash -= UPGRADES.lab[1].price
      let new_balls = []
      for (let i = 0; i < balls.length; i++) {
        new_balls.push(getRandomInt(555, 1445) + "/" + getRandomInt(55, 695) + "/" + getRandomInt(0, 360))
      }
      balls = [...new_balls]
    }
  }

  else if (mouseX >= 0 && mouseX <= 500 && mouseY >= 565 && mouseY <= 715) {
    if (nav_status.balls && cash >= UPGRADES.balls[2].price && UPGRADES.balls[2].level < UPGRADES.balls[2].max_level) {
      cash -= UPGRADES.balls[2].price
      UPGRADES.balls[2].price *= UPGRADES.balls[2].price_multiplier
      UPGRADES.balls[2].level++
      PROPERTIES.ball_size++
    }

    else if (nav_status.coins && cash >= UPGRADES.coins[2].price && UPGRADES.coins[2].level < UPGRADES.coins[2].max_level) {
      cash -= UPGRADES.coins[2].price
      UPGRADES.coins[2].price *= UPGRADES.coins[2].price_multiplier
      UPGRADES.coins[2].level++
      PROPERTIES.coin_size += 2
    }

    else if (nav_status.lab) {
      if (Math.random() < 0.5) {
        total -= cash
        cash = 0
      } else {
        cash *= 2
        total += cash
      }
    }
  }
}