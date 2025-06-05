import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpenseSchema } from './expense.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Expense', schema: ExpenseSchema }])
  ],
  providers: [ExpensesService],
  controllers: [ExpensesController],
  exports: [ExpensesService]
})
export class ExpensesModule {}
