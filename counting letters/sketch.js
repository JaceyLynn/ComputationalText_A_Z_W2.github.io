let latestCounts = {};

window.onload = function() {
  const input = document.getElementById('textInput');
  const button = document.getElementById('countButton');
  button.addEventListener('click', function() {
    const text = input.value;
    const counts = countLetters(text);
    latestCounts = counts;
    displayCounts(counts);
    if (window.redraw) window.redraw();
  });
};

function countLetters(str) {
  let counts = {};
  for (let t of str) {
    if (t.match(/[a-zA-Z]/)) {
      t = t.toLowerCase();
      counts[t] = (counts[t] || 0) + 1;
    }
  }
    return counts;
  }

function displayCounts(counts) {
  let resultDiv = document.getElementById('result');
  if (!resultDiv) return;
  // Visualization: letters sorted by count, font size = count
  let sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  let html = '<div style="margin-bottom:24px;">';
  for (let [letter, count] of sorted) {
    let fontSize = Math.max(12, Math.min(64, count));
    html += `<span style="font-size:${fontSize}px; margin-right:8px; display:inline-block;">${letter}</span>`;
  }
  html += '</div>';

  // Insert p5 visualization directly underneath
  html += '<div id="p5-canvas-container" style="margin-bottom:32px;"></div>';

  // List view
  html += '<h3>Letter Counts:</h3><ul>';
  for (let letter in counts) {
    html += `<li><b>${letter}</b>: ${counts[letter]}</li>`;
  }
  html += '</ul>';

  resultDiv.innerHTML = html;

// p5.js
let p5Sketch = function(p) {
  p.setup = function() {
    let container = document.getElementById('p5-canvas-container');
    // Remove any existing canvas in the container
    if (container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
    let c = p.createCanvas(860, 120); // fixed width for consistent layout
    c.parent(container);
    p.noLoop();
    p.textAlign(p.CENTER, p.CENTER);
  };
  p.draw = function() {
    p.clear();
    // Draw circles for a-z
    let letters = Array.from({length: 26}, (_, i) => String.fromCharCode(97 + i));
    let margin = 30;
    let usableWidth = p.width - 2 * margin;
    let spacing = usableWidth / 25;
    let y = p.height / 2;
    p.stroke(200);
    p.line(0, y, p.width, y);
    for (let i = 0; i < 26; i++) {
      let letter = letters[i];
      let count = latestCounts[letter] || 0;
      let r = Math.max(8, Math.min(48, count + 1));
      let x = margin + spacing * i;
  p.noStroke();
  // Random color for each circle
  let cr = p.random(60, 255);
  let cg = p.random(60, 255);
  let cb = p.random(60, 255);
  p.fill(cr, cg, cb, 180);
  p.ellipse(x+20, y, r * 2, r * 2);
      p.fill(255);
      p.textSize(16);
      p.text(letter, x+20, y);
    }
  };
};

// Only create one p5 instance
if (!window.p5Instance) {
  window.p5Instance = new p5(p5Sketch);
}
}