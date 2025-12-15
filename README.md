# Taller 3 – Ingeniería de Datos

> Universidad de La Frontera
> Estudiante: **Cristóbal Cheuquel**

---

## 📌 Introducción

Este proyecto se basa en el conjunto de datos **World Happiness 2015–2024**, una recopilación de métricas de bienestar global provenientes del *World Happiness Report*, elaborado por la Red de Soluciones para el Desarrollo Sostenible de las Naciones Unidas (UN SDSN).

El dataset ofrece tanto una **visión transversal** de la felicidad a nivel mundial como una **mirada longitudinal** de una década completa, lo que permite analizar cómo ha evolucionado la percepción de la calidad de vida frente a fenómenos como crisis económicas, cambios geopolíticos y la pandemia.

El objetivo principal es construir un **resumen ejecutivo interactivo**, capaz de responder de forma clara e intuitiva preguntas como:

* ¿Qué países son más felices?
* ¿Cómo evoluciona la felicidad a lo largo del tiempo?
* ¿Qué factores se asocian con mayores niveles de bienestar?

---

## 📊 Dataset y variables principales

El dataset consolida información de más de **150 países** a lo largo de **10 años**, incorporando una serie de factores comúnmente asociados al bienestar:

* **PIB per cápita (Economía):** poder adquisitivo ajustado.
* **Apoyo social:** percepción de redes de apoyo.
* **Esperanza de vida saludable:** indicadores de salud física y mental.
* **Libertad para tomar decisiones:** autonomía personal y derechos civiles.
* **Generosidad:** participación cívica y filantropía.
* **Percepción de la corrupción:** confianza en instituciones públicas.
* **Otros indicadores complementarios** incluidos en el archivo `world_happiness_combined.csv`.

La variable objetivo del análisis es **`happiness_score`**, que representa la autoevaluación promedio del bienestar en cada país y año.

---

## 🔍 Metodología de análisis (EDA)

Se realizó un **Exploratory Data Analysis (EDA)** utilizando **Python**, apoyado principalmente en las librerías **Pandas**, **Seaborn** y **Matplotlib**, con el fin de comprender la distribución de los datos y la relación entre variables.

Las principales etapas fueron:

* Construcción de **matrices de correlación por año**, para identificar qué factores se asocian más fuertemente con el `happiness_score`.
* Análisis de la **evolución temporal de las correlaciones**, observando la estabilidad o cambio en la importancia relativa de cada variable a lo largo del tiempo.

Ejemplo de visualizaciones incluidas en el proyecto:

* Matriz de correlación anual.
* Evolución temporal de las correlaciones respecto al `happiness_score`.

De manera consistente, variables como **PIB per cápita**, **apoyo social** y **esperanza de vida saludable** aparecen entre las más correlacionadas con los niveles de felicidad reportados.

Para más detalles sobre el análisis, se puede consultar el archivo en el repositorio de GitLab: https://gitlab.com/universidad3163351/iDatos/idatos-eda

---

## 📈 Resultados principales

Como resultado del análisis se desarrolló una **aplicación web interactiva** que integra:

* Un **reporte de Power BI** embebido.
* Indicadores dinámicos de:

  * Puntuación promedio de felicidad por año.
  * **Top 5 países** con mayor felicidad por año.
  * Puntuación promedio por **región**, ordenada temporalmente.
  * Evolución global del puntaje de felicidad anual.

La plataforma permite además la **descarga en PDF** tanto del reporte generado por la aplicación como del informe de Power BI.

Entre los resultados destacados, se observa que países como **Finlandia** se mantienen consistentemente en los primeros lugares del ranking, con puntuaciones cercanas o superiores a **7.4** durante la mayor parte del período analizado.

---

## 🧰 Stack tecnológico

El proyecto utiliza un stack moderno orientado a aplicaciones web de datos:

* **Framework web:** [Next.js](https://nextjs.org/) (React).
* **Base de datos:** PostgreSQL, gestionada mediante **Supabase**.
* **Despliegue:** [Vercel](https://vercel.com/) (arquitectura serverless).
* **Analítica y reportes:** [Power BI](https://powerbi.microsoft.com/).

Este stack permite un despliegue continuo, manejo de datos en la nube y una experiencia de usuario fluida e interactiva.

---

## 🚀 Demo y replicabilidad

La aplicación se encuentra desplegada en producción en:

👉 **[https://taller3-i-datos.vercel.app/](https://taller3-i-datos.vercel.app/)**

### Replicar el proyecto

Para reproducir el entorno:

1. **Descargar el dataset** desde Kaggle:
   *World Happiness (2015–2024)*, archivo `world_happiness_combined.csv`.

2. **Crear un proyecto en Supabase** y una tabla llamada `world_happiness`, importando el CSV.

3. **Configurar un proyecto en Vercel** para el despliegue de la aplicación Next.js.

> Todas las plataformas utilizadas cuentan con planes gratuitos suficientes para replicar el proyecto.

---

## ⚙️ Requisitos previos

Antes de ejecutar o desplegar la aplicación, se requiere:

* **Cuenta en Supabase**:

  * Crear un proyecto.
  * Crear la tabla `world_happiness`.
  * Importar el archivo `world_happiness_combined.csv`.

* **Cuenta en Vercel**:

  * Crear un proyecto.
  * Obtener los identificadores `VERCEL_PROJECT_ID` y `VERCEL_ORG_ID`.

---

## 🔐 Fork y variables de entorno

1. Realiza un **fork** de este repositorio en GitHub.

2. Configura las siguientes **variables de entorno** (GitHub Actions o entorno local):

### Supabase

* `NEXT_PUBLIC_SUPABASE_URL`
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Vercel

* `VERCEL_ORG_ID`
* `VERCEL_PROJECT_ID`
* `VERCEL_TOKEN`

Con estas variables configuradas, los flujos de **CI/CD** permitirán desplegar automáticamente la aplicación en Vercel y conectar la API con Supabase.
