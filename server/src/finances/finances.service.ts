import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionType } from './enums/transaction-type.enum';
import { UtilityType } from './dto/utility-payment.dto';
import type { TransferDto } from './dto/transfer.dto';
import type { WithdrawDto } from './dto/withdraw.dto';
import type { UtilityPaymentDto } from './dto/utility-payment.dto';

@Injectable()
export class FinancesService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  private async getOrCreateWallet(userId: string): Promise<Wallet> {
    let wallet = await this.walletRepo.findOne({ where: { userId } });
    if (!wallet) {
      wallet = this.walletRepo.create({ userId, balance: 0 });
      wallet = await this.walletRepo.save(wallet);
    }
    return wallet;
  }

  async getWallet(userId: string) {
    const wallet = await this.getOrCreateWallet(userId);
    return { id: wallet.id, balance: Number(wallet.balance) };
  }

  async getTransactions(userId: string, page = 1, limit?: number) {
    const defaultLimit = parseInt(this.configService.get<string>('DEFAULT_PAGE_SIZE', '20'));
    limit = limit ?? defaultLimit;
    const wallet = await this.getOrCreateWallet(userId);
    const [items, total] = await this.transactionRepo.findAndCount({
      where: { walletId: wallet.id },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: items.map((t) => ({ ...t, amount: Number(t.amount) })),
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async transfer(userId: string, dto: TransferDto) {
    if (userId === dto.recipientId) {
      throw new BadRequestException('Cannot transfer to yourself');
    }

    return this.dataSource.transaction(async (em) => {
      const senderWallet = await em.findOne(Wallet, {
        where: { userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!senderWallet || Number(senderWallet.balance) < dto.amount) {
        throw new BadRequestException('Insufficient balance');
      }

      const receiverWallet = await em.findOne(Wallet, {
        where: { userId: dto.recipientId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!receiverWallet) {
        throw new NotFoundException('Recipient not found');
      }

      const senderBal = Number(senderWallet.balance);
      const receiverBal = Number(receiverWallet.balance);

      senderWallet.balance = senderBal - dto.amount;
      receiverWallet.balance = receiverBal + dto.amount;

      await em.save(senderWallet);
      await em.save(receiverWallet);

      await em.save(
        em.create(Transaction, {
          walletId: senderWallet.id,
          type: TransactionType.TRANSFER_OUT,
          amount: dto.amount,
          balanceBefore: senderBal,
          balanceAfter: senderBal - dto.amount,
          description: dto.description,
          referenceId: dto.recipientId,
        }),
      );

      await em.save(
        em.create(Transaction, {
          walletId: receiverWallet.id,
          type: TransactionType.TRANSFER_IN,
          amount: dto.amount,
          balanceBefore: receiverBal,
          balanceAfter: receiverBal + dto.amount,
          description: dto.description,
          referenceId: userId,
        }),
      );

      return { message: 'Transfer successful', amount: dto.amount };
    });
  }

  async withdraw(userId: string, dto: WithdrawDto) {
    return this.dataSource.transaction(async (em) => {
      const wallet = await em.findOne(Wallet, {
        where: { userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!wallet || Number(wallet.balance) < dto.amount) {
        throw new BadRequestException('Insufficient balance');
      }

      const bal = Number(wallet.balance);
      wallet.balance = bal - dto.amount;
      await em.save(wallet);

      await em.save(
        em.create(Transaction, {
          walletId: wallet.id,
          type: TransactionType.WITHDRAWAL,
          amount: dto.amount,
          balanceBefore: bal,
          balanceAfter: bal - dto.amount,
          description: 'Cash withdrawal',
        }),
      );

      return { message: 'Withdrawal successful', amount: dto.amount };
    });
  }

  async collectPension(userId: string) {
    const pensionAmount = parseInt(this.configService.get<string>('PENSION_AMOUNT', '1200'));

    return this.dataSource.transaction(async (em) => {
      const wallet = await em.findOne(Wallet, {
        where: { userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      const bal = Number(wallet.balance);
      wallet.balance = bal + pensionAmount;
      await em.save(wallet);

      await em.save(
        em.create(Transaction, {
          walletId: wallet.id,
          type: TransactionType.PENSION,
          amount: pensionAmount,
          balanceBefore: bal,
          balanceAfter: bal + pensionAmount,
          description: 'Pension collection',
        }),
      );

      return { message: 'Pension collected', amount: pensionAmount };
    });
  }

  async collectBonus(userId: string) {
    const bonusAmount = parseInt(this.configService.get<string>('BONUS_AMOUNT', '500'));

    return this.dataSource.transaction(async (em) => {
      const wallet = await em.findOne(Wallet, {
        where: { userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      const bal = Number(wallet.balance);
      wallet.balance = bal + bonusAmount;
      await em.save(wallet);

      await em.save(
        em.create(Transaction, {
          walletId: wallet.id,
          type: TransactionType.BONUS,
          amount: bonusAmount,
          balanceBefore: bal,
          balanceAfter: bal + bonusAmount,
          description: 'Bonus payment',
        }),
      );

      return { message: 'Bonus collected', amount: bonusAmount };
    });
  }

  async payUtility(userId: string, dto: UtilityPaymentDto) {
    const label =
      dto.utilityType === UtilityType.ELECTRICITY ? 'Electricity' : 'Water';

    return this.dataSource.transaction(async (em) => {
      const wallet = await em.findOne(Wallet, {
        where: { userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!wallet || Number(wallet.balance) < dto.amount) {
        throw new BadRequestException('Insufficient balance');
      }

      const bal = Number(wallet.balance);
      wallet.balance = bal - dto.amount;
      await em.save(wallet);

      await em.save(
        em.create(Transaction, {
          walletId: wallet.id,
          type: TransactionType.UTILITY_PAYMENT,
          amount: dto.amount,
          balanceBefore: bal,
          balanceAfter: bal - dto.amount,
          description: `${label} bill - Invoice ${dto.invoiceNumber}`,
          referenceId: dto.invoiceNumber,
        }),
      );

      return { message: `${label} bill paid`, amount: dto.amount };
    });
  }
}
