const fs = require('fs');

const output = fs.createWriteStream('out.csv');

// Make the training data smaller:
const content =
    fs.readFileSync('strike_zone_training_data.json', 'utf-8').split('\n');
for (let i = 0; i < content.length - 1; i++) {
  const pitch = JSON.parse(content[i]);
  const isStrike = pitch.type === 'S' ? 0 : 1;
  const str = pitch.px + ',' + pitch.pz + ',' + pitch.sz_top + ',' +
      pitch.sz_bot + ',' + pitch.left_handed_batter + ',' + isStrike + '\n';
  output.write(str);
}
