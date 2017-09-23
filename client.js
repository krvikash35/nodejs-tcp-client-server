const net = require('net');
const readline = require('readline');

const HOST = 'localhost';
const PORT = 3001;

const client = net.createConnection(PORT, () => {
  console.log(`TCP Client: connected to server ${HOST}:${PORT}`);
  readInputFromStdin();
})

client.on('data', (data) => {
  data = data.toString('utf8');
  console.log('Reply from server:', data);
  readInputFromStdin();
})

client.on('end', () => {
  console.log(`TCP Client: disconnected from server ${HOST}:${PORT}`);
  process.exit();
})

client.on('error', (err) => {
  console.log(`TCP Client: error while connecting to server ${HOST}:${PORT}`, err);
  process.exit();
})


const stdin = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function readInputFromStdin(){
  stdin.question('Enter mathematical exression in format, number1[+/-/*]number2 ie. 10+20 or 10*30 etc, type exit to close application \nQuery to server: ', (question) => {
    if(question === 'exit'){
      client.destroy();
      stdin.close();
      process.exit();
    }
    client.write(question);
  })
}

