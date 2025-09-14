// inputBox: for user text input
// analyzeButton: button to go to next round
// resultDivs: stores all result divs for easy clearing
let inputBox, analyzeButton, resultDivs = [];
// analysisState: stores the current state of the analysis chain
let analysisState = null;
// vizCanvas: the p5.js canvas for visualization
let vizCanvas = null;

function setup() {
  // get the main container div
  let holder = select('#sketch-holder');
  // create a flexbox container to hold left and right columns
  let flexDiv = createDiv('');

  flexDiv.style('display', 'flex');
  flexDiv.style('flex-direction', 'row');
  flexDiv.style('align-items', 'flex-start');
  flexDiv.parent(holder);

  // Left column for controls/results
  let leftDiv = createDiv('');
  leftDiv.style('flex', '0 0 320px');
  leftDiv.style('margin-right', '24px');
  leftDiv.parent(flexDiv);

  // Right column for visualization
  let vizDiv = createDiv('');
  vizDiv.id('viz-holder');
  vizDiv.style('width', '700px');
  vizDiv.style('height', '700px');
  vizDiv.parent(flexDiv);
  vizCanvas = createCanvas(700, 700);
  vizCanvas.parent(vizDiv);
  clear();
  background(255);
  noLoop();

  // Controls and input in leftDiv
  inputBox = createInput('');
  inputBox.attribute('placeholder', 'Paste or type your text here');
  inputBox.size(300);
  inputBox.parent(leftDiv);

  let controlsDiv = createDiv('');
  controlsDiv.parent(leftDiv);
  controlsDiv.style('margin-top', '10px');

  analyzeButton = createButton('Next');
  analyzeButton.parent(controlsDiv);
  analyzeButton.mousePressed(nextAnalysisStep);

  // store leftDiv for resultDivs so all results appear in the left column
  window._resultParentDiv = leftDiv;

function clearResults() {
  // clear the canvas and remove all result divs from the left column
  clear();
  for (let div of resultDivs) {
    div.remove();
  }
  resultDivs = [];
}


function resetAnalysisState() {
  // reset the analysis state and clear results
  analysisState = null;
  clearResults();
}

function nextAnalysisStep() {
  // get the text from the input box
  let text = inputBox.value();
  // if this is the first step or the text has changed, reset everything
  if (!analysisState || analysisState.lastText !== text) {
    // New input or reset
    clearResults();
    // split the text into tokens (words)
    let tokens = text.split(/\W+/);
    // count occurrences of each word
    let counts = {};
    let keys = [];
    // build a map of what words follow each word
    let nextWordMap = {};
    for (let i = 0; i < tokens.length; i++) {
      let word = tokens[i].toLowerCase();
      //ensures that the word does not contain one or more digits， and is not empty
      if (!/\d+/.test(word) && word.length > 0) {
        if (counts[word] === undefined) {
          counts[word] = 1;
          keys.push(word);
        } else {
          counts[word] = counts[word] + 1;
        }
        // ensuring there is a "next" word to examine
        if (i < tokens.length - 1) {
          // Build next word map
          let next = tokens[i + 1].toLowerCase();
          //ensures that the next word does not contain one or more digits， and is not empty
          if (!/\d+/.test(next) && next.length > 0) {
            // ensures that the current word (word) has an entry in the nextWordMap object. If not, it initializes an empty object for it
            if (!nextWordMap[word]) nextWordMap[word] = {};
            // count occurrences of each next word
            if (!nextWordMap[word][next]) nextWordMap[word][next] = 1;
            else nextWordMap[word][next]++;
          }
        }
      }
    }
    // sort words by frequency
    keys.sort((a, b) => counts[b] - counts[a]);
    if (keys.length === 0) {
      resultDivs.push(createDiv('No valid words found.'));
      analysisState = null;
      return;
    }
    // Initialize state
    analysisState = {
      lastText: text,
      counts,
      keys,
      nextWordMap,
      chain: [],
      currentWord: null,
      round: 0
    };
    // First step: most common word
    let word = keys[0];
    analysisState.currentWord = word;
    analysisState.chain.push({ word, count: counts[word] });
    analysisState.round = 1;
  resultDivs.push(createDiv('Most common word: ' + word + ' (' + counts[word] + ')').parent(window._resultParentDiv));
  resultDivs.push(createDiv('summary: ' + word).parent(window._resultParentDiv));
    drawWordChainViz(analysisState.chain);
    return;
  }
  // Continue analysis
  let { currentWord, nextWordMap, chain } = analysisState;
  let nextWords = nextWordMap[currentWord] || {};
  let nextKeys = Object.keys(nextWords);
  if (nextKeys.length > 0) {
    // sort possible next words by frequency
    nextKeys.sort((a, b) => nextWords[b] - nextWords[a]);
    let topNext = nextKeys[0];
    chain.push({ word: topNext, count: nextWords[topNext] });
    analysisState.currentWord = topNext;
    analysisState.round++;
  resultDivs.push(createDiv('Most common word following "' + chain[chain.length-2].word + '": ' + topNext + ' (' + nextWords[topNext] + ')').parent(window._resultParentDiv));
  let outcomeLine = chain.map(item => item.word).join(' ');
  resultDivs.push(createDiv('summary: ' + outcomeLine).parent(window._resultParentDiv));
    drawWordChainViz(chain);
  } else {
    // if there are no more next words, show a message
    let holder = select('#sketch-holder');
  resultDivs.push(createDiv('No words follow "' + currentWord + '".').parent(window._resultParentDiv));
    drawWordChainViz(chain);
  }
}

function drawWordChainViz(chain) {
  // clear the canvas and set background to white
  clear();
  background(255);
  if (!chain || chain.length === 0) return;
  let cx = width / 2;
  let cy = height /2;
  let n = chain.length;
  let baseAngle = PI / 2; // Start at 90 degrees
  let angleStep = -PI / 10; // Fixed gap: 18 degrees between each circle
  let radius = 300;
    for (let i = 0; i < n; i++) {
      let angle = baseAngle + i * angleStep;
      let x = cx + radius * cos(angle);
      let y = cy - radius * sin(angle);
      let r = chain[i].count +15;
      // Draw line from center to circle
      stroke(255, 90, 95);
      strokeWeight(1);
      line(cx, cy, x, y);
      // Draw the circle
      fill(255, 90, 95, 180);
      noStroke();
      ellipse(x, y, r * 2, r * 2);
      fill(30);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(14);
      text(chain[i].word, x, y);
    }
}
}