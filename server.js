const net = require('net');

const HOST = 'localhost';
const PORT = 3001;

const server = net.createServer(handleSocketConn);
server.listen(PORT, HOST, () => {
  console.log(`TCP Server is listening on ${HOST}:${PORT}`);
});

function handleSocketConn(conn){
  console.log(`TCP Server: got new client connection from ${conn.remoteAddress}:${conn.remotePort}`)

  conn.on('data', onConnData);
  conn.on('close', onConnClose);
  conn.on('error', onConnError);


  function onConnData(data){
    console.log(`TCP Server: data from client ${conn.remoteAddress}:${conn.remotePort} in Binary `,data);
    data = data.toString('utf8');
    console.log(`TCP Server: data from client ${conn.remoteAddress}:${conn.remotePort} in String `,data);
    if ( ! /^[0-9]+[+\-*][0-9]+$/.test(data) ){
      return conn.write('Invalid input format');
    }

    let operatorIndex = data.search(/[+\-*]/);
    let operator = data.charAt(operatorIndex);
    let operand1 = parseInt( data.substring(0, operatorIndex) );
    let operand2 = parseInt( data.substring(operatorIndex+1) );
    let result = null;

    switch (operator) {
      case '+':
        result = operand1+operand2
        conn.write(result.toString());
        break;

      case '-':
        result = operand1-operand2
        conn.write(result.toString());
        break;
    
      case '*':
        result = operand1*operand2
        conn.write(result.toString());
        break; 
    
      default:
        conn.write(`Invalid operator: ${operator}`);
        break;
    }
  }

  function onConnClose(){
    console.log(`TCP Server: client connection is closed from ${conn.remoteAddress}:${conn.remotePort}`);
  }

  function onConnError(){
    console.log(`TCP Server: error occured on client connection from ${conn.remoteAddress}:${conn.remotePort}`);
  }
}
