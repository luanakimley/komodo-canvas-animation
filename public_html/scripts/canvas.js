/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


let canvas = null
let ctx = null

// animation array
let animations = []

const CANVAS_WIDTH = 1002
const CANVAS_HEIGHT = 735
const HEADING_HEIGHT = 100
const PICTURE_WIDTH = 650

window.onload = onAllAssetsLoaded

// import image
let img = new Image()
img.src = "images/komodo-game.jpg"

let img2 = new Image()
img2.src = "images/komodo-game-2.jpg"

let bgimg = new Image()
bgimg.src = "images/komodo-bg.jpg"

// import font
let myFont = new FontFace(
        "Palanquin Dark",
        "url('https://fonts.googleapis.com/css2?family=Palanquin+Dark&display=swap');"
        );

WebFontConfig = {
    google: {families: ['Palanquin Dark']},
    active: function () {
        onAllAssetsLoaded()
    },
};
(function () {
    var wf = document.createElement("script");
    wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.5.10/webfont.js';
    wf.async = 'true';
    document.head.appendChild(wf);
})();


function onAllAssetsLoaded()
{
    // hide loading message
    document.getElementById("loadingMessage").style.visibility = "hidden"

    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT

    // detect mouse click
    canvas.addEventListener('click', clickHandler)
    
    animations[0] = new imageAnimation(56000)
    animations[1] = new titleShadowAnimation(58000)
    animations[2] = new titleAnimation(58000)
    
    renderCanvas()

}

let continueAnimation = true

function renderCanvas()
{
    if (!continueAnimation)
    {
        return
    }
    
    for (let i = 0; i < animations.length; i++)
    {
        animations[i].renderObject()
    }
    
    requestAnimationFrame(renderCanvas)
}


function drawQuestion()
{     
    // add image
    ctx.drawImage(img, 0, HEADING_HEIGHT, canvas.width / 2, PICTURE_WIDTH)
    ctx.drawImage(img2, canvas.width / 2 + 2, HEADING_HEIGHT, canvas.width / 2, PICTURE_WIDTH)
    
    // add game title
    ctx.beginPath()
    ctx.strokeStyle = "#dbb95f"
    ctx.lineWidth = 2
    ctx.font = "50px Palanquin Dark"
    ctx.strokeText("Spot the Difference!", 24, 69)
    ctx.closePath()

    ctx.beginPath()
    ctx.fillStyle = "white"
    ctx.font = "50px Palanquin Dark"
    ctx.fillText("Spot the Difference!", 20, 65)
    ctx.closePath()
    
}

// start timer
function startTimer(duration)
{
    drawQuestion() 

    let timer = duration, minutes, seconds
    timerInterval = setInterval(function ()
    {
        ctx.clearRect(850, 0, 152, HEADING_HEIGHT)

        seconds = parseInt(timer % 60, 10)
        minutes = parseInt(timer / 60, 10)


        minutes = minutes < 10 ? "0" + minutes : minutes
        seconds = seconds < 10 ? "0" + seconds : seconds

        timer--

        if (timer < 0)
        {
            timer = 0
            lose()
            clearInterval(timerInterval)
        }

        ctx.fillStyle = "white"
        ctx.fillText(minutes + ":" + seconds, 850, 65)

    }, 1000)

}

// circle properties
const circles =
        [
            // left image
            {
                x: 264,
                y: 487,
                radius: 14,
                found: 0
            },
            {
                x: 299,
                y: 517,
                radius: 13,
                found: 0
            },
            {
                x: 92,
                y: 590,
                radius: 20,
                found: 0
            },
            {
                x: 132,
                y: 345,
                radius: 20,
                found: 0
            },
            {
                x: 400,
                y: 525,
                radius: 14,
                found: 0
            },
            {
                x: 315,
                y: 147,
                radius: 15,
                found: 0
            },
            // right image
            {
                x: 264 + 502,
                y: 487,
                radius: 14,
                found: 0
            },
            {
                x: 299 + 502,
                y: 517,
                radius: 13,
                found: 0
            },
            {
                x: 92 + 502,
                y: 590,
                radius: 20,
                found: 0
            },
            {
                x: 132 + 502,
                y: 345,
                radius: 20,
                found: 0
            },
            {
                x: 400 + 502,
                y: 525,
                radius: 14,
                found: 0
            },
            {
                x: 315 + 502,
                y: 147,
                radius: 15,
                found: 0
            }
        ]

// draw circle 
function drawCircle(x, y, r, startAngle, endAngle, cc)
{
    ctx.beginPath()
    ctx.arc(x, y, r, startAngle, endAngle, cc)
    ctx.strokeStyle = 'red'
    ctx.stroke()
}

// determine if click is inside circle
function isPointInCircle(x, y, cx, cy, rad)
{
    let dx = x - cx
    let dy = y - cy

    let dst = dx * dx + dy * dy
    let r = rad * rad

    return dst < r
}

let mouseX = 0
let mouseY = 0

