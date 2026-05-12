Temas:
 - Algoritmos Ambiciosos

# Dungeon Adventure — Mochila da Fortuna

**Conteúdo da Disciplina**: Algoritmos Ambiciosos (Greedy)<br>

## Alunos

| Matrícula  | Aluno                     |
| ---------- | ------------------------- |
| 232014638  | Caio Soares de Andrade    |
| 231011408  | Guilherme Flyan Araujo    |

## Sobre

O **Dungeon Adventure** é uma aplicação web interativa e pedagógica que demonstra o funcionamento do **algoritmo ambicioso da Mochila Fracionária (Fractional Knapsack)**. O jogador assume o papel de um aventureiro que encontra 9 relíquias mágicas em uma dungeon e precisa escolher quais levar em sua mochila de **74 kg** de capacidade, maximizando o valor total.

## Screenshots

Adicione capturas de tela da aplicação aqui.

## Instalação

**Linguagem**: TypeScript<br>
**Framework**: Next.js 16 (App Router)<br>
**Estilização**: Tailwind CSS 4<br>
**Pré-Requisitos**: Node.js v20+<br>

### Como rodar localmente

```bash
# 1. clone o repositório
git clone https://github.com/projeto-de-algoritmos-2026/G7_Greed_PA-26.1-Dungeon-Adventure.git

# 2. entre na pasta do projeto
cd G7_Greed_PA-26.1-Dungeon-Adventure

# 3. instale as dependências
npm install

# 4. inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em **http://localhost:3000**.

## Uso

Ao abrir a aplicação:

1. Na **tela inicial**, o personagem apresenta a história. Clique no botão para avançar.
2. Na **galeria de relíquias**, veja todos os 9 itens disponíveis. Clique no botão para continuar.
3. Na **tela de escolha**, selecione o algoritmo **Knapsack** (as outras opções ficam em vermelho indicando que estão erradas). Após selecionar corretamente, o botão de avançar aparece.
4. Na **tela de execução**, clique em **INICIAR** e depois em **PRÓXIMO PASSO** para ver cada decisão do algoritmo ambicioso em tempo real. Uma barra de progresso mostra a capacidade sendo preenchida e a fortuna sendo acumulada.
5. Ao final, a **tela de resultado** exibe a mochila completa com todos os itens selecionados e o valor total obtido.

## Estrutura do Projeto

```
├── app/
│   ├── api/
│   │   ├── knapsack/route.ts    # rota POST que executa o algoritmo
│   │   └── relics/route.ts      # rota GET que retorna as relíquias
│   ├── items/
│   │   ├── page.tsx             # galeria de relíquias
│   │   └── choose/
│   │       ├── page.tsx         # quiz de escolha do algoritmo
│   │       └── hit/
│   │           └── page.tsx     # execução passo a passo + resultado
│   ├── lib/
│   │   ├── types.ts             # interfaces (Relic, RelicAllocation, GreedyStep, KnapsackResponse)
│   │   ├── relics.ts            # dados das 9 relíquias e funções de consulta
│   │   └── knapsack.ts          # implementação do Fractional Knapsack (greedy)
│   ├── layout.tsx               # layout global com fonte pixel-art (Press Start 2P)
│   ├── page.tsx                 # tela de introdução
│   └── globals.css              # estilos globais
├── components/
│   ├── history.tsx              # componente da tela de introdução
│   └── items.tsx                # componente da galeria de relíquias
├── public/
│   ├── items/                   # assets visuais das relíquias (PNG)
│   ├── background-better.avif  # imagem de fundo da aplicação
│   ├── character.png            # personagem da tela inicial
│   ├── message.png              # balão de mensagem da introdução
│   └── next-button.png          # botão de avançar estilizado
└── package.json
```

## Outros

O projeto **não utiliza backend separado** — toda a lógica do algoritmo roda nas API Routes do Next.js (server-side), mantendo a arquitetura unificada em um único framework.

A interface utiliza a fonte **Press Start 2P** para criar uma estética pixel-art/retro de RPG, complementada por assets ilustrados das relíquias.
