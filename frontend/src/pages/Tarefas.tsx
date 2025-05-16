import React, { useEffect, useState } from 'react';
import { Button, Input, List, message, Space, Tag } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'concluida';
}

const Tarefas: React.FC = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const buscarTarefas = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/tarefas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTarefas(res.data);
    } catch (error) {
      message.error('Erro ao buscar tarefas. Faça login novamente.');
      navigate('/');
    }
  };

  useEffect(() => {
    buscarTarefas();
  }, []);

  const tarefasFiltradas = tarefas.filter((t) =>
    t.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 16 }}>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Filtrar por título..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <Button onClick={buscarTarefas}>Atualizar</Button>
      </Space>

      <List
        header={<h2>Minhas Tarefas</h2>}
        bordered
        dataSource={tarefasFiltradas}
        renderItem={(tarefa) => (
          <List.Item>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ fontWeight: 600 }}>{tarefa.titulo}</div>
              <div>{tarefa.descricao}</div>
              <Tag color={tarefa.status === 'concluida' ? 'green' : 'orange'}>
                {tarefa.status}
              </Tag>
            </Space>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Tarefas;
