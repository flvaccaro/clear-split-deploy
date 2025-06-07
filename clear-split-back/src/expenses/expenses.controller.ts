import { Controller, Post, Get, Param, Body, UseGuards, Req, Patch, Delete } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events/:eventId/expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Post()
  create(@Param('eventId') eventId: string, @Body() body: any, @Req() req) {
    return this.expensesService.create({
      eventId,
      description: body.description,
      amount: body.amount,
      createdBy: req.user.sub,
    });
  }

  @Get()
  find(@Param('eventId') eventId: string) {
    return this.expensesService.findByEventId(eventId);
  }

  @Patch(':expenseId')
  update(
    @Param('eventId') eventId: string,
    @Param('expenseId') expenseId: string,
    @Body() body: { amount: number; description: string },
    @Req() req
  ) {
    return this.expensesService.updateExpense(expenseId, req.user.sub, {
      amount: body.amount,
      description: body.description,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':expenseId')
  delete(@Param('eventId') eventId: string, @Param('expenseId') expenseId: string, @Req() req) {
    return this.expensesService.deleteExpense(expenseId, req.user.sub);
  }
}
