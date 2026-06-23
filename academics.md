# Vorgehensweise bei academics (PM Interview Frage)

**Frage:** *"Wie würdest du ein Feature wie MatchLens bei uns (academics) umsetzen, wenn du unseren Tech-Stack noch nicht kennst?"*

Das ist eine typische strategische PM-Frage. Es geht nicht darum, den Stack zu erraten, sondern zu zeigen, **wie du strategisch denkst**, **mit Unsicherheit umgehst** und **cross-funktional arbeitest**.

Hier ist ein strukturierter Ansatz für deine Antwort:

## 1. Discovery & Das "Warum" validieren
*Bevor wir über die technische Umsetzung nachdenken, würde ich zuerst sicherstellen, dass wir das Problem im Kontext von academics richtig verstehen.*
*   **Nutzerbedürfnis:** Löst ein semantisches Matching das größte aktuelle Problem unserer Nutzer? Geht es darum, dass Kandidaten keine passenden Stellen finden, oder dass Institute zu viele unpassende Bewerbungen bekommen?
*   **Business Goal:** Wollen wir damit die Conversion Rate (mehr Bewerbungen) oder die Qualität der Bewerbungen erhöhen?

## 2. Status Quo & Tech-Alignment (Die Brücke zum Engineering)
*Da ich euren Tech-Stack aktuell nicht kenne, wäre mein nächster Schritt ein Deep Dive mit dem Engineering Lead oder CTO.*
*   **Architektur verstehen:** "Wie ist academics aktuell aufgebaut? Haben wir einen Monolithen oder Microservices? Wo liegen die Nutzerprofile und Jobdaten?"
*   **API-First Ansatz:** Mein Vorschlag wäre, die Kern-Logik (das KI-Matching) als eigenständigen Service oder als API zu bauen. So sind wir unabhängig vom Frontend-Stack von academics. Das Frontend kann dann einfach diese "Matching-API" ansprechen.
*   **Build vs. Buy / LLM-Auswahl:** Ich würde mit dem Tech-Team diskutieren, ob wir eine externe API (wie OpenAI oder Gemini) nutzen können, oder ob wir aus Datenschutzgründen ein Open-Source-Modell selbst hosten müssen.

## 3. Der MVP-Ansatz (Risikominimierung)
*Ich bin ein großer Fan davon, Annahmen schnell zu testen, ohne das Kernsystem zu gefährden. Wir würden MatchLens nicht sofort global für alle Nutzer ausrollen.*
*   **Idee 1: Interner Rollout (B2B):** Wir geben das Matching-Tool zuerst nur unseren eigenen Kundenbetreuern oder den HR-Abteilungen der Institute, um die Qualität der Matches zu validieren.
*   **Idee 2: Opt-In Beta (B2C):** Wir bieten das "KI-gestützte Matching" als Beta-Feature für einen kleinen Prozentsatz (z.B. 5%) der Kandidaten an.
*   **Technischer MVP:** Für diesen Test könnten wir tatsächlich einen Stack wie Next.js nutzen, um eine kleine, autarke Applikation ("Sidecar") zu bauen, die über APIs mit der academics-Datenbank kommuniziert, ohne den Haupt-Code anfassen zu müssen.

## 4. Datenschutz & Compliance (Der Joker in Deutschland)
*Besonders bei akademischen und beruflichen Lebensläufen in Deutschland ist Datenschutz ein K.-o.-Kriterium.*
*   Ich würde von Tag 1 den Datenschutzbeauftragten (Legal) einbinden.
*   Bevor wir Lebensläufe an eine KI-API senden, müssen wir klären: Werden die Daten zum Training der Modelle genutzt? Wo stehen die Server?

## 5. Erfolgsmessung (A/B Testing)
*Letztendlich entscheidet der Nutzer, ob das System gut ist.*
*   Wir würden das neue semantische Matching in einem A/B-Test gegen die aktuelle, klassische Suchfunktion von academics laufen lassen.
*   **KPIs:** Steigt die Klickrate auf Job-Vorschläge? Steigt die Bewerbungsrate? Bekommen wir besseres Feedback von den rekrutierenden Instituten (z.B. Interview-Einladungs-Rate)?

---

## Dein Elevator Pitch für das Interview:

> *"Da ich euren aktuellen Tech-Stack nicht kenne, würde ich einen API-First- und MVP-Ansatz wählen. Ich würde mich eng mit dem Engineering Lead abstimmen, um die Matching-Engine als separaten, kleinen Service zu bauen, der eure bestehenden Datenbanken über APIs anbindet. So blockieren wir nicht die Entwicklung des Kernprodukts. Gleichzeitig würde ich von Beginn an Legal wegen der KI-Datenschutzthemen einbinden und das Feature zunächst nur als A/B-Test für 5% der Nutzer ausrollen, um zu messen, ob die KI wirklich bessere Bewerbungen generiert als die klassische Suche."*
