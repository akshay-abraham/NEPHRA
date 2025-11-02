# NEPHRA — Smart Hydration System

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)
2. [User Experience](#-user-experience)
3. [System Architecture and Hardware](#-system-architecture-and-hardware)
4. [App & AI System](#-app--ai-system)
5. [Gamification: The Psychology of Play](#-gamification-the-psychology-of-play)
6. [AI Coach: Science Behind Personalization](#-ai-coach-science-behind-personalization)
7. [Data & Privacy](#-data--privacy)
8. [Credits](#-credits)

---

# 🌍 Project Overview

Water is the simplest nutrient — yet one of the most neglected. Across schools, workplaces, and homes, people unconsciously spend hours without hydration. The result is _mild dehydration_, which causes fatigue, poor concentration, and reduced productivity.

The **problem set** given to us was:

> _“Design a simple, engaging solution that encourages students to drink water regularly in schools.”_

But hydration is not only a problem for children. It affects **all age groups** and contexts:

- **School-age students** → forget to drink due to routines and distractions.
- **Elderly people** → reduced thirst perception leads to frequent dehydration.
- **Menstruating individuals** → hydration requirements fluctuate across cycles.
- **Athletes & outdoor workers** → increased water needs due to activity and environment.

**NEPHRA** was built as a solution that is simple, universal, and scalable — a smart water bottle system that makes hydration _visible, engaging, and personalized_.

---

# 👩‍🎓 User Experience

- **Morning Sync (Before School)**

  - The student opens the NEPHRA companion app.
  - The app uploads yesterday’s hydration history and **ambient temperature logs**.
  - The AI calculates today’s hydration plan using:

    - **Age, gender, body weight**
    - **Ambient temperature forecast**
    - **Special conditions** (e.g., menstruation, illness, sports activity)
    - **Personal preferences** (custom instructions set by user/guardian)

  - The personalized daily goal (e.g., 2.1 L) and in-bottle alert timings are sent to the bottle.

---

- **During Classes**

  - The LED ring on the cap provides subtle, non-distracting reminders:

    - Smooth **orange pulse** → “time to sip.”
    - **Goal progress animation** → fills around the ring as the student drinks.

  - The MPU6050 detects tilt events. If water is consumed, the copper tape sensor logs the change in level.
  - **Spill detection**: Sudden tilt + rapid level drop without pause → AI marks it as a spill and discards it from progress.

---

- **Break Times**

  - The student drinks water. Each sip is logged and stored locally on the ESP32.
  - If offline (no phone nearby), the bottle continues logging with the last synced plan.
  - If online, live data is transmitted to the app, updating the **timeline graph** in real time.

---

- **After Lunch**

  - Hydration needs change with meals and temperature.
  - If the classroom is warmer than usual, the AI adjusts the afternoon reminder frequency.
  - During menstruation days, hydration plans include slightly higher intake, spread across intervals to prevent bloating.

---

- **End of School Day**

  - The student’s app shows:

    - **Daily progress ring** (percentage of goal completed)
    - **Timeline graph** of every sip event
    - **Leaderboard position** (demo gamification for group motivation)

  - The app syncs all raw + event data to the cloud.

---

- **Evening at Home**

  - Parents or guardians can review hydration history for accountability.
  - AI refines long-term patterns by analyzing:

    - Historical intake data
    - Temperature trends
    - Special health inputs (e.g., menstruation, illness, sports days)

---

### **Key UX Principles**

1. **Non-intrusive reminders** → LED animations replace loud alerts.
2. **Gamified progress** → goal rings and leaderboard encourage consistency.
3. **AI-driven personalization** → hydration plans adapt daily, unique to each student.
4. **Error handling** → spill detection ensures only real drinking events are counted.
5. **Universal design** → equally usable by children, elderly, or individuals with special hydration needs.

# ⚙️ System Architecture and Hardware

## **1. Core Hardware Components**

- **ESP32 (Controller)**

  - Dual-core MCU with Wi-Fi + Bluetooth.
  - Responsible for:

    - Data acquisition (copper tape sensor, MPU6050).
    - Event classification (drink, refill, idle, spill).
    - Output control (LED strip animations).
    - Communication with mobile app (Bluetooth).

- **custom Copper Tape Water Level Sensor**

  - Vertical ribbon with **15 parallel copper strips**, each representing \~50 mL increment.
  - Back side epoxy-sealed, front side faces water.
  - Works as capacitive touch-like contacts:

    - Water conducts charge to energize the connected level.
    - The ESP32 detects which strips are “active,” indicating water level.

- **MPU6050 (Accelerometer + Gyroscope)**

  - Detects tilt and motion.
  - Provides data to distinguish:

    - **Drinking event** → Tilt + gradual water decrease.
    - **Refill event** → Rapid water increase.
    - **Spill event** → Sudden tilt + rapid water drop.
    - **Idle event** → No tilt, no water change.

- **LED Strip (WS2812B, Ring Format)**

  - Circular LED ring mounted at cap edge.
  - Provides multiple animated feedback views (2–3 modes).
  - Default: Deep orange progress ring, filling as daily goal progresses.

- **Battery & Power System**

  - Rechargeable Li-ion cell.
  - TP4056/TP6050 USB-C charging module.
  - Boost converter for regulated 5V (if required).
  - Power safety: ESP32 logic cuts sensing circuit when drinking is detected (MOSFET-controlled).

---

## **2. ESP32 Event Logic Flow**

The ESP32 continuously fuses **water level data** with **motion data** to classify states:

1. **Idle**

   - Water level constant.
   - No significant tilt detected.
   - ESP32 logs "idle" state.
   - No LED changes.

2. **Drinking**

   - Tilt detected (30–90°).
   - Water level decreases gradually in sync with tilt.
   - ESP32 logs "drink event" with timestamp + volume consumed.
   - LED strip: Smooth animated pulse → progress update.

3. **Refill**

   - Sudden increase in water level detected (≥100 mL within seconds).
   - ESP32 logs "refill event."
   - LED strip: Blue swirl animation for refill confirmation.

4. **Spill**

   - Rapid tilt detected (jerk motion).
   - Sudden sharp drop in water level without pause.
   - ESP32 logs "spill event" (excluded from consumption totals).
   - LED strip: Quick red flash.

---

## **3. LED Strip Views**

NEPHRA uses the LED strip not only for reminders but also as a **dynamic visualization tool**:

- **Default View — Goal Progress Ring**

  - Orange arc fills progressively as user approaches daily hydration goal.

- **Event Feedback View (Activated Temporarily)**

  - Drinking: Orange pulse glow.
  - Refill: Blue swirl effect.
  - Spill: Red flash.
  - Automatically reverts to Default View after a few seconds.

- **Secondary Mode — Motivational Animations**

  - Example: At 50% goal → Green spark animation.
  - At 100% → Multicolor celebration burst.

---

## **4. Data Handling on ESP32**

- **Offline Mode**

  - Stores all raw sensor + event data in local buffer.
  - Executes last synced AI-generated hydration plan (daily goal + alert timings).
  - Provides LED-based reminders independent of app connection.

- **Connected Mode**

  - Sends:

    - Live raw MPU + water sensor data.
    - Event logs with timestamps.
    - Current water percentage.

  - Receives from app:

    - AI-calculated daily goal.
    - In-bottle alert timings.

  - Syncs stored offline data to cloud via app.

---

# 📱 App & AI System

The app is organized into **four elegant panes**—each answering a fundamental user question:

### 1. Dashboard (The Present)

_“How am I doing right now?”_

- **Progress Ring** → central, animated, deeply satisfying visual of goal completion.
- **AI Motivational Coach** → witty encouragements to sustain effort.
- **Quick Stats** → streaks, bottle level, ambient temp.
- **Smart Tip of the Day** → 1 AI-driven, actionable insight.

### 2. Timeline (The Past)

_“What have I done so far?”_

- Event log of every sip, refill, spill, or achievement.
- Daily & weekly navigation for habit awareness.

### 3. Leaderboard (The Social Loop)

_“Where do I stand among others?”_

- Ranks and Drops (in-game currency).
- Famous names & playful Easter eggs for delight.
- School/class-level leaderboards for community motivation.

### 4. Profile (Identity & Growth)

_“Who am I and how can I improve?”_

- Core stats: Level, Rank, Streak.
- **AI Control Panel:** update weight, health status, special notes.
- **Dynamic AI Goal Plan** with instant recalibration.
- **Achievements (Trophy Case):** all milestones in one expandable section.
- **Developer Zone:** philosophy behind gamification + live simulation view.

---

# 🎮 Gamification: The Psychology of Play

Humans are wired to respond to **progress, rewards, and social recognition**. NEPHRA transforms hydration into a meaningful game:

- **XP & Levels:** Every sip earns points. Reaching milestones unlocks new titles—“Trainee,” “Aqua-Knight,” and beyond. This taps into the **progression loop** of gaming psychology.
- **Streaks:** Missing a day feels like “breaking the chain.” This exploits **loss aversion bias**—a powerful motivator that keeps students engaged daily.
- **Leaderboards:** Healthy competition with classmates (and fun Easter eggs like Alan Turing or Duo Owl) motivates through **social proof** and **status signaling**.
- **Achievements:** Collectible badges (“First Sip,” “Hydro Hero,” “Streak Master”) appeal to the **collector mindset**, offering long-term pride.

---

# 🧠 AI Coach: Science Behind Personalization

The AI system isn’t guessing—it is built on **hydration science and behavioral data**.
Using **Google Gemini**, NEPHRA’s AI considers:

- **User profile:** Age, weight, gender, menstrual cycle notes, exercise, and health status.
- **Bottle & environment data:** Live water levels, tilt/drink detection, ambient temperature.
- **Long-term patterns:** Your drinking frequency, times you forget, seasonal changes, and even spill detection.
- **Custom conditions:** e.g., fever, sports day, menstruation.

From these inputs, the AI generates:

- A **dynamic daily water goal** tailored to the user’s physiology and context.
- **Optimized reminder intervals** that _don’t nag_ but gently encourage at the right moment.
- **Smart insights:** e.g., _“You hydrate well in mornings, but often miss post-lunch. Let’s set a 2 PM reminder.”_

This isn’t “8 glasses for everyone.” It’s **precision hydration**.

---

# 🔒 Data & Privacy

- All personal data is stored **locally** on the device.
- The AI plan is computed **client-side with Gemini** — no permanent cloud storage.
- Offline-first design ensures reliability in schools and low-connectivity environments.

---

# 🙌 Credits

**Made by**

- **Akshay K Rooben Abraham**[Visit Personal Website](https://akshayabraham.vercel.app/)
- **Adwaith Krishna U S**

**Mentorship & Guidance**

- ATL Mentor — _Mr. Rohan Abraham_
- Guidance on hardware theory-to-practice — _Mr. Das_

**Medical Advice**

- _Mrs. Lally Abraham_, Pediatrician, General Hospital Kottayam
