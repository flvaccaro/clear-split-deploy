import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './events.schema';
import { UsersModule } from 'src/users/users.module';
import { ExpensesModule } from 'src/expenses/expenses.module';

@Module({
  imports: [
    UsersModule,
    ExpensesModule,
    MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }])
  ],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}
