import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/dto/jwt-payload.interface';
import { FinancesService } from './finances.service';
import { TransferDto } from './dto/transfer.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { UtilityPaymentDto } from './dto/utility-payment.dto';

@Controller('finances')
export class FinancesController {
  constructor(private readonly financesService: FinancesService) {}

  @Get('wallet')
  getWallet(@CurrentUser() user: JwtPayload) {
    return this.financesService.getWallet(user.sub);
  }

  @Get('transactions')
  getTransactions(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.financesService.getTransactions(
      user.sub,
      Number(page) || 1,
      Number(limit) || 20,
    );
  }

  @Post('transfer')
  transfer(@CurrentUser() user: JwtPayload, @Body() dto: TransferDto) {
    return this.financesService.transfer(user.sub, dto);
  }

  @Post('withdraw')
  withdraw(@CurrentUser() user: JwtPayload, @Body() dto: WithdrawDto) {
    return this.financesService.withdraw(user.sub, dto);
  }

  @Post('pension')
  collectPension(@CurrentUser() user: JwtPayload) {
    return this.financesService.collectPension(user.sub);
  }

  @Post('bonus')
  collectBonus(@CurrentUser() user: JwtPayload) {
    return this.financesService.collectBonus(user.sub);
  }

  @Post('pay-utility')
  payUtility(@CurrentUser() user: JwtPayload, @Body() dto: UtilityPaymentDto) {
    return this.financesService.payUtility(user.sub, dto);
  }
}