// click event
function clickHandler(e)
{
    // mouse position
    let rect = canvas.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top

    // get difference count
    let diff = document.getElementById('diffCount')
    let diffCount = parseInt(diff.innerHTML)


    for (let i = 0; i < circles.length; i++)
    {
        // difference is clicked (point clicked inside circle)
        if (isPointInCircle(mouseX, mouseY, circles[i]['x'], circles[i]['y'], circles[i]['radius']))
        {
            if (circles[i]['found'] === 0)
            {
                // difference is found in left image
                if (i <= 5)
                {
                    drawCircle(circles[i]['x'], circles[i]['y'], circles[i]['radius'], 0, Math.PI * 2, false)
                    drawCircle(circles[i + 6]['x'], circles[i + 6]['y'], circles[i + 6]['radius'], 0, Math.PI * 2, false)

                    // mark answer found
                    circles[i]['found'] = 1
                    circles[i + 6]['found'] = 1
                }
                // difference is found in right image
                else
                {
                    drawCircle(circles[i]['x'], circles[i]['y'], circles[i]['radius'], 0, Math.PI * 2, false)
                    drawCircle(circles[i - 6]['x'], circles[i - 6]['y'], circles[i - 6]['radius'], 0, Math.PI * 2, false)

                    // mark answer found
                    circles[i]['found'] = 1
                    circles[i - 6]['found'] = 1
                }


                diffCount--
                diff.innerHTML = diffCount
            }
        }

        if (diffCount === 0)
        {
            win()
            clearInterval(timerInterval)
            animations[0].stop()
        }
    }
}

// win pop up
function win()
{
    document.getElementById('message').style.visibility = "visible"
    document.getElementById('win').style.visibility = "visible"
}

// lose pop up
function lose()
{
    document.getElementById('message').style.visibility = "visible"
    document.getElementById('lose').style.visibility = "visible"
}

// start game
function startGame()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    startTimer(60)
    document.getElementById('start').onclick = () => false
}

// restart game
function restartGame()
{

    document.getElementById('message').style.visibility = "hidden"
    document.getElementById('win').style.visibility = "hidden"
    document.getElementById('lose').style.visibility = "hidden"

    onAllAssetsLoaded()
    
    setCanvas()

    for (let i = 0; i < circles.length; i++)
    {
        circles[i]['found'] = 0
    }

    document.getElementById('start').onclick = () => startGame()

    document.getElementById('diffCount').innerHTML = 6

}

function setCanvas()
{
    ctx.drawImage(bgimg, 0, 0, canvas.width, canvas.height)
    
    ctx.beginPath()
    ctx.strokeStyle = "#dbb95f"
    ctx.lineWidth = 2
    ctx.font = "80px Palanquin Dark"
    ctx.strokeText("Spot the Difference!", 124, 379)
    ctx.closePath()
    
    ctx.beginPath()
    ctx.fillStyle = "white"
    ctx.font = "80px Palanquin Dark"
    ctx.fillText("Spot the Difference!", 120, 375)
    ctx.closePath()
    
}

// animation object
class animation
{
    constructor(animationStartDelay, frameRate)
    {
        this.animationInterval = null
        this.frameRate = frameRate
        this.animationIsDisplayed = false

        setTimeout(this.start.bind(this), animationStartDelay);
    }

    start()
    {
        this.animationIsDisplayed = true
        this.animationInterval = setInterval(this.update.bind(this), this.frameRate)
    }

    stop()
    {
        this.animationIsDisplayed = true
        clearInterval(this.animationInterval)
        this.animationInterval = null
    }

    stopAndHide()
    {
        this.stop()
        this.animationIsDisplayed = false
    }

    renderObject()
    {
        if (this.animationIsDisplayed)
        {
            this.render()
        }
    }

    update()
    {

    }

    render()
    {

    }
}


class titleAnimation extends animation
{
    constructor(animationStartDelay)
    {
        super(animationStartDelay, 5)
        this.x = -750
        this.y = 375
        this.message = "Spot the Difference!"
    }
    update()
    {
        this.x++
        if (this.x === 120)
        {
            this.stop()
        }
    }
    render()
    {
        // title of game before game starts
        ctx.beginPath()
        ctx.fillStyle = "white"
        ctx.font = "80px Palanquin Dark"
        ctx.fillText(this.message, this.x, this.y)
        ctx.closePath()
    }
}

class titleShadowAnimation extends animation
{
    constructor(animationStartDelay)
    {
        super(animationStartDelay, 5)
        this.x = -746
        this.y = 379
        this.message = "Spot the Difference!"
    }
    update()
    {
        this.x++
        if (this.x === 124)
        {
            this.stop()
        }
    }
    render()
    {
        // title of game before game starts
        
        ctx.beginPath()
        ctx.strokeStyle = "#dbb95f"
        ctx.lineWidth = 2
        ctx.font = "80px Palanquin Dark"
        ctx.strokeText(this.message, this.x, this.y)
        ctx.closePath()
    }
}

class imageAnimation extends animation
{
    constructor(animationStartDelay)
    {
        super(animationStartDelay, 5)
        this.x = 0
        this.y = 0
        this.width = canvas.width
        this.height = 0
    }
    update()
    {
        this.height++
        
        if (this.height >= canvas.height)
        {
            this.stop()
        }
    }
    render()
    {
        ctx.drawImage(bgimg, this.x, this.y, this.width, this.height)
    }
}