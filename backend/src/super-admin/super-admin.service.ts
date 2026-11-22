import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { Database } from './database';
import { verifyPassword } from './password';

const sessionSeconds = 8 * 60 * 60;
const dummyPassword = `${'0'.repeat(32)}:${'0'.repeat(128)}`;

function digest(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function sessionDigest(authorization: string | undefined) {
  if (!authorization || !/^Bearer [a-f0-9]{64}$/.test(authorization)) {
    throw new UnauthorizedException();
  }
  return digest(authorization.slice(7));
}

@Injectable()
export class SuperAdminService {
  private windowEnds = 0;
  private attempts = 0;
  private accountAttempts = new Map<string, number>();

  constructor(private readonly database: Database) {}

  private limitAttempts(email: string) {
    const now = Date.now();
    if (now >= this.windowEnds) {
      this.windowEnds = now + 60_000;
      this.attempts = 0;
      this.accountAttempts.clear();
    }
    const accountAttempts = this.accountAttempts.get(email) ?? 0;
    if (accountAttempts >= 8 || this.attempts >= 60) {
      throw new HttpException(
        'Too many sign-in attempts. Try again shortly.',
        429,
      );
    }
    this.attempts++;
    this.accountAttempts.set(email, accountAttempts + 1);
  }

  async login(body: unknown) {
    const input = body as { email?: unknown; password?: unknown } | null;
    if (
      typeof input?.email !== 'string' ||
      typeof input.password !== 'string'
    ) {
      throw new BadRequestException('Email and password are required.');
    }
    const email = input.email.trim().toLowerCase();
    if (
      !email ||
      email.length > 254 ||
      !input.password ||
      input.password.length > 128
    ) {
      throw new BadRequestException('Invalid sign-in input.');
    }
    this.limitAttempts(email);
    const admin = await this.database.platformAdmin.findUnique({
      where: { email, enabled: true },
      select: { id: true, passwordHash: true },
    });
    const valid = await verifyPassword(
      input.password,
      admin?.passwordHash ?? dummyPassword,
    );
    if (!admin || !valid)
      throw new UnauthorizedException('Invalid email or password.');

    const token = randomBytes(32).toString('hex');
    const now = new Date();
    await this.database.$transaction([
      this.database.platformSession.deleteMany({
        where: { expiresAt: { lte: now } },
      }),
      this.database.platformSession.create({
        data: {
          tokenHash: digest(token),
          adminId: admin.id,
          expiresAt: new Date(now.getTime() + sessionSeconds * 1000),
        },
      }),
    ]);
    return { token, maxAge: sessionSeconds };
  }

  async overview(authorization?: string) {
    const tokenHash = sessionDigest(authorization);
    const session = await this.database.platformSession.findUnique({
      where: {
        tokenHash,
        expiresAt: { gt: new Date() },
        admin: { enabled: true },
      },
      select: { expiresAt: true, admin: { select: { email: true } } },
    });
    if (!session) throw new UnauthorizedException();
    const adminCount = await this.database.platformAdmin.count({
      where: { enabled: true },
    });
    return {
      email: session.admin.email,
      expiresAt: session.expiresAt,
      adminCount,
      metrics: {
        balance: {
          title: "My balance",
          subtitle: "Wallet Overview & Spending",
          amount: "$28,520.30",
          change: "+1.5%",
          changeType: "positive",
          trend: "up",
        },
        savings: {
          title: "Savings account",
          subtitle: "Steady Growth Savings",
          amount: "$24,800.45",
          change: "-3.2%",
          changeType: "negative",
          trend: "down",
        },
        investments: {
          title: "Investment portfolio",
          subtitle: "Track Your Wealth Growth",
          amount: "$70,120.78",
          change: "+4.7%",
          changeType: "positive",
          trend: "up",
        },
      },
      wallets: [
        {
          id: "usd",
          currency: "USD",
          countryCode: "US",
          symbol: "$",
          amount: "$24,678.00",
          limit: "Limit is $10k a month",
          status: "Active",
        },
        {
          id: "eur",
          currency: "EUR",
          countryCode: "EU",
          symbol: "€",
          amount: "€28,345.00",
          limit: "Limit is €8k a month",
          status: "Active",
        },
        {
          id: "aud",
          currency: "AUD",
          countryCode: "AU",
          symbol: "$",
          amount: "$20,517.52",
          limit: "Limit is $10k a month",
          status: "Active",
        },
        {
          id: "gbp",
          currency: "GBP",
          countryCode: "GB",
          symbol: "£",
          amount: "£25,000.00",
          limit: "Limit is £7.5k a month",
          status: "Inactive",
        },
      ],
      cashFlow: {
        total: "$540,323.45",
        period: "Yearly",
        currency: "USD",
        highlight: {
          date: "July 23, 2026",
          cashflow: "$33,847.00",
          inflow: "-$7,456.00",
        },
        chartData: [
          { month: "Jan", height: 36, value: 36000 },
          { month: "Feb", height: 44, value: 44000 },
          { month: "Mar", height: 88, value: 88000, active: true },
          { month: "Apr", height: 32, value: 32000 },
          { month: "May", height: 50, value: 50000 },
          { month: "Jun", height: 60, value: 60000 },
          { month: "Jul", height: 72, value: 72000 },
        ],
      },
      recentActivities: [
        {
          id: "1",
          activity: "Software License",
          icon: "adobe",
          orderId: "INV_000076",
          date: "17 Apr, 2026",
          time: "03:45 PM",
          price: "$25,500",
          status: "Completed",
        },
        {
          id: "2",
          activity: "Flight Ticket",
          icon: "plane",
          orderId: "INV_000075",
          date: "16 Apr, 2026",
          time: "11:20 AM",
          price: "$3,200",
          status: "Completed",
        },
        {
          id: "3",
          activity: "Game Server Host",
          icon: "server",
          orderId: "INV_000074",
          date: "15 Apr, 2026",
          time: "08:15 PM",
          price: "$850",
          status: "Pending",
        },
        {
          id: "4",
          activity: "Hardware Station",
          icon: "monitor",
          orderId: "INV_000073",
          date: "14 Apr, 2026",
          time: "02:10 PM",
          price: "$12,400",
          status: "Completed",
        },
      ],
    };
  }

  async logout(authorization?: string) {
    await this.database.platformSession.deleteMany({
      where: { tokenHash: sessionDigest(authorization) },
    });
  }
}
