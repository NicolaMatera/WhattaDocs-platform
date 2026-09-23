# WhattaDocs-platform 📖

## 📌 The Context and the Challenge
The growing proliferation of technical documentation in complex organizational contexts highlights the limitations of traditional information retrieval systems. Conventional methods, based primarily on keywords and linear browsing, are inadequate to support complex cognitive processes such as exploratory search and sense-making, especially when it is necessary to reconstruct fragmented information and overcome specialized terminology barriers. Furthermore, current commercial AI solutions often present themselves as closed "black boxes": inflexible, lacking semantic annotation, and inadequate for the rigorous governance and security requirements typical of the enterprise and vertical sectors.

## 🚀 The Solution: WhattaDocs
To address this need, the University of Milan spin-off WhattaData has created WhattaDocs: a conversational document assistant designed to redefine document processing paradigms.

The system combines a Retrieval-Augmented Generation (RAG) architecture with an interface designed to allow users to:
* Interact directly with their uploaded information assets in natural language.
* Create new projects and link them to files and folders for analysis.
* Monitor platform usage statistics.

*Note on the Project Scope: The WhattaDocs global roadmap includes the development of numerous additional requirements and advanced features, significantly extending the current scope of the application and the specific integrations described in this document.*

## 👤 My Role and Contribution (UX/UI & Front-end)
My work focused on **redesigning the first version of the interface** and expanding the platform with new key features, including:
* **Team Management and Governance:** A dashboard for creating workgroups, defining specific access roles, and filtering members.
* **Custom AI Models:** A dedicated area for training and creating AI models based on taxonomies uploaded directly by the user.

## 🛠 Methodology and Development
The redesign process followed a rigorous UX Design framework, translating business objectives and qualitative research findings into a structured information architecture.

* **Prototyping and Testing:** The prototypes were created in **Figma** (designed exclusively for a target desktop resolution of **1920px**) and validated through **Think Aloud** qualitative testing sessions on enterprise and specialist profiles. This allowed us to promptly identify and resolve usability issues.
* **React and Supabase Development (Repository Content):** In addition to the design phase, I oversaw the front-end development to put the skills I acquired into practice. **The code hosted in this repository contains the React implementation of the page dedicated to managing information assets**. The application integrates **Supabase** to actively manage the database, allowing resources to be loaded, modified, and deleted. Please note that the database modeling was not derived from an in-depth architectural design phase, but was deliberately limited to the essentials to support front-end development and technical operations.

## 🤍 Accessibility
The entire site has undergone rigorous manual intervention to ensure a basic level of accessibility for all users, implementing the following best practices:
* **Images with *alt* attribute:** Insert the `alt` attribute on all visual content, so that users using assistive technologies can understand the context.
* **HTML Semantic Hierarchy:** Correct hierarchical use of heading tags (`<h1>` - `<h6>`) and semantic use of HTML5 landmarks (e.g., `<header>`, `<main>`, `<footer>`).
* **Accessible Forms:** Explicit linking between input fields and their labels (`<label>`).
* **Skip Links:** Insert links to jump directly to the main content. This element, visible only when keyboard focus is received, allows users to bypass the navigation bar.
* **ARIA Attributes:** Integration of WAI-ARIA attributes to ensure that assistive technologies correctly understand the state and operation of more complex interactive components.
* **Keyboard and Focus Navigation:** All interactive elements (buttons, links, forms) are accessible via the Tab, Enter, and Space keys, always maintaining a clear visual indicator of the active focus state on the screen.
