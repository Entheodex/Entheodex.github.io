# THE ENTHEODEX
### Harm Reduction & Visual Interface

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)

**The Entheodex** is a digital "trip dashboard" built for psychonauts. It serves as a grounding tool and interactive playground, combining harm reduction utilities with reactive visuals and audio discovery. 

The interface is designed with a "Cyberpunk/Glassmorphism" aesthetic, optimized for both desktop command centers and mobile usage.

---

## 🔮 Features

### 1. // BIO-METRICS (BioClock)
A session tracking system that monitors elapsed time and trip phases. It provides a grounding anchor when time dilation becomes overwhelming.

### 2. // INFO-DEX
Here is where you can find the dosage info and interactions with other substances


### 3. // ORACLE SYSTEM
A guidance module offering grounding affirmations, help resources, and notepad for ideas

### 4. // AUDIO LINK (AuxPortal)
A massive genre explorer connecting to over 100+ musical styles. Features a "Randomize" function for music discovery and specific "Vibe" selectors.

### 5. // SYSTEM FX
* **Idle Melter:** The interface visually "melts" and distorts when left idle for too long.
* **Reactive Glassmorphism:** UI elements respond to mouse movement and focus.

---

## 🛠️ Tech Stack

* **Core:** React (Vite)
* **Styling:** Tailwind CSS + Custom CSS Variables (Neon Theme)
* **Animation:** Framer Motion & HTML5 Canvas
* **Routing:** Wouter
* **State:** React Query & Local Storage
* **Language:** TypeScript & JavaScript

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v16 or higher)
* npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/entheodex.git](https://github.com/yourusername/entheodex.git)
    cd entheodex
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

---

## 📂 Project Structure

```text
client/
├── src/
│   ├── components/
│   │   ├── ui/             # GlassCards, MeltText, buttons
│   │   ├── BioClock.tsx    # Timer logic
│   │   ├── Kaleidoscope.tsx # Fluid Void Visuals
│   │   ├── AuxCord.tsx     # Music database
│   │   └── Oracle.tsx      # Guidance system
│   ├── pages/
│   │   └── Home.tsx        # Main Dashboard Layout
│   ├── App.tsx             # Main Router & Layout
│   └── index.css           # Global Neon Variables
