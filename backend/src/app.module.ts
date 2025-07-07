import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './ring/product.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ 
    envFilePath: 'config.env' , 
    isGlobal: true
  }),ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
