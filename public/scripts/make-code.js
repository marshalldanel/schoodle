function makeCode() {
  let output = "";
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const possible = alphabet + alphabet.toLowerCase() + '0123456789';

  for (let i = 0; i < 8; i++)
    output += possible.charAt(Math.floor(Math.random() * possible.length));

  return output;
}

module.exports = makeCode;