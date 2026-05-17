import type { Language } from '../hooks/useLanguage'

/**
 * Demo paragraphs — one per language — ref: spritz-reader.plan.md §10, spec US-06
 * Each paragraph contains varied word lengths (1–18+ chars) to showcase the ORP algorithm.
 */
export const DEMO_TEXTS: Record<Language, string> = {
  en: `Speed reading is a fascinating skill that allows you to absorb information faster than you ever thought possible. By training your eyes to focus on the optimal recognition point of each word, your brain processes text at remarkable speed. This technique eliminates unnecessary eye movements and dramatically increases comprehension. With consistent practice, readers achieve extraordinary results at higher words-per-minute rates without sacrificing understanding.

The human brain is remarkably adaptable. When you remove the habit of subvocalising — silently pronouncing each word as you read — your processing speed can increase dramatically. Most people read between 200 and 300 words per minute using traditional methods. Speed readers regularly surpass 500 words per minute while maintaining strong comprehension levels.

Scientific research suggests that focused, deliberate practice of just fifteen minutes a day can yield measurable improvements within two weeks. The key is consistency. Start at a comfortable pace, gradually increase the speed, and let your brain build new neural pathways for rapid text recognition. Over time, what once felt impossibly fast becomes your new normal.`,

  ca: `La lectura ràpida és una habilitat fascinant que et permet absorbir informació molt més de pressa del que mai hauries imaginat. En entrenar els ulls per enfocar-se al punt òptim de reconeixement de cada paraula, el cervell processa el text a una velocitat extraordinària. Aquesta tècnica elimina els moviments oculars innecessaris i augmenta considerablement la comprensió lectora. Amb pràctica constant, els lectors assoleixen resultats sorprenents a velocitats elevades.

El cervell humà és extraordinàriament adaptable. Quan elimines el costum de subvocalitzar — pronunciar interiorment cada paraula mentre llegeixes — la velocitat de processament pot augmentar de forma notable. La majoria de persones llegeix entre 200 i 300 paraules per minut amb els mètodes tradicionals. Els lectors ràpids sovint superen les 500 paraules per minut mantenint uns nivells de comprensió molt elevats.

La recerca científica suggereix que una pràctica enfocada de només quinze minuts al dia pot produir millores mesurables en tan sols dues setmanes. La clau és la constància. Comença a un ritme còmode, augmenta gradualment la velocitat i deixa que el teu cervell construeixi nous camins neuronals per al reconeixement ràpid del text. Amb el temps, allò que semblava impossiblement ràpid es converteix en la teva nova normalitat.`,

  es: `La lectura rápida es una habilidad fascinante que te permite absorber información mucho más rápido de lo que jamás hubieras imaginado. Al entrenar tus ojos para enfocarse en el punto óptimo de reconocimiento de cada palabra, tu cerebro procesa el texto a una velocidad extraordinaria. Esta técnica elimina los movimientos oculares innecesarios y aumenta considerablemente la comprensión lectora. Con práctica constante, los lectores alcanzan resultados sorprendentes a velocidades elevadas.

El cerebro humano es extraordinariamente adaptable. Cuando eliminas el hábito de subvocalizar — pronunciar interiormente cada palabra mientras lees — la velocidad de procesamiento puede aumentar de forma notable. La mayoría de personas lee entre 200 y 300 palabras por minuto con los métodos tradicionales. Los lectores rápidos suelen superar las 500 palabras por minuto manteniendo niveles de comprensión muy elevados.

La investigación científica sugiere que una práctica enfocada de tan solo quince minutos al día puede producir mejoras medibles en apenas dos semanas. La clave es la constancia. Empieza a un ritmo cómodo, aumenta gradualmente la velocidad y deja que tu cerebro construya nuevos caminos neuronales para el reconocimiento rápido del texto. Con el tiempo, lo que antes parecía imposiblemente rápido se convierte en tu nueva normalidad.`,
}
;
