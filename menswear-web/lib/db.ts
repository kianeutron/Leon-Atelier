import fs from 'fs'
import path from 'path'

export type User = {
  id: number
  email: string
  password_hash: string
  created_at: string
  first_name?: string
  last_name?: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_PATH = path.join(DATA_DIR, 'users.json')

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(USERS_PATH)) fs.writeFileSync(USERS_PATH, '[]', 'utf8')
}

function readUsers(): User[] {
  ensureStore()
  try {
    const raw = fs.readFileSync(USERS_PATH, 'utf8')
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr as User[] : []
  } catch {
    return []
  }
}

function writeUsers(users: User[]) {
  ensureStore()
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2), 'utf8')
}

export function findUserByEmailDB(email: string): User | undefined {
  const users = readUsers()
  return users.find(u => u.email === email)
}

export function insertUserDB(email: string, password_hash: string, first_name?: string, last_name?: string): number {
  const users = readUsers()
  const now = new Date().toISOString()
  const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1
  users.push({ id: nextId, email, password_hash, created_at: now, first_name, last_name })
  writeUsers(users)
  return nextId
}

export function findUserByIdDB(id: number): User | undefined {
  const users = readUsers()
  return users.find(u => u.id === id)
}
