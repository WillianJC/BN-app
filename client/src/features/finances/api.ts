import { get, post } from "../../utils/api";
import { DEFAULT_PAGE_LIMIT } from "../../utils/constants";

export interface WalletResponse {
  id: string;
  balance: number;
}

export interface TransactionItem {
  id: string;
  walletId: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string | null;
  referenceId: string | null;
  createdAt: string;
}

export interface TransactionsResponse {
  items: TransactionItem[];
  total: number;
  page: number;
  lastPage: number;
}

export interface TransferDto {
  recipientId: string;
  amount: number;
  description: string;
}

export interface WithdrawDto {
  amount: number;
}

export interface UtilityPaymentDto {
  utilityType: "ELECTRICITY" | "WATER";
  amount: number;
  invoiceNumber: string;
}

export interface AmountResponse {
  message: string;
  amount: number;
}

export const financesApi = {
  getWallet: () => get<WalletResponse>("/finances/wallet"),
  getTransactions: (page = 1, limit?: number) =>
    get<TransactionsResponse>(
      `/finances/transactions?page=${page}&limit=${limit ?? DEFAULT_PAGE_LIMIT}`,
    ),
  transfer: (dto: TransferDto) =>
    post<AmountResponse>("/finances/transfer", dto),
  withdraw: (dto: WithdrawDto) => post<AmountResponse>("/finances/withdraw", dto),
  collectPension: () => post<AmountResponse>("/finances/pension"),
  collectBonus: () => post<AmountResponse>("/finances/bonus"),
  payUtility: (dto: UtilityPaymentDto) =>
    post<AmountResponse>("/finances/pay-utility", dto),
};
