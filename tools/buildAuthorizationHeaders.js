const createHmac = require('crypto').createHmac;

function build(token, secret) {
  const t = '' + Date.now();
  const nonce = 'requestID';
  const data = token + t + nonce;
  const signTerm = createHmac('sha256', secret)
    .update(Buffer.from(data, 'utf-8'))
    .digest();
  const sign = signTerm.toString('base64');
  return {
    authorization: token,
    sign,
    nonce,
    t,
  };
}

const args = process.argv.slice(2);

const result = build(args[0], args[1]);
console.log(result);