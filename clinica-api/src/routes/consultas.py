from flask import Blueprint, request, jsonify
from datetime import datetime
from src.models.models import db, HoraMarcada, Paciente, Medico

consultas_bp = Blueprint('consultas', __name__)

@consultas_bp.route('/consultas', methods=['GET'])
def listar_consultas():
    try:
        consultas = HoraMarcada.query.all()
        return jsonify([consulta.to_dict() for consulta in consultas]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@consultas_bp.route('/consultas', methods=['POST'])
def criar_consulta():
    try:
        data = request.get_json()
        
        if not data or not data.get('paciente') or not data.get('medico') or not data.get('dataHora'):
            return jsonify({'error': 'Paciente, médico e data/hora são obrigatórios'}), 400
        
        paciente_id = data['paciente']['id']
        medico_id = data['medico']['id']
        
        # Verificar se paciente e médico existem
        paciente = Paciente.query.get(paciente_id)
        medico = Medico.query.get(medico_id)
        
        if not paciente:
            return jsonify({'error': 'Paciente não encontrado'}), 404
        
        if not medico:
            return jsonify({'error': 'Médico não encontrado'}), 404
        
        # Converter string de data para datetime
        try:
            data_hora = datetime.fromisoformat(data['dataHora'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Formato de data/hora inválido'}), 400
        
        nova_consulta = HoraMarcada(
            paciente_id=paciente_id,
            medico_id=medico_id,
            data_hora=data_hora
        )
        
        db.session.add(nova_consulta)
        db.session.commit()
        
        return jsonify(nova_consulta.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@consultas_bp.route('/consultas/<int:id>', methods=['GET'])
def buscar_consulta(id):
    try:
        consulta = HoraMarcada.query.get_or_404(id)
        return jsonify(consulta.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@consultas_bp.route('/consultas/paciente/<int:paciente_id>', methods=['GET'])
def listar_consultas_por_paciente(paciente_id):
    try:
        consultas = HoraMarcada.query.filter_by(paciente_id=paciente_id).all()
        return jsonify([consulta.to_dict() for consulta in consultas]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@consultas_bp.route('/consultas/medico/<int:medico_id>', methods=['GET'])
def listar_consultas_por_medico(medico_id):
    try:
        consultas = HoraMarcada.query.filter_by(medico_id=medico_id).all()
        return jsonify([consulta.to_dict() for consulta in consultas]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@consultas_bp.route('/consultas/<int:id>', methods=['PUT'])
def atualizar_consulta(id):
    try:
        consulta = HoraMarcada.query.get_or_404(id)
        data = request.get_json()
        
        if not data or not data.get('paciente') or not data.get('medico') or not data.get('dataHora'):
            return jsonify({'error': 'Paciente, médico e data/hora são obrigatórios'}), 400
        
        paciente_id = data['paciente']['id']
        medico_id = data['medico']['id']
        
        # Verificar se paciente e médico existem
        paciente = Paciente.query.get(paciente_id)
        medico = Medico.query.get(medico_id)
        
        if not paciente:
            return jsonify({'error': 'Paciente não encontrado'}), 404
        
        if not medico:
            return jsonify({'error': 'Médico não encontrado'}), 404
        
        # Converter string de data para datetime
        try:
            data_hora = datetime.fromisoformat(data['dataHora'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Formato de data/hora inválido'}), 400
        
        consulta.paciente_id = paciente_id
        consulta.medico_id = medico_id
        consulta.data_hora = data_hora
        
        db.session.commit()
        
        return jsonify(consulta.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@consultas_bp.route('/consultas/<int:id>', methods=['DELETE'])
def deletar_consulta(id):
    try:
        consulta = HoraMarcada.query.get_or_404(id)
        
        db.session.delete(consulta)
        db.session.commit()
        
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

