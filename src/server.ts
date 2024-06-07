
import path from 'path';
import parseArgs from 'minimist';
import { credentials, loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

const PROTO_PATH = path.join(__dirname, '..', 'helloworld.proto');

// Carrega o arquivo.proto
const packageDefinition = loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })

const helloworldProto = loadPackageDefinition(packageDefinition);

function main() {
  const argv = parseArgs(process.argv.slice(2), {
    string: 'target'
  })
  let target = ''

  if (argv.target) {
    target = argv.target;
  } else {
    target = 'localhost:50051';
  }
  //@ts-ignore
  const client = new helloworldProto.helloworld.Greeter(target,
    credentials.createInsecure()
  );
  let user = '';
  
  if (argv._.length > 0) {
    user = argv._[0];
  } else {
    user = 'world';
  }
  
  client.sayHello({ name: 'duduuu' }, function (err: any, response: any) {
    if (err) {
      console.log('errz', err)

      const errorDetails = JSON.parse(err.metadata.getMap()['error-details']);
      console.error('Detalhes do erro:', errorDetails.reason, errorDetails.stack_trace);

      return
    }

    console.log('Greeting:', response.message);
  });

  client.throwError({ name: 'duduuu' }, function (err: any, response: any) {
    if (err) {
      console.log('errz', err)

      const errorDetails = JSON.parse(err.metadata.getMap()['error-details']);
      console.error('Detalhes do erro:', errorDetails.reason, errorDetails.stack_trace);

      return
    }

    console.log('Greeting:', response.message);
  });
}

main();