import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Trash2, Edit, Plus, Users, UserCheck, Calendar } from 'lucide-react'
import './App.css'

const API_BASE_URL = 'http://localhost:8080/api'

function App() {
  const [pacientes, setPacientes] = useState([])
  const [medicos, setMedicos] = useState([])
  const [consultas, setConsultas] = useState([])
  const [loading, setLoading] = useState(false)

  // Estados para formulários
  const [novoPaciente, setNovoPaciente] = useState({ nome: '', cpf: '' })
  const [novoMedico, setNovoMedico] = useState({ nome: '', especialidade: '' })
  const [novaConsulta, setNovaConsulta] = useState({ 
    pacienteId: '', 
    medicoId: '', 
    dataHora: '' 
  })

  // Estados para edição
  const [editandoPaciente, setEditandoPaciente] = useState(null)
  const [editandoMedico, setEditandoMedico] = useState(null)
  const [editandoConsulta, setEditandoConsulta] = useState(null)

  // Estados para diálogos
  const [dialogPacienteAberto, setDialogPacienteAberto] = useState(false)
  const [dialogMedicoAberto, setDialogMedicoAberto] = useState(false)
  const [dialogConsultaAberto, setDialogConsultaAberto] = useState(false)

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setLoading(true)
    try {
      await Promise.all([
        carregarPacientes(),
        carregarMedicos(),
        carregarConsultas()
      ])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const carregarPacientes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pacientes`)
      if (response.ok) {
        const data = await response.json()
        setPacientes(data)
      }
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error)
    }
  }

  const carregarMedicos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/medicos`)
      if (response.ok) {
        const data = await response.json()
        setMedicos(data)
      }
    } catch (error) {
      console.error('Erro ao carregar médicos:', error)
    }
  }

  const carregarConsultas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/consultas`)
      if (response.ok) {
        const data = await response.json()
        setConsultas(data)
      }
    } catch (error) {
      console.error('Erro ao carregar consultas:', error)
    }
  }

  // Funções para Pacientes
  const salvarPaciente = async () => {
    try {
      const url = editandoPaciente 
        ? `${API_BASE_URL}/pacientes/${editandoPaciente.id}`
        : `${API_BASE_URL}/pacientes`
      
      const method = editandoPaciente ? 'PUT' : 'POST'
      const dados = editandoPaciente || novoPaciente

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      })

      if (response.ok) {
        await carregarPacientes()
        setNovoPaciente({ nome: '', cpf: '' })
        setEditandoPaciente(null)
        setDialogPacienteAberto(false)
      }
    } catch (error) {
      console.error('Erro ao salvar paciente:', error)
    }
  }

  const deletarPaciente = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pacientes/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await carregarPacientes()
      }
    } catch (error) {
      console.error('Erro ao deletar paciente:', error)
    }
  }

  // Funções para Médicos
  const salvarMedico = async () => {
    try {
      const url = editandoMedico 
        ? `${API_BASE_URL}/medicos/${editandoMedico.id}`
        : `${API_BASE_URL}/medicos`
      
      const method = editandoMedico ? 'PUT' : 'POST'
      const dados = editandoMedico || novoMedico

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      })

      if (response.ok) {
        await carregarMedicos()
        setNovoMedico({ nome: '', especialidade: '' })
        setEditandoMedico(null)
        setDialogMedicoAberto(false)
      }
    } catch (error) {
      console.error('Erro ao salvar médico:', error)
    }
  }

  const deletarMedico = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/medicos/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await carregarMedicos()
      }
    } catch (error) {
      console.error('Erro ao deletar médico:', error)
    }
  }

  // Funções para Consultas
  const salvarConsulta = async () => {
    try {
      const url = editandoConsulta 
        ? `${API_BASE_URL}/consultas/${editandoConsulta.id}`
        : `${API_BASE_URL}/consultas`
      
      const method = editandoConsulta ? 'PUT' : 'POST'
      
      let dados
      if (editandoConsulta) {
        dados = {
          paciente: { id: parseInt(editandoConsulta.pacienteId) },
          medico: { id: parseInt(editandoConsulta.medicoId) },
          dataHora: new Date(editandoConsulta.dataHora).toISOString()
        }
      } else {
        dados = {
          paciente: { id: parseInt(novaConsulta.pacienteId) },
          medico: { id: parseInt(novaConsulta.medicoId) },
          dataHora: new Date(novaConsulta.dataHora).toISOString()
        }
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      })

      if (response.ok) {
        await carregarConsultas()
        setNovaConsulta({ pacienteId: '', medicoId: '', dataHora: '' })
        setEditandoConsulta(null)
        setDialogConsultaAberto(false)
      }
    } catch (error) {
      console.error('Erro ao salvar consulta:', error)
    }
  }

  const deletarConsulta = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/consultas/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await carregarConsultas()
      }
    } catch (error) {
      console.error('Erro ao deletar consulta:', error)
    }
  }

  const formatarDataHora = (dataHora) => {
    return new Date(dataHora).toLocaleString('pt-BR')
  }

  const abrirEdicaoPaciente = (paciente) => {
    setEditandoPaciente({ ...paciente })
    setDialogPacienteAberto(true)
  }

  const abrirEdicaoMedico = (medico) => {
    setEditandoMedico({ ...medico })
    setDialogMedicoAberto(true)
  }

  const abrirEdicaoConsulta = (consulta) => {
    setEditandoConsulta({
      ...consulta,
      pacienteId: consulta.pacienteId.toString(),
      medicoId: consulta.medicoId.toString(),
      dataHora: new Date(consulta.dataHora).toISOString().slice(0, 16)
    })
    setDialogConsultaAberto(true)
  }

  const abrirNovoItem = (tipo) => {
    if (tipo === 'paciente') {
      setEditandoPaciente(null)
      setNovoPaciente({ nome: '', cpf: '' })
      setDialogPacienteAberto(true)
    } else if (tipo === 'medico') {
      setEditandoMedico(null)
      setNovoMedico({ nome: '', especialidade: '' })
      setDialogMedicoAberto(true)
    } else if (tipo === 'consulta') {
      setEditandoConsulta(null)
      setNovaConsulta({ pacienteId: '', medicoId: '', dataHora: '' })
      setDialogConsultaAberto(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Clínica Médica</h1>
          <p className="text-gray-600">Gerencie pacientes, médicos e consultas</p>
        </div>

        <Tabs defaultValue="pacientes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pacientes" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Pacientes
            </TabsTrigger>
            <TabsTrigger value="medicos" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Médicos
            </TabsTrigger>
            <TabsTrigger value="consultas" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Consultas
            </TabsTrigger>
          </TabsList>

          {/* Tab Pacientes */}
          <TabsContent value="pacientes">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Pacientes</CardTitle>
                    <CardDescription>
                      Gerencie os pacientes da clínica
                    </CardDescription>
                  </div>
                  <Dialog open={dialogPacienteAberto} onOpenChange={setDialogPacienteAberto}>
                    <DialogTrigger asChild>
                      <Button onClick={() => abrirNovoItem('paciente')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Paciente
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editandoPaciente ? 'Editar Paciente' : 'Novo Paciente'}
                        </DialogTitle>
                        <DialogDescription>
                          {editandoPaciente 
                            ? 'Edite as informações do paciente' 
                            : 'Adicione um novo paciente ao sistema'
                          }
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="nome">Nome</Label>
                          <Input
                            id="nome"
                            value={editandoPaciente ? editandoPaciente.nome : novoPaciente.nome}
                            onChange={(e) => {
                              if (editandoPaciente) {
                                setEditandoPaciente({ ...editandoPaciente, nome: e.target.value })
                              } else {
                                setNovoPaciente({ ...novoPaciente, nome: e.target.value })
                              }
                            }}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="cpf">CPF</Label>
                          <Input
                            id="cpf"
                            value={editandoPaciente ? editandoPaciente.cpf : novoPaciente.cpf}
                            onChange={(e) => {
                              if (editandoPaciente) {
                                setEditandoPaciente({ ...editandoPaciente, cpf: e.target.value })
                              } else {
                                setNovoPaciente({ ...novoPaciente, cpf: e.target.value })
                              }
                            }}
                          />
                        </div>
                      </div>
                      <Button onClick={salvarPaciente}>
                        {editandoPaciente ? 'Atualizar' : 'Salvar'}
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pacientes.map((paciente) => (
                      <TableRow key={paciente.id}>
                        <TableCell>{paciente.id}</TableCell>
                        <TableCell>{paciente.nome}</TableCell>
                        <TableCell>{paciente.cpf}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => abrirEdicaoPaciente(paciente)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deletarPaciente(paciente.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Médicos */}
          <TabsContent value="medicos">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Médicos</CardTitle>
                    <CardDescription>
                      Gerencie os médicos da clínica
                    </CardDescription>
                  </div>
                  <Dialog open={dialogMedicoAberto} onOpenChange={setDialogMedicoAberto}>
                    <DialogTrigger asChild>
                      <Button onClick={() => abrirNovoItem('medico')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Médico
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editandoMedico ? 'Editar Médico' : 'Novo Médico'}
                        </DialogTitle>
                        <DialogDescription>
                          {editandoMedico 
                            ? 'Edite as informações do médico' 
                            : 'Adicione um novo médico ao sistema'
                          }
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="nome-medico">Nome</Label>
                          <Input
                            id="nome-medico"
                            value={editandoMedico ? editandoMedico.nome : novoMedico.nome}
                            onChange={(e) => {
                              if (editandoMedico) {
                                setEditandoMedico({ ...editandoMedico, nome: e.target.value })
                              } else {
                                setNovoMedico({ ...novoMedico, nome: e.target.value })
                              }
                            }}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="especialidade">Especialidade</Label>
                          <Input
                            id="especialidade"
                            value={editandoMedico ? editandoMedico.especialidade : novoMedico.especialidade}
                            onChange={(e) => {
                              if (editandoMedico) {
                                setEditandoMedico({ ...editandoMedico, especialidade: e.target.value })
                              } else {
                                setNovoMedico({ ...novoMedico, especialidade: e.target.value })
                              }
                            }}
                          />
                        </div>
                      </div>
                      <Button onClick={salvarMedico}>
                        {editandoMedico ? 'Atualizar' : 'Salvar'}
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Especialidade</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicos.map((medico) => (
                      <TableRow key={medico.id}>
                        <TableCell>{medico.id}</TableCell>
                        <TableCell>{medico.nome}</TableCell>
                        <TableCell>{medico.especialidade}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => abrirEdicaoMedico(medico)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deletarMedico(medico.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Consultas */}
          <TabsContent value="consultas">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Consultas</CardTitle>
                    <CardDescription>
                      Gerencie as consultas agendadas
                    </CardDescription>
                  </div>
                  <Dialog open={dialogConsultaAberto} onOpenChange={setDialogConsultaAberto}>
                    <DialogTrigger asChild>
                      <Button onClick={() => abrirNovoItem('consulta')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Consulta
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editandoConsulta ? 'Editar Consulta' : 'Nova Consulta'}
                        </DialogTitle>
                        <DialogDescription>
                          {editandoConsulta 
                            ? 'Edite as informações da consulta' 
                            : 'Agende uma nova consulta'
                          }
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="paciente">Paciente</Label>
                          <Select
                            value={editandoConsulta ? editandoConsulta.pacienteId : novaConsulta.pacienteId}
                            onValueChange={(value) => {
                              if (editandoConsulta) {
                                setEditandoConsulta({ ...editandoConsulta, pacienteId: value })
                              } else {
                                setNovaConsulta({ ...novaConsulta, pacienteId: value })
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um paciente" />
                            </SelectTrigger>
                            <SelectContent>
                              {pacientes.map((paciente) => (
                                <SelectItem key={paciente.id} value={paciente.id.toString()}>
                                  {paciente.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="medico">Médico</Label>
                          <Select
                            value={editandoConsulta ? editandoConsulta.medicoId : novaConsulta.medicoId}
                            onValueChange={(value) => {
                              if (editandoConsulta) {
                                setEditandoConsulta({ ...editandoConsulta, medicoId: value })
                              } else {
                                setNovaConsulta({ ...novaConsulta, medicoId: value })
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um médico" />
                            </SelectTrigger>
                            <SelectContent>
                              {medicos.map((medico) => (
                                <SelectItem key={medico.id} value={medico.id.toString()}>
                                  {medico.nome} - {medico.especialidade}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="dataHora">Data e Hora</Label>
                          <Input
                            id="dataHora"
                            type="datetime-local"
                            value={editandoConsulta ? editandoConsulta.dataHora : novaConsulta.dataHora}
                            onChange={(e) => {
                              if (editandoConsulta) {
                                setEditandoConsulta({ ...editandoConsulta, dataHora: e.target.value })
                              } else {
                                setNovaConsulta({ ...novaConsulta, dataHora: e.target.value })
                              }
                            }}
                          />
                        </div>
                      </div>
                      <Button onClick={salvarConsulta}>
                        {editandoConsulta ? 'Atualizar' : 'Salvar'}
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Médico</TableHead>
                      <TableHead>Especialidade</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {consultas.map((consulta) => (
                      <TableRow key={consulta.id}>
                        <TableCell>{consulta.id}</TableCell>
                        <TableCell>{consulta.pacienteNome}</TableCell>
                        <TableCell>{consulta.medicoNome}</TableCell>
                        <TableCell>{consulta.medicoEspecialidade}</TableCell>
                        <TableCell>{formatarDataHora(consulta.dataHora)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => abrirEdicaoConsulta(consulta)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deletarConsulta(consulta.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

