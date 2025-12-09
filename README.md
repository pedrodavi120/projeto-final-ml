# **Sentinela 🏥 \- Sistema de Inteligência Artificial para Gestão Hospitalar**

Trabalho Final de Aprendizado de Máquina (Machine Learning)  
Aluno: Pedro Davi  
Universidade Federal do Rio Grande do Norte (UFRN) \- 2025.1

## **🎯 Sobre o Projeto**

O **Sentinela** é uma suíte de Inteligência Artificial desenvolvida para resolver dois gargalos críticos da medicina moderna: a triagem de emergência reativa e a falta de gestão preventiva de saúde populacional.

O sistema opera sob uma arquitetura híbrida, onde o treinamento pesado ocorre em Python (Cloud) e a inferência crítica roda no cliente (Edge AI), garantindo latência zero para decisões de vida ou morte.

### **🔗 [CLIQUE AQUI PARA ACESSAR O NOTEBOOK (GOOGLE COLAB)](https://colab.research.google.com/drive/1KaeF__wFFtAcT4lj_4I0a0aFupJza4E6?usp=sharing)**

## **🚀 Módulos do Sistema**

### **1\. Módulo de Triagem Inteligente (Supervisionado)**

Focado na sala de emergência, este módulo prevê o risco de deterioração clínica (Sepse/UTI) em tempo real.

* **Algoritmo:** Gradient Boosting Classifier.  
* **Target:** Necessidade de UTI em \<24h.  
* **Destaque Técnico:** Otimizado via *GridSearch* para maximizar o **Recall** (98%), garantindo que casos graves não sejam liberados erroneamente (minimização de Falsos Negativos).  
* **Features:** Saturação (SpO2), Frequência Cardíaca, Pressão Arterial, Temperatura, Idade.

### **2\. Módulo de Saúde Populacional (Não Supervisionado)**

Focado na gestão hospitalar, este módulo segmenta a base de pacientes para identificar perfis de risco ocultos.

* **Algoritmo:** K-Means Clustering.  
* **Metodologia:** Definição de K=3 via *Elbow Method* (Método do Cotovelo) e validação via *Silhouette Score* (0.74).  
* **Grupos Identificados:**  
  1. 🟢 **Baixo Risco:** Jovens saudáveis (Monitoramento anual).  
  2. 🟠 **Pré-Diabéticos:** Meia-idade com glicemia limítrofe (Foco da prevenção).  
  3. 🟣 **Crônicos Complexos:** Idosos hipertensos (Home Care).

## **🛠️ Arquitetura da Solução**

O projeto segue uma arquitetura moderna de **Edge AI**:

1. **Treinamento (Python/Colab):** Os modelos são treinados, validados e otimizados em ambiente Python utilizando scikit-learn e pandas. As regras de decisão e centroides são extraídos.  
2. **Motor de Inferência (React/JS):** A lógica da árvore de decisão (Gradient Boosting) e os clusters foram portados para JavaScript. Isso permite que o App funcione **offline** e com **latência de milissegundos**, essencial para ambientes hospitalares.  
3. **Interface (Frontend):** Desenvolvida em React com TailwindCSS para estilização "MedTech" e Recharts para visualização de dados.

## **💻 Como Rodar o Projeto Localmente**

### **Pré-requisitos**

* Node.js (v16 ou superior)  
* NPM ou Yarn

### **Instalação**

1. Clone o repositório:  
   git clone \[https://github.com/pedrodavi120/projeto-final-ml.git\](https://github.com/pedrodavi120/projeto-final-ml.git)  
   cd projeto-final-ml

2. Instale as dependências:  
   npm install

3. Execute a aplicação:  
   npm run dev

4. Acesse no navegador:  
   http://localhost:5173

## **📊 Estrutura de Arquivos**

sentinela/  
├── src/  
│   ├── App.jsx           \# Código Principal (Motor de IA e UI)  
│   ├── main.jsx          \# Ponto de entrada React  
│   └── index.css         \# Estilos globais (Tailwind)  
├── notebooks/  
│   └── sentinela\_ml\_training.ipynb  \# Código de treinamento Python  
├── public/               \# Assets estáticos  
├── package.json          \# Dependências do projeto  
└── README.md             \# Documentação

## **🧪 Resultados e Métricas**

| Métrica | Valor | Descrição |
| :---- | :---- | :---- |
| **Recall (Triagem)** | **98%** | Capacidade de detectar pacientes críticos. |
| **AUC-ROC** | **0.92** | Área sob a curva de operação do receptor. |
| **Silhouette Score** | **0.74** | Coesão dos clusters de pacientes. |
| **Latência** | **45ms** | Tempo de resposta do App (Edge AI). |

## **👨‍💻 Autor**

**Pedro Davi**

* UFRN \- Universidade Federal do Rio Grande do Norte  
* Curso: Tecnologia em Análise e Desenvolvimento de Sistemas (TADS)  
* Disciplina: Aprendizado de Máquina

*Projeto desenvolvido para fins acadêmicos. Os dados utilizados são sintéticos, gerados com base em distribuições fisiológicas reais.*