from flask import Blueprint, request, jsonify
from src.models.models import db, Paciente

pacientes_bp = Blueprint('pacientes', __name__)

@pacientes_bp.route('/pacientes', methods=['GET'])
def listar_pacientes():
    try:
        pacientes = Paciente.query.all()
        return jsonify([paciente.to_dict() for paciente in pacientes]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pacientes_bp.route('/pacientes', methods=['POST'])
def criar_paciente():
    try:
        data = request.get_json()
        
        if not data or not data.get('nome') or not data.get('cpf'):
            return jsonify({'error': 'Nome e CPF são obrigatórios'}), 400
        
        # Verificar se CPF já existe
        paciente_existente = Paciente.query.filter_by(cpf=data['cpf']).first()
        if paciente_existente:
            return jsonify({'error': 'CPF já cadastrado'}), 400
        
        novo_paciente = Paciente(
            nome=data['nome'],
            cpf=data['cpf']
        )
        
        db.session.add(novo_paciente)
        db.session.commit()
        
        return jsonify(novo_paciente.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@pacientes_bp.route('/pacientes/<int:id>', methods=['GET'])
def buscar_paciente(id):
    try:
        paciente = Paciente.query.get_or_404(id)
        return jsonify(paciente.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@pacientes_bp.route('/pacientes/cpf/<cpf>', methods=['GET'])
def buscar_paciente_por_cpf(cpf):
    try:
        paciente = Paciente.query.filter_by(cpf=cpf).first()
        if not paciente:
            return jsonify({'error': 'Paciente não encontrado'}), 404
        return jsonify(paciente.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pacientes_bp.route('/pacientes/<int:id>', methods=['PUT'])
def atualizar_paciente(id):
    try:
        paciente = Paciente.query.get_or_404(id)
        data = request.get_json()
        
        if not data or not data.get('nome') or not data.get('cpf'):
            return jsonify({'error': 'Nome e CPF são obrigatórios'}), 400
        
        # Verificar se CPF já existe para outro paciente
        paciente_existente = Paciente.query.filter_by(cpf=data['cpf']).first()
        if paciente_existente and paciente_existente.id != id:
            return jsonify({'error': 'CPF já cadastrado para outro paciente'}), 400
        
        paciente.nome = data['nome']
        paciente.cpf = data['cpf']
        
        db.session.commit()
        
        return jsonify(paciente.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@pacientes_bp.route('/pacientes/<int:id>', methods=['DELETE'])
def deletar_paciente(id):
    try:
        paciente = Paciente.query.get_or_404(id)
        
        # Verificar se há consultas associadas
        if paciente.consultas:
            return jsonify({'error': 'Não é possível deletar paciente com consultas agendadas'}), 400
        
        db.session.delete(paciente)
        db.session.commit()
        
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

