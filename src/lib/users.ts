import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { User } from "@/types/user";

const DB_PATH = join(process.cwd(), "data", "users.json");

function ensure(): void {
  const dir = join(process.cwd(), "data");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (!existsSync(DB_PATH)) writeFileSync(DB_PATH, "[]", "utf-8");
}

function readAll(): User[] {
  ensure();
  return JSON.parse(readFileSync(DB_PATH, "utf-8"));
}

function writeAll(users: User[]): void {
  writeFileSync(DB_PATH, JSON.stringify(users, null, 2), "utf-8");
}

export function findByUsername(username: string): User | undefined {
  return readAll().find((u) => u.username === username);
}

export function findById(id: string): User | undefined {
  return readAll().find((u) => u.id === id);
}

export function createUser(username: string, passwordHash: string): User {
  const users = readAll();
  const user: User = { id: crypto.randomUUID(), username, passwordHash };
  users.push(user);
  writeAll(users);
  return user;
}
