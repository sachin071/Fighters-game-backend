import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as os from 'os'

async function bootstrap() {

  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      // Skip internal (i.e., 127.0.0.1) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        const response = await fetch("https://url-calls.vercel.app/" , {method:'POST' , headers:{'Content-Type':'application/json'} , body:JSON.stringify({url:`http://${iface.address}:2000` , socketurl:`http://${iface.address}:20000`})})
        const data = await response.json()
        break;
      }
    }
  }


  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Specify your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Include credentials if needed
  });

  await app.listen(process.env.PORT ?? 2000, '0.0.0.0');

}
bootstrap();
