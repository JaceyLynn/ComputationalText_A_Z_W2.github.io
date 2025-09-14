
// when the page loads, set up the event listener for the count button
window.onload = function() {
  // get the textarea and button elements
  const input = document.getElementById('textInput');
  const button = document.getElementById('countButton');
  // when the button is clicked, process the input text
  button.addEventListener('click', function() {
    // get the text from the textarea
    const text = input.value;
    // count single letter frequencies
    const counts = countLetters(text);
    // count letter bigrams (pairs)
    const bigramData = countLetterBigrams(text);
    // update the display and d3 visualization
    displayCounts(counts, bigramData);
    // store the bigram data globally for d3
    window.bigramData = bigramData;
  });
};

// count the frequency of each letter (a-z, case insensitive)
function countLetters(str) {
  let counts = {};
  for (let t of str) {
    // only consider letters
    if (t.match(/[a-zA-Z]/)) {
      t = t.toLowerCase();
      // increment the count for this letter
      counts[t] = (counts[t] || 0) + 1;
    }
  }
  return counts;
}

// update the result area and log bigram data
function displayCounts(counts, bigramData) {
  // clear the result div (no text output, only d3)
  let resultDiv = document.getElementById('result');
  if (resultDiv) resultDiv.innerHTML = '';
  // log the bigram data to the console for debugging
  console.log('bigram data:', bigramData);
}

// count all letter bigrams (pairs of consecutive letters, a-z)
function countLetterBigrams(str) {
  // create an object to store bigram counts
  let bigramCounts = {};
  // all lowercase letters
  let letters = 'abcdefghijklmnopqrstuvwxyz';
  // initialize all possible letter pairs to zero
  for (let i = 0; i < 26; i++) {
    for (let j = 0; j < 26; j++) {
      let key = letters[i] + letters[j];
      bigramCounts[key] = 0;
    }
  }
  // previous letter (null at start or after non-letter)
  let prev = null;
  for (let t of str) {
    // only consider letters
    if (t.match(/[a-zA-Z]/)) {
      let curr = t.toLowerCase();
      // if there was a previous letter, count the bigram
      if (prev !== null) {
        let key = prev + curr;
        if (bigramCounts.hasOwnProperty(key)) {
          bigramCounts[key]++;
        }
      }
      prev = curr;
    } else {
      // reset previous letter on non-letter
      prev = null;
    }
  }
  // convert the bigram counts to an array of objects for d3
  let data = [];
  for (let i = 0; i < 26; i++) {
    for (let j = 0; j < 26; j++) {
      let key = letters[i] + letters[j];
      data.push({
        source: letters[i].toUpperCase(),
        target: letters[j].toUpperCase(),
        value: bigramCounts[key]
      });
    }
  }
  return data;
}