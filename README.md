# 🎙️ Prompter (FlexNotes)

O **Prompter (FlexNotes)** é um aplicativo mobile desenvolvido para facilitar a vida de **criadores de conteúdo** e **estudantes**. Ele permite a criação de notas rápidas por meio de **reconhecimento de voz** e transforma essas anotações instantaneamente em um **Teleprompter**, com rolagem automática e controle de velocidade.

O objetivo principal deste projeto foi aprofundar o estudo do ecossistema **React Native**, saindo do uso básico do Expo Go para a exploração de **Native Modules** e uma pipeline de build profissional com **EAS Build**.

---

## ✨ Funcionalidades

* 🎤 **Voz para Texto**
  Captação de áudio em tempo real utilizando APIs nativas de reconhecimento de voz.

* 📝 **Editor Dinâmico**
  Interface simples para edição, organização e gerenciamento de cards de texto.

* 📜 **Modo Teleprompter**

  * Fundo de alto contraste para melhor legibilidade
  * Texto em escala ampliada
  * Rolagem automática controlada por timer
  * Ajuste de velocidade em tempo real

* 💾 **Persistência Local**
  Salvamento automático das notas no dispositivo, permitindo acesso **offline**.

---

## 🛠️ Tecnologias Utilizadas

* **React Native** — Framework principal
* **Expo** — Ambiente de desenvolvimento
* **Expo Speech Recognition** — Módulo nativo para reconhecimento de voz
* **React Navigation** — Navegação entre telas
* **EAS Build** — CI/CD para geração de binários Android na nuvem
* **AsyncStorage** — Persistência de dados local

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

* **Node.js** (versão LTS recomendada)
* **EAS CLI** instalado globalmente

  ```bash
  npm install -g eas-cli
  ```
* Conta gratuita no [Expo.dev](https://expo.dev)

---

### Passo a Passo

1. **Clone o repositório**

   ```bash
   git clone https://github.com/seu-usuario/prompter.git
   cd prompter
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Login no Expo**

   ```bash
   eas login
   ```

4. **Desenvolvimento (Modo Nativo)**
   Como o app utiliza reconhecimento de voz nativo, ele **não funciona no Expo Go** disponível na Play Store.

   Para testar durante o desenvolvimento, crie um **Development Build**:

   ```bash
   eas build --profile development --platform android
   ```

---

## 📦 Como Gerar o App (.apk)

Este projeto utiliza o **EAS (Expo Application Services)** para compilar o aplicativo na nuvem, sem a necessidade de configurar o Android Studio localmente.

Para gerar um **APK de teste**:

```bash
eas build -p android --profile preview
```

> **Nota:** Após o término do build, o terminal fornecerá um link para download do arquivo `.apk`. Basta baixar e instalar em qualquer dispositivo Android.

---

## 🧠 Aprendizados Técnicos

Este projeto foi essencial para consolidar conceitos importantes no desenvolvimento mobile moderno:

* **Native Modules**
  Uso de módulos nativos (expo-speech-recognition) e gerenciamento de permissões de hardware no Android.

* **Build Pipeline (CI/CD)**
  Configuração de perfis no `eas.json` para automação de builds e geração de artefatos na nuvem.

* **Performance de UI**
  Gerenciamento de timers e referências (`useRef`) para garantir uma rolagem de texto fluida no modo Teleprompter, evitando re-renderizações desnecessárias.

* **Arquitetura Local-First**
  Foco na experiência offline, garantindo persistência dos dados mesmo após o fechamento do aplicativo.


🚀 Desenvolvido com foco em aprendizado, performance e experiência do usuário.
