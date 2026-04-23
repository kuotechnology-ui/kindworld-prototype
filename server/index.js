const express = require('express')
const cors = require('cors')
const cron = require('node-cron')
const admin = require('firebase-admin')

// ── Firebase Admin init ──────────────────────────────────────────────────────
// Set GOOGLE_APPLICATION_CREDENTIALS env var on Railway to your service account JSON path,
// or use FIREBASE_SERVICE_ACCOUNT env var containing the JSON string directly.
let firebaseApp
try {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : undefined

  firebaseApp = admin.initializeApp({
    credential: serviceAccount
      ? admin.credential.cert(serviceAccount)
      : admin.credential.applicationDefault(),
    projectId: 'kindworld-b4063',
  })
} catch (e) {
  console.error('Firebase init error:', e.message)
}

const db = admin.firestore()

// ── Express setup ────────────────────────────────────────────────────────────
const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

const PORT = process.env.PORT || 3001
const LINE_TOKEN = process.env.LINE_CHANNEL_TOKEN

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// ── POST /send-line ──────────────────────────────────────────────────────────
// Send a LINE message to multiple users (multicast, up to 500 per batch).
// Body: { userIds: string[], message: string, callerEmail: string }
app.post('/send-line', async (req, res) => {
  const { userIds, message, callerEmail } = req.body

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ error: 'userIds must be a non-empty array' })
  }
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message is required' })
  }
  if (!callerEmail) {
    return res.status(400).json({ error: 'callerEmail is required' })
  }

  // Verify caller is NGO or admin
  try {
    const snap = await db.collection('users').where('email', '==', callerEmail).limit(1).get()
    if (snap.empty) return res.status(403).json({ error: 'Caller not found' })
    const role = snap.docs[0].data().role
    if (!['ngo', 'admin'].includes(role)) {
      return res.status(403).json({ error: 'Only NGO admins can send LINE messages' })
    }
  } catch (e) {
    console.error('Firestore lookup error:', e)
    return res.status(500).json({ error: 'Could not verify caller' })
  }

  if (!LINE_TOKEN) {
    return res.status(500).json({ error: 'LINE_CHANNEL_TOKEN not configured on server' })
  }

  const failed = []

  // Multicast in batches of 500
  for (let i = 0; i < userIds.length; i += 500) {
    const batch = userIds.slice(i, i + 500)
    try {
      const lineRes = await fetch('https://api.line.me/v2/bot/message/multicast', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${LINE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: batch,
          messages: [{ type: 'text', text: message }],
        }),
      })
      if (!lineRes.ok) {
        const err = await lineRes.text().catch(() => '')
        console.error('LINE multicast failed:', lineRes.status, err)
        failed.push(...batch)
      }
    } catch (e) {
      console.error('LINE multicast network error:', e)
      failed.push(...batch)
    }
  }

  res.json({ ok: failed.length === 0, failed })
})

// ── Mission reminder cron ────────────────────────────────────────────────────
// Runs every day at 9:00 AM (server time).
// Finds missions happening tomorrow and sends LINE reminders to registered participants.
cron.schedule('0 9 * * *', async () => {
  console.log('[cron] Running mission reminder job...')

  if (!LINE_TOKEN) {
    console.warn('[cron] LINE_CHANNEL_TOKEN not set — skipping reminders')
    return
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0] // YYYY-MM-DD

  try {
    // Get all missions
    const missionsSnap = await db.collection('missions').get()
    const missions = missionsSnap.docs.map(d => ({ id: d.id, ...d.data() }))

    // Filter missions happening tomorrow
    const upcoming = missions.filter(m => {
      const dateStr = typeof m.date === 'string'
        ? m.date.split('T')[0]
        : m.date?.toDate?.().toISOString().split('T')[0]
      return dateStr === tomorrowStr
    })

    if (upcoming.length === 0) {
      console.log('[cron] No missions tomorrow.')
      return
    }

    // Get all registrations
    const regsSnap = await db.collection('missionRegistrations').get()
    const registrations = regsSnap.docs.map(d => d.data())

    // Get all users with lineUserId
    const usersSnap = await db.collection('users').get()
    const users = usersSnap.docs.map(d => d.data())

    for (const mission of upcoming) {
      const missionRegs = registrations.filter(r => r.missionId === mission.id)
      const lineUserIds = missionRegs
        .map(r => {
          const u = users.find(u => u.email === r.volunteerEmail)
          return u?.lineUserId || ''
        })
        .filter(Boolean)

      if (lineUserIds.length === 0) {
        console.log(`[cron] Mission "${mission.title}" — no LINE-connected participants`)
        continue
      }

      const reminderText =
        `⏰ Reminder: You have a mission tomorrow!\n\n` +
        `📌 ${mission.title}\n` +
        `📅 ${tomorrowStr}\n` +
        (mission.location ? `📍 ${mission.location}\n` : '') +
        `\nSee you there! 🌍`

      // Send in batches of 500
      for (let i = 0; i < lineUserIds.length; i += 500) {
        const batch = lineUserIds.slice(i, i + 500)
        try {
          const lineRes = await fetch('https://api.line.me/v2/bot/message/multicast', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${LINE_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: batch,
              messages: [{ type: 'text', text: reminderText }],
            }),
          })
          if (lineRes.ok) {
            console.log(`[cron] Sent reminder for "${mission.title}" to ${batch.length} users`)
          } else {
            console.error(`[cron] LINE error:`, await lineRes.text())
          }
        } catch (e) {
          console.error('[cron] Network error:', e)
        }
      }
    }
  } catch (e) {
    console.error('[cron] Error in reminder job:', e)
  }
})

// ── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`KindWorld server running on port ${PORT}`)
  console.log(`LINE token: ${LINE_TOKEN ? 'configured ✓' : 'NOT SET ✗'}`)
})
