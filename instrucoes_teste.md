# Instruções de Teste - Sistema de Clínica Médica

## Como Executar o Sistema

### 1. Iniciar o Backend (Flask)

```bash
cd clinica-api
source venv/bin/activate
python src/main.py
```

O backend estará rodando em: `http://localhost:8080`

### 2. Iniciar o Frontend (React)

Em outro terminal:

```bash
cd clinica-frontend
npm run dev -- --host
```

O frontend estará rodando em: `http://localhost:5173`

## Como Testar as Funcionalidades

### Teste 1: Cadastrar Paciente

1. Abra o navegador em `http://localhost:5173`
2. Clique na aba "Pacientes" (já selecionada por padrão)
3. Clique no botão "Novo Paciente"
4. Preencha:
   - Nome: "João Silva"
   - CPF: "123.456.789-00"
5. Clique em "Salvar"
6. ✅ Verifique se o paciente aparece na tabela

### Teste 2: Cadastrar Médico

1. Clique na aba "Médicos"
2. Clique no botão "Novo Médico"
3. Preencha:
   - Nome: "Dr. Carlos Oliveira"
   - Especialidade: "Cardiologia"
4. Clique em "Salvar"
5. ✅ Verifique se o médico aparece na tabela

### Teste 3: Agendar Consulta

1. Clique na aba "Consultas"
2. Clique no botão "Nova Consulta"
3. Selecione:
   - Paciente: "João Silva"
   - Médico: "Dr. Carlos Oliveira"
   - Data/Hora: Escolha uma data futura
4. Clique em "Salvar"
5. ✅ Verifique se a consulta aparece na tabela com os nomes corretos

### Teste 4: Editar Paciente

1. Na aba "Pacientes", clique no botão "Editar" (ícone de lápis)
2. Altere o nome para "João Silva Santos"
3. Clique em "Salvar"
4. ✅ Verifique se o nome foi atualizado na tabela

### Teste 5: Tentar Cadastrar CPF Duplicado

1. Tente criar outro paciente com o mesmo CPF "123.456.789-00"
2. ✅ Verifique se o sistema rejeita e mostra erro no console

### Teste 6: Deletar Registros

1. Tente deletar o paciente que tem consulta agendada
2. ✅ Verifique se o sistema impede a exclusão
3. Delete primeiro a consulta, depois o paciente
4. ✅ Verifique se a exclusão funciona corretamente

## Testes da API (Opcional)

### Testar com curl

```bash
# Listar pacientes
curl http://localhost:8080/api/pacientes

# Criar paciente
curl -X POST http://localhost:8080/api/pacientes \
  -H "Content-Type: application/json" \
  -d '{"nome": "Maria Santos", "cpf": "987.654.321-00"}'

# Listar médicos
curl http://localhost:8080/api/medicos

# Criar médico
curl -X POST http://localhost:8080/api/medicos \
  -H "Content-Type: application/json" \
  -d '{"nome": "Dra. Ana Ferreira", "especialidade": "Pediatria"}'
```

## Verificações de Funcionamento

### ✅ Backend Funcionando
- [ ] Servidor Flask iniciado sem erros
- [ ] Endpoints respondem com JSON
- [ ] Banco SQLite criado em `src/database/app.db`

### ✅ Frontend Funcionando
- [ ] Interface carrega sem erros
- [ ] Navegação entre abas funciona
- [ ] Formulários abrem e fecham
- [ ] Dados são exibidos nas tabelas

### ✅ Integração Funcionando
- [ ] Dados criados no frontend aparecem na API
- [ ] Atualizações são refletidas em tempo real
- [ ] Validações funcionam corretamente

## Solução de Problemas

### Erro de CORS
Se aparecer erro de CORS no console:
1. Verifique se Flask-CORS está instalado
2. Reinicie o backend

### Erro "Failed to fetch"
Se o frontend não conseguir conectar:
1. Verifique se o backend está rodando na porta 8080
2. Confirme a URL da API no código do frontend

### Erro de Banco de Dados
Se houver erro de SQLite:
1. Delete o arquivo `src/database/app.db`
2. Reinicie o backend para recriar o banco

### Erro de Dependências
Se módulos não forem encontrados:
- Backend: Ative o ambiente virtual (`source venv/bin/activate`)
- Frontend: Execute `npm install` novamente

## Estrutura dos Arquivos

```
clinica-api/                 # Backend Flask
├── src/
│   ├── main.py             # Arquivo principal
│   ├── models/models.py    # Modelos de dados
│   ├── routes/             # Rotas da API
│   └── database/app.db     # Banco SQLite
└── venv/                   # Ambiente virtual

clinica-frontend/           # Frontend React
├── src/
│   ├── App.jsx            # Componente principal
│   └── main.jsx           # Ponto de entrada
└── dist/                  # Build de produção
```

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/pacientes` | Listar pacientes |
| POST | `/api/pacientes` | Criar paciente |
| PUT | `/api/pacientes/{id}` | Atualizar paciente |
| DELETE | `/api/pacientes/{id}` | Deletar paciente |
| GET | `/api/medicos` | Listar médicos |
| POST | `/api/medicos` | Criar médico |
| PUT | `/api/medicos/{id}` | Atualizar médico |
| DELETE | `/api/medicos/{id}` | Deletar médico |
| GET | `/api/consultas` | Listar consultas |
| POST | `/api/consultas` | Criar consulta |
| PUT | `/api/consultas/{id}` | Atualizar consulta |
| DELETE | `/api/consultas/{id}` | Deletar consulta |

---

**Dica**: Mantenha ambos os servidores (backend e frontend) rodando em terminais separados durante os testes.

