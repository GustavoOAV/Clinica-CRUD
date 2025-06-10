from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Paciente(db.Model):
    __tablename__ = 'pacientes'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    
    # Relacionamento com consultas
    consultas = db.relationship('HoraMarcada', backref='paciente_ref', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'cpf': self.cpf
        }

class Medico(db.Model):
    __tablename__ = 'medicos'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    especialidade = db.Column(db.String(100), nullable=False)
    
    # Relacionamento com consultas
    consultas = db.relationship('HoraMarcada', backref='medico_ref', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'especialidade': self.especialidade
        }

class HoraMarcada(db.Model):
    __tablename__ = 'horas_marcadas'
    
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('pacientes.id'), nullable=False)
    medico_id = db.Column(db.Integer, db.ForeignKey('medicos.id'), nullable=False)
    data_hora = db.Column(db.DateTime, nullable=False)
    
    # Relacionamentos
    paciente = db.relationship('Paciente', backref='consultas_paciente')
    medico = db.relationship('Medico', backref='consultas_medico')
    
    def to_dict(self):
        return {
            'id': self.id,
            'pacienteId': self.paciente_id,
            'medicoId': self.medico_id,
            'dataHora': self.data_hora.isoformat() if self.data_hora else None,
            'pacienteNome': self.paciente.nome if self.paciente else None,
            'medicoNome': self.medico.nome if self.medico else None,
            'medicoEspecialidade': self.medico.especialidade if self.medico else None
        }

