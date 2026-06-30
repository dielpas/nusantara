<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Development Guide (Next.js)
This guide provides architectural considerations for building AI-assisted features in Next.js. Accessibility is treated as a foundational requirement, not a feature, to ensure compatibility with diverse user needs.
### 1. Core Principles (POUR)
When designing agentic workflows, consider how the output translates to the user experience:
 * **Perceivable:** Ensure all AI-generated content (including charts, images, and live updates) is accessible via screen readers or alternative text.
 * **Operable:** Build agent interactions that are fully keyboard-navigable. Never trap focus or force mouse-only interactions.
 * **Understandable:** Prioritize clear, concise, and predictable responses. Avoid jargon or non-literal text that may confuse users with cognitive disabilities.
 * **Robust:** Ensure the underlying DOM structure is semantic, allowing assistive technologies to interpret content reliably.
### 2. Implementation Strategies
Rather than prescriptive mandates, consider these patterns for your Next.js setup:
 * **Semantic UI:** Leverage standard HTML elements (<button>, <nav>, <main>) to convey proper roles and properties to browsers and assistive tools.
 * **Dynamic UI & Focus Management:** If an agent updates the DOM dynamically, manage focus shifts intentionally so users are not disoriented when the UI changes.
 * **Live Updates:** For real-time agent output, utilize aria-live regions or status messages so users are informed of updates without needing to move their focus manually.
 * **Input Handling:** If the agent processes user forms, ensure error identification and suggestions are intuitive, accessible, and provide clear paths for correction.
### 3. Verification & Quality Assurance
Accessibility is an ongoing process. Integrate verification into your workflow:
 * **Automated Testing:** Use tools like axe-core to catch common accessibility violations early in the development lifecycle.
 * **Manual Audits:** Automated tools are a baseline; supplement them with manual keyboard-only navigation tests to verify the true user flow.
 * **Consistent Patterning:** Maintain predictable navigation and identification for agentic elements across your application to lower cognitive barriers.
*Reference: This guide aligns with accessibility standards documented by WebAIM and Deque University.*