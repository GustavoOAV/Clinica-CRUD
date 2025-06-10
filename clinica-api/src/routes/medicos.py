from flask import Blueprint, request, jsonify
from src.models.models import db, Medico

medicos_bp = Blueprint('medicos', __name__)

@medicos_bp.route('/medicos', methods=['GET'])
def listar_medicos():
    try:
        medicos = Medico.query.all()
        return jsonify([medico.to_dict() for medico in medicos]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@medicos_bp.route('/medicos', methods=['POST'])
def criar_medico():
    try:
        data = request.get_json()
        
        if not data or not data.get('nome') or not data.get('especialidade'):
            return jsonify({'error': 'Nome e especialidade são obrigatórios'}), 400
        
        novo_medico = Medico(
            nome=data['nome'],
            especialidade=data['especialidade']
        )
        
        db.session.add(novo_medico)
        db.session.commit()
        
        return jsonify(novo_medico.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@medicos_bp.route('/medicos/<int:id>', methods=['GET'])
def buscar_medico(id):
    try:
        medico = Medico.query.get_or_404(id)
        return jsonify(medico.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@medicos_bp.route('/medicos/<int:id>', methods=['PUT'])
def atualizar_medico(id):
    try:
        medico = Medico.query.get_or_404(id)
        data = request.get_json()
        
        if not data or not data.get('nome') or not data.get('especialidade'):
            return jsonify({'error': 'Nome e especialidade são obrigatórios'}), 400
        
        medico.nome = data['nome']
        medico.especialidade = data['especialidade']
        
        db.session.commit()
        
        return jsonify(medico.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@medicos_bp.route('/medicos/<int:id>', methods=['DELETE'])
def deletar_medico(id):
    try:
        medico = Medico.query.get_or_404(id)
        
        # Verificar se há consultas associadas
        if medico.consultas:
            return jsonify({'error': 'Não é possível deletar médico com consultas agendadas'}), 400
        
        db.session.delete(medico)
        db.session.commit()
        
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

