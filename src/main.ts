import "./style.css"
import Input, { Keys } from "@jahlgren/simple-canvas-input"
import earn from "../public/collect.mp3"
import coin from "../public/coin.svg"

const canvas = document.createElement("canvas")
document.querySelector("#app")?.append(canvas)
const context = canvas.getContext("2d")!
canvas.width = 800
canvas.height = 600

const image = new Image()
image.src = coin
const collect = new Audio(earn)
const input = new Input(canvas)

type Coin = {
    x: number
    y: number
    radius: number
    collected: boolean
}

type Player = {
    x: number
    y: number
    speed: number
    radius: number
}

const coins: Coin[] = []

const player: Player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    speed: 7,
    radius: 20
}

function createCoin() {
    const coin: Coin = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 20,
        collected: false,
    }
    coins.push(coin)
}

let coinsCollected = 0

function update() {
    // Top
    if (player.y - player.radius <= 0) {
        player.y = player.radius
    }
    // Right
    if (player.x + player.radius >= canvas.width) {
        player.x = canvas.width - player.radius
    }
    // Bottom
    if (player.y + player.radius >= canvas.height) {
        player.y = canvas.height - player.radius
    }
    // Left
    if (player.x - player.radius <= 0) {
        player.x = player.radius
    }

    if (input.getKey(Keys.W)) {
        player.y -= player.speed
    }
    if (input.getKey(Keys.S)) {
        player.y += player.speed
    }
    if (input.getKey(Keys.A)) {
        player.x -= player.speed
    }
    if (input.getKey(Keys.D)) {
        player.x += player.speed
    }

    for (const coin of coins) {
        if (
            !coin.collected &&
            Math.sqrt((player.x - coin.x) ** 2 + (player.y - coin.y) ** 2) <
            player.radius + coin.radius
        ) {
            collect.play()
            coin.collected = true
            createCoin()
            coinsCollected++
        }
    }
}


function render() {
    context.clearRect(0, 0, canvas.width, canvas.height)

    for (const coin of coins) {
        if (!coin.collected) {
            context.beginPath()
            context.drawImage(image, coin.x - coin.radius, coin.y - coin.radius, coin.radius * 2, coin.radius * 2)
            context.closePath()
            context.fillStyle = "orange"
            context.fill()
        }
    }

    context.fillStyle = "red"
    context.fillRect(player.x - player.radius, player.y - player.radius, player.radius * 2, player.radius * 2)

    context.fillStyle = "black"
    context.font = "28px serif"
    context.fillText("🪙 " + coinsCollected, 20, 40, 500)
}

function gameLoop() {
    requestAnimationFrame(gameLoop)
    input.update()
    update()
    render()
}

createCoin()

requestAnimationFrame(gameLoop)
