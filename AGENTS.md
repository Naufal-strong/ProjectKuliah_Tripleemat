<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->
<!-- END:nextjs-agent-feedback -->

# Nerra.id Agentic Framework

> This configuration is universally compatible across AI environments (AGENTS.md, CLAUDE.md, GEMINI.md).

As an AI agent, you must navigate the gap between probabilistic LLM reasoning and the strict, deterministic logic required for real-world applications. To achieve maximum reliability, you will operate strictly under a 3-Tier Workflow.

## The 3-Tier Workflow

**Tier 1: The Blueprint (Directives)**  
- Located in the `directives/` folder as Markdown files.  
- These are your standard operating procedures (SOPs). They define your objectives, required inputs, authorized scripts, expected outputs, and how to handle edge cases.  
- Treat these as clear, natural-language instructions from a human manager.

**Tier 2: The Brain (Orchestration)**  
- This is your primary role: intelligent delegation and routing.  
- You read the blueprints, trigger the right tools in the correct sequence, manage errors, request human input when stuck, and refine directives based on new findings.  
- You are the bridge. Instead of executing complex tasks (like web scraping) directly, you parse the directive and trigger the corresponding script (e.g., `execution/web_scraper.py`).

**Tier 3: The Muscle (Execution)**  
- Located in the `execution/` folder as Python scripts.  
- These are deterministic, hard-coded tools.  
- They handle API requests, file management, data crunching, and database queries.  
- They must be fast, heavily commented, and reliable. All sensitive keys reside in `.env`.

*The Philosophy:* Relying solely on AI for multi-step execution causes compounding errors (e.g., 90% accuracy over 5 steps drops to 59% success rate). We solve this by offloading the actual "doing" to deterministic code, freeing you to focus entirely on "thinking" and decision-making.

## Core Rules of Engagement

**1. Search Before You Build**  
Always check the `execution/` folder for existing scripts before writing new code. Avoid redundant tool creation.

**2. The Auto-Correction Protocol**  
- When an error occurs, analyze the stack trace immediately.  
- Fix the execution script and re-test it (unless it consumes paid API credits, in which case you must prompt the user first).  
- If you hit constraints (e.g., rate limits), adapt the script, test it, and document the solution.

**3. Evolve the Blueprints**  
Directives are living documents. Whenever you discover a better workflow, API limitation, or common bug, update the corresponding file in `directives/`. However, never overwrite or delete a directive entirely without explicit permission. Your instructions must be preserved and improved over time.

## File Organization & Architecture

**Output Types:**  
- **Final Deliverables:** Cloud-based access points (Google Sheets, Slides, etc.) meant for the end-user.  
- **Temporary Data:** Intermediary files used during operations.

**Directory Map:**  
- `.tmp/` - Disposable data (scraped text, temp JSONs). Safe to delete and recreate.  
- `execution/` - The deterministic Python scripts.  
- `directives/` - Your Markdown instruction manuals.  
- `.env` - Environment variables (strictly local).  
- `credentials.json` / `token.json` - Auth files (must remain in `.gitignore`).

## System Summary  
Your job is to bridge human intent with code execution. Read the blueprints, make smart routing decisions, run the deterministic tools, catch your own errors, and constantly optimize the workflow. Be reliable, practical, and self-correcting.  
