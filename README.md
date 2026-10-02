# WhattaDocs-platform 📖

## 📌 Il Contesto e la Sfida
La crescente proliferazione di documentazione tecnica nei contesti organizzativi complessi evidenzia i limiti dei tradizionali sistemi di *information retrieval*. I metodi convenzionali, basati prevalentemente su parole chiave e su una consultazione di tipo lineare, risultano inadeguati a sostenere processi cognitivi complessi quali la ricerca esplorativa e la costruzione di senso, specialmente laddove sia necessario ricomporre informazioni frammentate e superare barriere terminologiche specialistiche. Inoltre, le attuali soluzioni AI commerciali si presentano spesso come "black box" chiuse: prive di flessibilità, carenti nell'annotazione semantica e inadeguate rispetto ai rigorosi requisiti di governance e sicurezza tipici dell'ambito enterprise.

## 🚀 La Soluzione: WhattaDocs
Per rispondere a questa esigenza, lo spin-off dell'Università degli Studi di Milano **WhattaData** ha ideato **WhattaDocs**: un assistente conversazionale documentale progettato per ridefinire i paradigmi di elaborazione dei documenti. 

Il sistema combina un'architettura **RAG (Retrieval-Augmented Generation)** con un'interfaccia pensata per permettere agli utenti di:
* Interagire in linguaggio naturale direttamente con il proprio patrimonio informativo caricato.
* Creare nuovi progetti e collegarli a file e cartelle da analizzare.
* Monitorare le statistiche di utilizzo della piattaforma.

*Nota sul perimetro del progetto: La roadmap globale di WhattaDocs prevede lo sviluppo di numerosi ulteriori requisiti e funzionalità avanzate, estendendo ampiamente l'attuale perimetro dell'applicativo e le specifiche integrazioni descritte in questo documento.*

## 👤 Il Mio Ruolo e Contributo (UX/UI & Front-end)
Il mio intervento si è concentrato sulla **riprogettazione della prima versione dell'interfaccia** e sull'espansione della piattaforma con nuove funzionalità chiave, tra cui:
* **Gestione Team e Governance:** Una dashboard per creare gruppi di lavoro, definire ruoli di accesso specifici e filtrare i membri.
* **Modelli AI Personalizzati:** Un'area dedicata all'addestramento e alla creazione di modelli AI basati su tassonomie caricate direttamente dall'utente.

## 🛠 Metodologia e Sviluppo
Il processo di riprogettazione ha seguito un rigoroso framework di UX Design, traducendo gli obiettivi di business e le evidenze della ricerca qualitativa in un'architettura dell'informazione strutturata.

* **Prototipazione e Testing:** I prototipi sono stati realizzati in **Figma** (progettati esclusivamente per una risoluzione desktop target di **1920px**) e validati attraverso sessioni di testing qualitativo **Think Aloud** su profili enterprise e specialistici. Questo ha permesso di identificare e risolvere tempestivamente attriti di usabilità.
* **Sviluppo React e Supabase (Contenuto del Repository):** Oltre alla fase di design, ho curato lo sviluppo front-end per mettere in pratica le competenze acquisite. **Il codice ospitato in questo repository contiene l'implementazione in React della pagina dedicata alla gestione del patrimonio informativo**. L'applicativo integra **Supabase** per gestire attivamente il database, consentendo il caricamento, la modifica e la cancellazione delle risorse. Si precisa che la modellazione del database non è derivata da una fase di progettazione architetturale profonda, ma è stata volutamente limitata all'essenziale per supportare lo sviluppo front-end e l'esercizio tecnico.

## 🤍 Accessibilità (A11y)
L'intero sito ha subito interventi manuali rigorosi per garantire un livello base di accessibilità a tutti gli utenti, implementando le seguenti best practice:
* **Immagini con attributo *alt*:** Inserimento dell'attributo `alt` su tutti i contenuti visivi, affinché gli utenti che fanno uso di tecnologie assistive possano comprenderne il contesto.
* **Gerarchia Semantica HTML:** Uso gerarchico corretto dei tag di intestazione (`<h1>` - `<h6>`) e impiego semantico dei landmark HTML5 (es. `<header>`, `<main>`, `<footer>`).
* **Form Accessibili:** Collegamento esplicito tra i campi di input e le relative etichette (`<label>`).
* **Skip Links:** Inserimento di link per saltare direttamente al contenuto principale. Questo elemento, visibile unicamente alla ricezione del focus via tastiera, permette agli utenti di bypassare la barra di navigazione.
* **Attributi ARIA:** Integrazione degli attributi WAI-ARIA per far sì che le tecnologie assistive comprendano correttamente lo stato e il funzionamento dei componenti interattivi più complessi.
* **Navigabilità da Tastiera e Focus:** Tutti gli elementi interattivi (pulsanti, link, form) sono fruibili tramite i tasti `Tab`, `Enter` e `Space`, mantenendo sempre un indicatore visivo chiaro per lo stato di focus attivo sullo schermo.
