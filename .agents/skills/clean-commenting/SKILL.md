---
name: clean-commenting
description: Enforces minimal, clean, and developer-friendly code comments without bulky ASCII boxes or decorative banners.
---

# Clean & Minimal Code Commenting Standards

## Core Principles

1. **No Bulky ASCII Banners**:
   - Never use ASCII box drawings (`╔`, `═`, `║`, `╚`, `┌`, `─`, `└`), ASCII art, or multi-line decorative borders.
   - Avoid oversized comment blocks that add visual noise without providing semantic value.

2. **Concise & Meaningful**:
   - Write short, clear comments that explain *why* something is done, rather than just restating obvious code.
   - Use standard single-line `//` comments for section dividers, shader layer explanations, mathematical formulas, and non-trivial state logic.

3. **Examples**:

   ❌ **Bad (Bulky / Noisy)**:
   ```typescript
   // ╔════════════════════════════════════════════════════════════════════════════╗
   // ║  CONFIGURATION — Campus Event Theme                                      ║
   // ╚════════════════════════════════════════════════════════════════════════════╝
   ```

   ✅ **Good (Minimal & Clear)**:
   ```typescript
   // Visual configuration for 3D canvas and particle layers
   ```

   ❌ **Bad (Bulky Separator)**:
   ```typescript
   // ════════════════════════════════════════════════════════════════════════
   // LAYER 1: ANIMATED GRADIENT BACKGROUND
   // ════════════════════════════════════════════════════════════════════════
   ```

   ✅ **Good (Minimal Separator)**:
   ```typescript
   // Layer 1: Animated gradient background plane
   ```
