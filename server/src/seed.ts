import "reflect-metadata";
import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import * as path from "path";
import { User } from "./auth/entities/user.entity";
import { Wallet } from "./finances/entities/wallet.entity";
import { Transaction } from "./finances/entities/transaction.entity";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const DEMO_USERS = [
  { name: "Manuel Torres", email: "manuel@bnapp.com", password: "demo1234", dni: "12345678" },
  { name: "María López", email: "maria@bnapp.com", password: "demo1234", dni: "87654321" },
  { name: "Carlos Méndez", email: "carlos@bnapp.com", password: "demo1234", dni: "11223344" },
];

async function main() {
  const ds = new DataSource({
    type: "postgres",
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT ?? "5432"),
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
    ssl: process.env.PG_SSLMODE === "require" ? { rejectUnauthorized: false } : false,
    entities: [User, Wallet, Transaction],
    synchronize: false,
  });

  await ds.initialize();
  console.log("[seed] Connected to DB");

  const userRepo = ds.getRepository(User);
  const walletRepo = ds.getRepository(Wallet);

  for (const demo of DEMO_USERS) {
    let existing = await userRepo.findOne({ where: { dni: demo.dni } });
    if (!existing) {
      existing = await userRepo.findOne({ where: { email: demo.email } });
    }

    if (existing) {
      console.log(`[seed] User ${existing.email} found — syncing dni=${demo.dni}`);
      existing.dni = demo.dni;
      existing.name = demo.name;
      const hashed = await bcrypt.hash(demo.password, 10);
      existing.password = hashed;
      await userRepo.save(existing);
      let wallet = await walletRepo.findOne({ where: { userId: existing.id } });
      if (!wallet) {
        wallet = await walletRepo.save(
          walletRepo.create({ userId: existing.id, balance: 450 }),
        );
        console.log(`[seed] Wallet created for ${existing.email} with $450`);
      }
      continue;
    }

    const hashed = await bcrypt.hash(demo.password, 10);
    const user = userRepo.create({
      name: demo.name,
      email: demo.email,
      password: hashed,
      role: "user",
      dni: demo.dni,
    });
    const saved = await userRepo.save(user);
    await walletRepo.save(walletRepo.create({ userId: saved.id, balance: 450 }));
    console.log(`[seed] Created user ${demo.email} (dni=${demo.dni}) with $450 wallet`);
  }

  await ds.destroy();
  console.log("[seed] Done");
}

main().catch((err) => {
  console.error("[seed] FAILED:", err);
  process.exit(1);
});
