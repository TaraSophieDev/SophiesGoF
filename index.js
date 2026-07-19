const doStepButton = document.querySelector("#doStep");
const doPlayButton = document.querySelector("#doPlay");
const doResetButton = document.querySelector("#doReset");
const doClearButton = document.querySelector("#doClear");
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

let isPlaying = false;


let canvasScale = 8;
ctx.scale(canvasScale,canvasScale)

let canvasWidth = 50;
let canvasHeight = 50;

let cellArray = Array(canvasWidth);
let savedCellArray;

for (let x = 0; x < canvasWidth; x++) {
    cellArray[x] = Array(canvasHeight);
}

function init() {
    for (let x = 0; x < canvasWidth; x++) {
        for (let y = 0; y < canvasHeight; y++) {
            cellArray[x][y] = false;
        }
    }
}

init()

function draw() {
    // rendering cells
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let x = 0; x < canvasWidth; x++) {
        for (let y = 0; y < canvasHeight; y++) {
            const cell = cellArray[x][y];
            ctx.fillStyle = cell ? '#ddd' : "#2b2b2b";
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

function step() {
    draw();
    // apply ruleset
    let cellArrayClone = structuredClone(cellArray);
    for (let x = 0; x < canvasWidth; x++) {
        for (let y = 0; y < canvasHeight; y++) {
            let cell = cellArray[x][y];
            const neighborLeft = cellArray[x-1]?.[y] ?? false;
            const neighborTopLeft = cellArray[x-1]?.[y-1] ?? false;
            const neighborBottomLeft = cellArray[x-1]?.[y+1] ?? false;
            const neighborBottom = cellArray[x]?.[y+1] ?? false;
            const neighborBottomRight = cellArray[x+1]?.[y+1] ?? false;
            const neighborRight = cellArray[x+1]?.[y] ?? false;
            const neighborTopRight = cellArray[x+1]?.[y-1] ?? false;
            const neighborTop = cellArray[x]?.[y-1] ?? false;

            let aliveNeighbors = 0;
            if (neighborLeft) aliveNeighbors++;
            if (neighborTopLeft) aliveNeighbors++;
            if (neighborBottomLeft) aliveNeighbors++;
            if (neighborBottom) aliveNeighbors++;
            if (neighborBottomRight) aliveNeighbors++;
            if (neighborRight) aliveNeighbors++;
            if (neighborTopRight) aliveNeighbors++;
            if (neighborTop) aliveNeighbors++;

            // 1. Any live cell with fewer than two live neighbors dies, as if by underpopulation.
            if (cell && aliveNeighbors < 2) {
                cell = false
            }

            // 2. Any live cell with two or three live neighbors lives on to the next generation.
            if (cell && (aliveNeighbors === 2 || aliveNeighbors === 3)) {
                cell = true
            }

            // 3. Any live cell with more than three live neighbors dies, as if by overpopulation.
            if (cell && aliveNeighbors > 3) {
                cell = false
            }

            // 4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
            if (!cell && aliveNeighbors === 3) {
                cell = true
            }

            cellArrayClone[x][y] = cell;
        }
    }

    cellArray = cellArrayClone;
}

function getClickPosition(event) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / canvasScale);
    const y = Math.floor((event.clientY - rect.top) / canvasScale);
    console.log('x', x, 'y', y);
    cellArray[x][y] = !cellArray[x][y];
    draw()
}

canvas.addEventListener("mousedown", function (event) {
    getClickPosition(event);
})

draw()

doStepButton.addEventListener('click', (e) => {
    step();
});
doPlayButton.addEventListener('click', (e) => {
    isPlaying = !isPlaying;
    if (!isPlaying) {
        draw();
    }
    if (isPlaying) {
        savedCellArray = structuredClone(cellArray);
    }
});

doResetButton.addEventListener('click', (e) => {
    if(savedCellArray) {
        cellArray = savedCellArray;
    } else {
        init();
    }
    draw()
})

doClearButton.addEventListener('click', (e) => {
    init();
    draw();
})

setInterval(() => {
    if(isPlaying) step()
}, 100);